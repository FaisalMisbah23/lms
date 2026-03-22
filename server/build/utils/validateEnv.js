"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateServerEnv = validateServerEnv;
const productionRequiredStrings = [
    "PORT",
    "MONGO_URI",
    "REDIS_URL",
    "ORIGIN",
    "ACCESS_TOKEN",
    "REFRESH_TOKEN",
    "ACTIVATION_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
];
function missingSmtp() {
    var _a, _b, _c, _d;
    if (!((_a = process.env.SMTP_EMAIL) === null || _a === void 0 ? void 0 : _a.trim()) || !((_b = process.env.SMTP_PASSWORD) === null || _b === void 0 ? void 0 : _b.trim())) {
        return "SMTP_EMAIL and SMTP_PASSWORD are required in production.";
    }
    if (!((_c = process.env.SMTP_HOST) === null || _c === void 0 ? void 0 : _c.trim()) && !((_d = process.env.SMTP_SERVICE) === null || _d === void 0 ? void 0 : _d.trim())) {
        return "Either SMTP_HOST or SMTP_SERVICE is required in production.";
    }
    return null;
}
function validateServerEnv() {
    if (process.env.NODE_ENV !== "production") {
        return;
    }
    const missing = [];
    for (const key of productionRequiredStrings) {
        const v = process.env[key];
        if (v === undefined || String(v).trim() === "") {
            missing.push(key);
        }
    }
    const smtpErr = missingSmtp();
    if (smtpErr) {
        console.error(`❌ ${smtpErr}`);
        process.exit(1);
    }
    if (missing.length > 0) {
        console.error(`❌ Missing required environment variables for production:\n  ${missing.join("\n  ")}`);
        process.exit(1);
    }
}
