import { NextRequest, NextResponse } from "next/server";
import { GetSession } from "./lib/session";
import { NotifToUriComponent } from "./util/helper_function/reusableFunction";
import { clerkMiddleware } from "@clerk/nextjs/server";

const authorizedPath = new Map<string, string[]>();
authorizedPath.set(`farmer`, [`/farmer`]);
authorizedPath.set(`agriculturist`, [`/agriculturist`, `/farmerUser`]);
authorizedPath.set(`admin`, [`/agriculturist`, `/farmerUser`]);
authorizedPath.set(`leader`, [`/farmer`, `/farmerLeader`, `/farmerUser`]);
// mga user na kakatapos lng mag sign up ang pwedeng pumasok sa path nato
authorizedPath.set(`newUser`, [`/farmerDetails`]);
const publicPath = [`/`, `/unauthorized`, `/agriAuth`];

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    const res = NextResponse.next();

    // logging all the incoming requests for debugging purposes
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Method: ${req.method}`);

    const { pathname } = req.nextUrl;

    const session = await GetSession();

    // if the current path was defines in the publicPath Variable, the middleware will let it pass through
    if (publicPath.some((path) => pathname.startsWith(path))) return res;

    if (session) {
      const accessiblePath = authorizedPath.get(session.work);
      console.warn(`middleware: you have a session`);

      if (
        accessiblePath &&
        accessiblePath.some((path) => pathname.startsWith(path))
      ) {
        // will return if the user is authorized to go in the path
        console.warn(`middleware: you're authorized to go ${pathname}`);

        return res;
      } else {
        // will return if the user in not unauthorized to go in the path
        console.warn(`middleware: you're unauthorized to go ${pathname}`);

        return NextResponse.redirect(new URL(`/unauthorized`, req.url));
      }
    } else {
      return NextResponse.redirect(
        new URL(
          `/?error=${NotifToUriComponent([
            { message: "Log in expired, log in again!", type: "warning" },
          ])}`,
          req.url
        )
      );
    }
  } catch (error) {
    console.log((error as Error).message);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
