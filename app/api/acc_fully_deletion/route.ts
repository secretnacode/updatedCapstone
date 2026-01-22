import { CRON_API } from "@/util/configuration";
import { deletUserPermanently } from "@/util/queries/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (CRON_API !== req.headers.get("authorization_key"))
      return NextResponse.json({
        message: "The headers authorization key is wrong or not provided",
      });

    await deletUserPermanently();

    return NextResponse.json(
      { message: "Successful clean up deletion" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
