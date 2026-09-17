import fs from "node:fs";
import path from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function loadEnv(envPath: string): Record<string, string> {
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
    }
  }
  return env;
}

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

async function main() {
  const env = loadEnv(path.join(process.cwd(), ".env.local"));
  const accountId = env.R2_ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const bucket = env.R2_BUCKET || "fabulla";
  const publicUrl = env.R2_PUBLIC_URL?.replace(/\/+$/, "");

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error("Missing R2 credentials in .env.local");
    process.exit(1);
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const srcDir = path.join(process.cwd(), "public", "images", "products");
  if (!fs.existsSync(srcDir)) {
    console.error("Product images directory not found:", srcDir);
    process.exit(1);
  }

  console.log(`=== Uploading Catalog Images to Cloudflare R2 Bucket "${bucket}" ===`);
  console.log(`Public URL: ${publicUrl}`);

  const folders = fs.readdirSync(srcDir);
  const queue: { folder: string; file: string; filePath: string; contentType: string }[] = [];

  for (const folder of folders) {
    const folderPath = path.join(srcDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      queue.push({ folder, file, filePath: path.join(folderPath, file), contentType });
    }
  }

  console.log(`Found ${queue.length} images to upload.`);
  let completed = 0;

  async function uploadWithRetry(cmd: PutObjectCommand, maxRetries = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await s3.send(cmd);
        return;
      } catch (err: any) {
        if (attempt === maxRetries) throw err;
        await new Promise((res) => setTimeout(res, 1000 * attempt));
      }
    }
  }

  // Upload in concurrent batches of 4
  const BATCH_SIZE = 4;
  for (let i = 0; i < queue.length; i += BATCH_SIZE) {
    const batch = queue.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async ({ folder, file, filePath, contentType }) => {
        const buffer = fs.readFileSync(filePath);
        const key = `images/products/${folder}/${file}`;

        await uploadWithRetry(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
          })
        );
        completed++;
        console.log(`[${completed}/${queue.length}] ✓ Uploaded ${folder}/${file} (${(buffer.length / 1024).toFixed(1)} KB)`);
      })
    );
  }

  console.log(`\n✓ All ${completed} images successfully synced to Cloudflare R2!`);
  if (publicUrl) {
    const sample = `${publicUrl}/images/products/01-round-halo-ring/front-white.png`;
    console.log(`Testing sample public read: ${sample}`);
    const res = await fetch(sample);
    console.log(`Sample fetch status: ${res.status} ${res.statusText}`);
  }
}

main().catch(console.error);


