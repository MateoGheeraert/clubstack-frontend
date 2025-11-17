import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to validate JWT token
function isTokenValid(token: string): boolean {
  try {
    // Decode the JWT token (without verification, just to check expiration)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }
    
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );
    
    // Check if token has expired
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      if (currentTime >= expirationTime) {
        return false; // Token has expired
      }
    }
    
    return true;
  } catch {
    // If we can't parse the token, it's invalid
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/register"];
  
  // Check if current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Validate token
  const hasValidToken = token ? isTokenValid(token) : false;
  
  // Root path - redirect based on auth status
  if (pathname === "/") {
    if (hasValidToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If trying to access public paths with valid token, redirect to dashboard
  if (isPublicPath && hasValidToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If trying to access protected routes without valid token, redirect to login
  if (!isPublicPath && !hasValidToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Clear any invalid tokens
    response.cookies.delete("token");
    response.cookies.delete("refreshToken");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
