import { NextRequest, NextResponse } from "next/server";

// Set to your real apex domain in production (e.g. "yourplatform.com") so
// "alpha-motors.yourplatform.com" rewrites to "/alpha-motors" internally.
// In local dev (localhost/127.0.0.1) there is no subdomain to parse, so
// storefronts are simply addressed by path -- e.g. localhost:3001/alpha-motors.
const ROOT_DOMAIN = process.env.STOREFRONT_ROOT_DOMAIN ?? "";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0];

  if (!ROOT_DOMAIN || hostname === "localhost" || hostname === "127.0.0.1" || hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const slug = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
    const url = request.nextUrl.clone();
    url.pathname = `/${slug}${request.nextUrl.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
