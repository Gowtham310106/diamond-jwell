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

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error("Missing R2 credentials in .env.local");
    process.exit(1);
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const srcDir = "c:/Users/gowtham/Downloads/Fabulla-Multi-Angle-Hero-Package/Fabulla-Multi-Angle-Hero-Package/products";
  if (!fs.existsSync(srcDir)) {
    console.error("Source product directory not found:", srcDir);
    process.exit(1);
  }

  console.log(`Uploading all product images to Cloudflare R2 bucket "${bucket}"...`);
  const folders = fs.readdirSync(srcDir);
  let totalUploaded = 0;

  for (const folder of folders) {
    const folderPath = path.join(srcDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      const filePath = path.join(folderPath, file);
      const buffer = fs.readFileSync(filePath);
      const key = `products/${folder}/${file}`;

      process.stdout.write(`Uploading ${key} (${(buffer.length / 1024).toFixed(1)} KB)... `);
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        })
      );
      console.log("✓");
      totalUploaded++;
    }
  }

  console.log(`\nSuccessfully uploaded ${totalUploaded} images straight to Cloudflare R2!`);
}

main().catch(console.error);
