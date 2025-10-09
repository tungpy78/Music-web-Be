"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Song_model_1 = __importDefault(require("../models/Song.model"));
const Artist_model_1 = __importDefault(require("../models/Artist.model"));
const removeVietnameseTones_1 = require("../Utils/removeVietnameseTones");
const BATCH_SIZE = 500;
function backfillSongs() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("Backfilling Songs.search_title ...");
        const cursor = Song_model_1.default.find({}, { _id: 1, title: 1, search_title: 1 }).cursor();
        let ops = [];
        let count = 0;
        let modified = 0;
        for (let doc = yield cursor.next(); doc != null; doc = yield cursor.next()) {
            const current = ((_a = doc.search_title) !== null && _a !== void 0 ? _a : "").toString();
            const computed = doc.title ? (0, removeVietnameseTones_1.removeVietnameseTones)(doc.title).toLowerCase() : "";
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
                yield Song_model_1.default.bulkWrite(ops, { ordered: false });
                console.log(`Songs processed: ${count}, updated: ${modified}`);
                ops = [];
            }
        }
        if (ops.length) {
            yield Song_model_1.default.bulkWrite(ops, { ordered: false });
            console.log(`Songs processed: ${count}, updated: ${modified}`);
        }
        console.log("Done Songs.");
    });
}
function backfillArtists() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("Backfilling Artist.search_name ...");
        const cursor = Artist_model_1.default.find({}, { _id: 1, name: 1, search_name: 1 }).cursor();
        let ops = [];
        let count = 0;
        let modified = 0;
        for (let doc = yield cursor.next(); doc != null; doc = yield cursor.next()) {
            const current = ((_a = doc.search_name) !== null && _a !== void 0 ? _a : "").toString();
            const computed = doc.name ? (0, removeVietnameseTones_1.removeVietnameseTones)(doc.name).toLowerCase() : "";
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
                yield Artist_model_1.default.bulkWrite(ops, { ordered: false });
                console.log(`Artists processed: ${count}, updated: ${modified}`);
                ops = [];
            }
        }
        if (ops.length) {
            yield Artist_model_1.default.bulkWrite(ops, { ordered: false });
            console.log(`Artists processed: ${count}, updated: ${modified}`);
        }
        console.log("Done Artists.");
    });
}
function ensureIndexes() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
            Song_model_1.default.collection.createIndex({ search_title: 1 }),
            Artist_model_1.default.collection.createIndex({ search_name: 1 }),
        ]);
        console.log("Indexes ensured for search_title and search_name.");
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = process.env.MONGO_URL || "mongodb+srv://chinh:chinh123@websitemusic.0cjbbpj.mongodb.net/music_app?retryWrites=true&w=majority&appName=WebsiteMusic";
        yield mongoose_1.default.connect(uri);
        console.log("Connected to MongoDB");
        try {
            yield ensureIndexes();
            yield backfillSongs();
            yield backfillArtists();
        }
        catch (err) {
            console.error(err);
        }
        finally {
            yield mongoose_1.default.disconnect();
            console.log("Disconnected.");
        }
    });
}
main();
