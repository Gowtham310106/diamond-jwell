import fs from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";
import { seedFor } from "../src/lib/cms/seed.ts";
import type { CollectionName } from "../src/lib/cms/types";

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

async function main() {
  console.log("Starting Fabulla database and CMS re-seed...");
  const collections: CollectionName[] = [
    "settings",
    "categories",
    "collections",
    "products",
    "faqs",
    "media",
  ];

  // 1. Update local .data/cms.json
  const dataDir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const cmsJsonPath = path.join(dataDir, "cms.json");
  let localData: Record<string, unknown[]> = {};
  if (fs.existsSync(cmsJsonPath)) {
    try {
      localData = JSON.parse(fs.readFileSync(cmsJsonPath, "utf8"));
    } catch {
      localData = {};
    }
  }

  for (const col of collections) {
    localData[col] = seedFor(col);
  }
  fs.writeFileSync(cmsJsonPath, JSON.stringify(localData, null, 2), "utf8");
  console.log("✓ Updated local .data/cms.json with fresh catalog and settings.");

  // 2. Update MongoDB Atlas if MONGODB_URI is provided in .env.local
  const env = loadEnv(path.join(process.cwd(), ".env.local"));
  const mongoUri = env.MONGODB_URI || process.env.MONGODB_URI;
  const dbName = env.MONGODB_DB || process.env.MONGODB_DB || "fabulla";

  if (!mongoUri) {
    console.log("No MONGODB_URI found. Finished local store update.");
    return;
  }

  console.log(`Connecting to MongoDB Atlas (${dbName})...`);
  const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("✓ Connected to MongoDB.");

    for (const col of collections) {
      const docs = seedFor(col) as Array<{ _id: string } & Record<string, unknown>>;
      if (!docs.length) continue;

      const mongoCol = db.collection(col);
      // Remove obsolete seed records in this collection and re-populate
      await mongoCol.deleteMany({});
      await mongoCol.insertMany(docs);
      console.log(`✓ Seeded ${docs.length} documents into MongoDB collection "${col}".`);
    }

    console.log("All collections seeded successfully into MongoDB Atlas!");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("MongoDB seeding error:", message);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
