import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "elearning-lms.vercel.app";
const LEGACY_HOSTS = new Set([
  "lms-git-main-faisal-misbahs-projects.vercel.app",
  "lms-faisal-misbahs-projects.vercel.app",
  "mern-multivendor.vercel.app",
]);

export function middleware(request: NextRequest) {
  const hostHeader =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const host = hostHeader.split(":")[0].toLowerCase();

  if (LEGACY_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
