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
jest.mock("../utils/redis", () => ({
    redis: {
        get: jest.fn(() => Promise.resolve(null)),
        set: jest.fn(() => Promise.resolve("OK")),
        del: jest.fn(() => Promise.resolve(1)),
    },
}));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
describe("API smoke", () => {
    it("GET /health returns ok", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    }));
    it("GET /test returns success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/test");
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    }));
    it("GET /api/v1/me without session returns error", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/v1/me");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    }));
});
