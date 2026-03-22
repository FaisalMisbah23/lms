"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOrigins = parseOrigins;
/** Parse ORIGIN env: single URL or comma-separated list (e.g. prod + Vercel previews). */
function parseOrigins() {
    const raw = process.env.ORIGIN || "http://localhost:3000";
    const list = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (list.length === 1)
        return list[0];
    return list;
}
