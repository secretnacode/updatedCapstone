import { NextRequest, NextResponse } from "next/server";
import { GetSession } from "./lib/session";

const authorizedPath = new Map<string, string[]>();
authorizedPath.set(`agriculturist`, [`/agriculturist`]);
authorizedPath.set(`farmer`, [`/farmer`, `/farmerDetails`]);
authorizedPath.set(`admin`, [`/agriculturist`]);
authorizedPath.set(`leader`, [`/farmer`, `/farmerDetails`, `/farmerLeader`]);
const publicPath = [`/`, `/unauthorized`];

export default async function Middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();

    // logging all the incoming requests for debugging purposes
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Method: ${req.method}`);

    const { pathname } = req.nextUrl;

    const session = await GetSession();

    // if the current path was defines in the publicPath Variable, the middleware will let it pass through
    if (publicPath.includes(pathname)) return res;

    if (session) {
      const accessiblePath = authorizedPath.get(session.work);
      console.warn(`middleware: you have a session`);

      if (
        accessiblePath &&
        accessiblePath.some((path) => `/${pathname.split("/")[1]}` === path)
      ) {
        console.warn(`middleware: you're authorized to go ${pathname}`);
        return res;
      } else {
        console.warn(`middleware: you're unauthorized to go ${pathname}`);
        return NextResponse.redirect(new URL(`/unauthorized`, req.url));
      }
    } else {
      console.warn(`middleware: you're not logged in`);
      return NextResponse.redirect(new URL(`/`, req.url));
    }
  } catch (error) {
    console.log(`middleware error`);
    console.log(error);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
