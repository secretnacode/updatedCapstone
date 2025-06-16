import { NextRequest, NextResponse } from "next/server";

export default async function Middleware(req: NextRequest) {
  // logging all the incoming requests for debugging purposes
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Method: ${req.method}`);
  console.log(`Request Body: ${req.body}`);

  // handling CORS
  const res = NextResponse.next();

  // setting which url can access the API routes,
  // as of now its only set to "*" which means all url is allowed to access the API routes
  // so in production or when deployed, this should be set to the url of the frontend app lik "capstone_proj.com"
  res.headers.set("Access-Control-Allow-Origin", "*");

  // setting which methods are allowed to access the API routes
  // as of now its only set to "GET, POST, PUT, DELETE, OPTIONS" which means all methods are allowed to access the API routes
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // setting which headers are allowed to access the API routes
  // as of now its only set to "Content-Type, Authorization" which means all headers are allowed to access the API routes
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // setting which credentials are allowed to access the API routes
  // as of now its only set to "true" which means all credentials are allowed to access the API routes
  res.headers.set("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: res.headers,
    });
  }

  return res; // returning the next response
}

export const config = {
  matcher: [
    "/api/:path*", // Matches all routes under /api/
  ],
};
