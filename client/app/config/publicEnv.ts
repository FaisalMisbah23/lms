function requirePublicEnvInProd(name: string, value: string | undefined): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window !== "undefined") return;
  if (!value?.trim()) {
    throw new Error(`${name} must be set at build time for production.`);
  }
}

function withTrailingSlash(base: string): string {
  return base.endsWith("/") ? base : `${base}/`;
}

export function getPublicApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SERVER_URI?.trim();
  requirePublicEnvInProd("NEXT_PUBLIC_SERVER_URI", raw);
  return withTrailingSlash(raw || "http://localhost:8000/api/v1/");
}

export function getPublicSocketUri(): string {
  const raw = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI?.trim();
  requirePublicEnvInProd("NEXT_PUBLIC_SOCKET_SERVER_URI", raw);
  return withTrailingSlash(raw || "http://localhost:8000/");
}
