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
] as const;

function missingSmtp(): string | null {
  if (!process.env.SMTP_EMAIL?.trim() || !process.env.SMTP_PASSWORD?.trim()) {
    return "SMTP_EMAIL and SMTP_PASSWORD are required in production.";
  }
  if (!process.env.SMTP_HOST?.trim() && !process.env.SMTP_SERVICE?.trim()) {
    return "Either SMTP_HOST or SMTP_SERVICE is required in production.";
  }
  return null;
}

export function validateServerEnv(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const missing: string[] = [];
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
    console.error(
      `❌ Missing required environment variables for production:\n  ${missing.join("\n  ")}`
    );
    process.exit(1);
  }
}
