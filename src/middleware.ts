import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if ((req.nextauth.token as any)?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    secret: process.env.NEXTAUTH_SECRET || "supersecret",
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
