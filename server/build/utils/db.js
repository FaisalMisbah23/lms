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
const dbUrl = process.env.MONGO_URI || "";
let attempts = 0;
const maxAttempts = process.env.NODE_ENV === "production"
    ? 12
    : Number(process.env.DB_CONNECT_MAX_ATTEMPTS || 8);
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!dbUrl) {
        console.error("MONGO_URI is not set");
        if (process.env.NODE_ENV === "production") {
            process.exit(1);
        }
        return;
    }
    attempts += 1;
    try {
        const data = yield mongoose_1.default.connect(dbUrl);
        console.log(`✅ MongoDB connected at host: ${data.connection.host}`);
        attempts = 0;
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`MongoDB connection attempt ${attempts} failed:`, message);
        if (attempts >= maxAttempts) {
            console.error("MongoDB: max connection attempts reached, exiting.");
            process.exit(1);
        }
        setTimeout(connectToDb, 5000);
    }
});
exports.default = connectToDb;
