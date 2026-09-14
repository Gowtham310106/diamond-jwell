/**
 * Document store.
 *
 * Two backends behind one four-method interface:
 *
 *   MongoDB   when MONGODB_URI is set. Atlas in production.
 *   File      otherwise: .data/cms.json next to the project. Local dev, the
 *             build, and this sandbox. Writes are durable on a laptop and
 *             ephemeral on serverless, which is fine — nobody runs production
 *             without the URI.
 *
 * The interface is deliberately tiny — all / get / put / remove — and every
 * query (filters, search, sorting, pagination) happens in JavaScript over the
 * loaded collection. A studio's catalog is a few hundred documents; loading it
 * whole is cheaper than a round-trip per filter and it means there is exactly
 * one query implementation for both backends. Reads are memoised per request.
 *
 * Empty collections are seeded on first read, so a fresh Atlas cluster serves
 * the full site the moment the URI is set.
 */

import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { MongoClient, type Db } from "mongodb";
import type { CollectionName, CollectionTypes, Doc } from "./types";
import { seedFor } from "./seed";

type AnyDoc = Doc & Record<string, unknown>;

export interface Store {
  all<K extends CollectionName>(col: K): Promise<CollectionTypes[K][]>;
  get<K extends CollectionName>(col: K, id: string): Promise<CollectionTypes[K] | null>;
  put<K extends CollectionName>(col: K, doc: CollectionTypes[K]): Promise<CollectionTypes[K]>;
  remove(col: CollectionName, id: string): Promise<void>;
  /** For the admin health panel. */
  describe(): { backend: "mongodb" | "file"; detail: string };
}

export function newId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

export function now(): string {
  return new Date().toISOString();
}

/* ------------------------------------------------------------------------ */
/* MongoDB                                                                   */
/* ------------------------------------------------------------------------ */

declare global {
  // Survives HMR in development so we do not open a client per reload.
  var __fabullaMongo: Promise<MongoClient> | undefined;
  var __fabullaFileStore: FileStore | undefined;
}

function mongoClient(uri: string): Promise<MongoClient> {
  if (!globalThis.__fabullaMongo) {
    globalThis.__fabullaMongo = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8_000,
    }).connect();
  }
  return globalThis.__fabullaMongo;
}

class MongoStore implements Store {
  private seeded = new Set<string>();

  constructor(private uri: string, private dbName: string) {}

  private async db(): Promise<Db> {
    const client = await mongoClient(this.uri);
    return client.db(this.dbName);
  }

  /** String `_id`s throughout, so the schema says so and the driver stops expecting ObjectIds. */
  private col(db: Db, name: CollectionName) {
    return db.collection<AnyDoc>(name);
  }

  private async ensureSeeded(db: Db, col: CollectionName) {
    if (this.seeded.has(col)) return;
    const count = await this.col(db, col).estimatedDocumentCount();
    if (count === 0) {
      const docs = seedFor(col) as AnyDoc[];
      if (docs.length) await this.col(db, col).insertMany(docs);
    }
    this.seeded.add(col);
  }

  async all<K extends CollectionName>(col: K) {
    const db = await this.db();
    await this.ensureSeeded(db, col);
    const docs = await this.col(db, col).find({}).toArray();
    return docs as unknown as CollectionTypes[K][];
  }

  async get<K extends CollectionName>(col: K, id: string) {
    const db = await this.db();
    await this.ensureSeeded(db, col);
    const doc = await this.col(db, col).findOne({ _id: id });
    return (doc as unknown as CollectionTypes[K]) ?? null;
  }

  async put<K extends CollectionName>(col: K, doc: CollectionTypes[K]) {
    const db = await this.db();
    await this.ensureSeeded(db, col);
    const full = doc as unknown as AnyDoc;
    await this.col(db, col).replaceOne({ _id: full._id }, full, { upsert: true });
    return doc;
  }

  async remove(col: CollectionName, id: string) {
    const db = await this.db();
    await this.col(db, col).deleteOne({ _id: id });
  }

  describe() {
    const host = this.uri.replace(/^mongodb(\+srv)?:\/\/([^@]+@)?/, "").split("/")[0];
    return { backend: "mongodb" as const, detail: `${host} / ${this.dbName}` };
  }
}

/* ------------------------------------------------------------------------ */
/* File                                                                      */
/* ------------------------------------------------------------------------ */

type FileShape = Partial<Record<CollectionName, AnyDoc[]>>;

class FileStore implements Store {
  private data: FileShape | null = null;
  private writing: Promise<void> = Promise.resolve();
  readonly file = path.join(process.cwd(), ".data", "cms.json");

  private async load(): Promise<FileShape> {
    if (this.data) return this.data;
    try {
      this.data = JSON.parse(await fs.readFile(this.file, "utf8")) as FileShape;
    } catch {
      this.data = {};
    }
    return this.data;
  }

  private async flush() {
    const snapshot = JSON.stringify(this.data, null, 2);
    // Serialise writes so two admin saves cannot interleave.
    this.writing = this.writing.then(async () => {
      await fs.mkdir(path.dirname(this.file), { recursive: true });
      await fs.writeFile(this.file, snapshot, "utf8");
    });
    await this.writing;
  }

  private async collection(col: CollectionName): Promise<AnyDoc[]> {
    const data = await this.load();
    if (!data[col]) {
      data[col] = seedFor(col) as AnyDoc[];
      await this.flush();
    }
    return data[col]!;
  }

  async all<K extends CollectionName>(col: K) {
    const docs = await this.collection(col);
    return structuredClone(docs) as unknown as CollectionTypes[K][];
  }

  async get<K extends CollectionName>(col: K, id: string) {
    const docs = await this.collection(col);
    const doc = docs.find((d) => d._id === id);
    return doc ? (structuredClone(doc) as unknown as CollectionTypes[K]) : null;
  }

  async put<K extends CollectionName>(col: K, doc: CollectionTypes[K]) {
    const docs = await this.collection(col);
    const i = docs.findIndex((d) => d._id === doc._id);
    const copy = structuredClone(doc) as unknown as AnyDoc;
    if (i >= 0) docs[i] = copy;
    else docs.push(copy);
    await this.flush();
    return doc;
  }

  async remove(col: CollectionName, id: string) {
    const docs = await this.collection(col);
    const i = docs.findIndex((d) => d._id === id);
    if (i >= 0) {
      docs.splice(i, 1);
      await this.flush();
    }
  }

  describe() {
    return { backend: "file" as const, detail: path.relative(process.cwd(), this.file) };
  }
}

/* ------------------------------------------------------------------------ */
/* Facade                                                                    */
/* ------------------------------------------------------------------------ */

let mongo: MongoStore | null = null;

export function getStore(): Store {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    if (!mongo) mongo = new MongoStore(uri, process.env.MONGODB_DB || "fabulla");
    return mongo;
  }
  if (!globalThis.__fabullaFileStore) globalThis.__fabullaFileStore = new FileStore();
  return globalThis.__fabullaFileStore;
}

/** Per-request memoised read, so a page that needs settings five times loads them once. */
export const loadAll = cache(async <K extends CollectionName>(col: K) => {
  return getStore().all(col);
});

/** Health check for the admin integrations panel. */
export async function pingStore(): Promise<{ ok: boolean; detail: string }> {
  const store = getStore();
  try {
    await store.all("settings");
    return { ok: true, detail: store.describe().detail };
  } catch (error) {
    return { ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}
