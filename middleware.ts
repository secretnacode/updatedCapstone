import { NextRequest, NextResponse } from "next/server";
import { GetSession } from "./lib/session";
import { NotifToUriComponent } from "./util/helper_function/reusableFunction";

const authorizedPath = new Map<string, string[]>();
authorizedPath.set(`farmer`, [`/farmer`]);
authorizedPath.set(`agriculturist`, [`/agriculturist`, `/farmerUser`]);
authorizedPath.set(`admin`, [`/agriculturist`, `/farmerUser`]);
authorizedPath.set(`leader`, [`/farmer`, `/farmerLeader`, `/farmerUser`]);
// mga user na kakatapos lng mag sign up ang pwedeng pumasok sa path nato
authorizedPath.set(`newUser`, [`/farmerDetails`]);
const publicPath = [`/unauthorized`, `/agriAuth`];

export default async function Middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    // logging all the incoming requests for debugging purposes
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Method: ${req.method}`);

    console.log("Middleware");

    const { pathname } = req.nextUrl;
    console.log(pathname);

    // if the current path was defines in the publicPath Variable, the middleware will let it pass through
    if (
      publicPath.some((path) => pathname.startsWith(path)) ||
      pathname === "/"
    ) {
      console.log("hawow po");
      return res;
    }

    const session = await GetSession();

    if (!session)
      return NextResponse.redirect(
        new URL(
          `/?notif=${NotifToUriComponent([
            { message: "Log in expired, log in again!", type: "warning" },
          ])}`,
          req.url
        )
      );

    const accessiblePath = authorizedPath.get(session.work);

    // no accessible path was detected for the user(not a farmer, leader, agriculturist, or admin)
    if (!accessiblePath)
      return NextResponse.redirect(new URL(`/unauthorized`, req.url));

    // the user is accessing a path that the user wasnt supposed to access
    if (!accessiblePath.some((path) => pathname.startsWith(path)))
      return NextResponse.redirect(new URL(`/unauthorized`, req.url));

    return res;
  } catch (error) {
    console.error("Middleware error:", error);

    return NextResponse.redirect(
      new URL(
        `/?notif=${NotifToUriComponent([
          { message: "Log in expired, log in again!", type: "warning" },
        ])}`,
        req.url
      )
    );
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
