import { insertNewAgriculturist } from "@/util/queries/user";
import { WebhookEvent } from "@clerk/nextjs/dist/types/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: NextRequest) {
  try {
    const whSecret = process.env.CLERK_WEBHOOK_KEY;

    if (!whSecret) throw new Error("No clerk webhook key detected");

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // header of the webhook(clerk uses svix to forward the data using webhook)
    if (!svix_id || !svix_timestamp || !svix_signature)
      throw new Error("Error occurred -- no svix headers");

    const data = JSON.stringify(await req.json());

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(whSecret);

    let evt: WebhookEvent;

    // Verify the webhook signature
    try {
      evt = wh.verify(data, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return NextResponse.json(
        { message: `Error occurred: ${(err as Error).message}` },
        {
          status: 400,
        }
      );
    }

    if (evt.type !== "user.created")
      throw new Error(
        `The request should be user.created instance but was given a ${evt.type}`
      );

    console.log(evt);
    console.log(evt.data.email_addresses);

    await insertNewAgriculturist({
      agriId: evt.data.id,
      userName: evt.data.email_addresses[0].email_address,
      name: evt.data.first_name ?? "agriculturist",
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log((error as Error).message);

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
