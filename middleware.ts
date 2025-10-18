"use server";

import { NextRequest, NextResponse } from "next/server";
import { GetSession } from "./lib/session";
import { NotifToUriComponent } from "./util/helper_function/reusableFunction";
import { isFarmerVerified } from "./util/queries/user";

const authorizedPath = new Map<string, string[]>();
authorizedPath.set(`farmer`, [`/farmer`]);
authorizedPath.set(`agriculturist`, [`/agriculturist`, `/farmerUser`]);
authorizedPath.set(`admin`, [`/agriculturist`, `/farmerUser`]);
authorizedPath.set(`leader`, [`/farmer`, `/farmerLeader`, `/farmerUser`]);
// mga user na kakatapos lng mag sign up ang pwedeng pumasok sa path nato
authorizedPath.set(`newUser`, [`/farmerDetails`]);
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
      if (
        !(await isFarmerVerified(session.userId)) &&
        (session.work === "farmer" || session.work === "leader")
      )
        //will return if the farmer is not varified
        return NextResponse.redirect(
          new URL(
            `/?error=${NotifToUriComponent([
              {
                message: "Ikaw ay hindi pa!",
                type: "warning",
              },
            ])}`,
            req.url
          )
        );

      const accessiblePath = authorizedPath.get(session.work);
      console.warn(`middleware: you have a session`);

      if (
        accessiblePath &&
        accessiblePath.some((path) => `/${pathname.split("/")[1]}` === path)
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
      // will return if the user is not logged in
      console.warn(`middleware: you're not logged in`);

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
    console.log(`middleware error`);
    console.log((error as Error).message);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
