/* eslint-disable no-console */
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Song from "../models/Song.model";         // chỉnh path theo dự án của bạn
import Artist from "../models/Artist.model";     // chỉnh path theo dự án của bạn
import { removeVietnameseTones } from "../Utils/removeVietnameseTones";

const BATCH_SIZE = 500;

async function backfillSongs() {
  console.log("Backfilling Songs.search_title ...");

  const cursor = Song.find(
    {},                         // xét tất cả; nếu muốn chỉ doc thiếu field: { $or: [{search_title: {$exists:false}}, {search_title: ""}] }
    { _id: 1, title: 1, search_title: 1 }
  ).cursor();

  let ops: any[] = [];
  let count = 0;
  let modified = 0;

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const current = (doc.search_title ?? "").toString();
    const computed = doc.title ? removeVietnameseTones(doc.title).toLowerCase() : "";

    if (computed && computed !== current) {
      ops.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { search_title: computed } }
        }
      });
      modified++;
    }

    count++;
    if (ops.length >= BATCH_SIZE) {
      await Song.bulkWrite(ops, { ordered: false });
      console.log(`Songs processed: ${count}, updated: ${modified}`);
      ops = [];
    }
  }

  if (ops.length) {
    await Song.bulkWrite(ops, { ordered: false });
    console.log(`Songs processed: ${count}, updated: ${modified}`);
  }

  console.log("Done Songs.");
}

async function backfillArtists() {
  console.log("Backfilling Artist.search_name ...");

  const cursor = Artist.find(
    {},                         // hoặc lọc doc thiếu field như phần Songs
    { _id: 1, name: 1, search_name: 1 }
  ).cursor();

  let ops: any[] = [];
  let count = 0;
  let modified = 0;

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const current = (doc.search_name ?? "").toString();
    const computed = doc.name ? removeVietnameseTones(doc.name).toLowerCase() : "";

    if (computed && computed !== current) {
      ops.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { search_name: computed } }
        }
      });
      modified++;
    }

    count++;
    if (ops.length >= BATCH_SIZE) {
      await Artist.bulkWrite(ops, { ordered: false });
      console.log(`Artists processed: ${count}, updated: ${modified}`);
      ops = [];
    }
  }

  if (ops.length) {
    await Artist.bulkWrite(ops, { ordered: false });
    console.log(`Artists processed: ${count}, updated: ${modified}`);
  }

  console.log("Done Artists.");
}

async function ensureIndexes() {
  // Tạo index để tìm kiếm nhanh
  await Promise.all([
    Song.collection.createIndex({ search_title: 1 }),
    Artist.collection.createIndex({ search_name: 1 }),
  ]);
  console.log("Indexes ensured for search_title and search_name.");
}

async function main() {
  const uri = process.env.MONGO_URL || "mongodb+srv://chinh:chinh123@websitemusic.0cjbbpj.mongodb.net/music_app?retryWrites=true&w=majority&appName=WebsiteMusic"; // sửa cho phù hợp
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  try {
    await ensureIndexes();
    await backfillSongs();
    await backfillArtists();
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

main();
