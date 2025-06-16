import { AuthValType, NewUserTye } from "@/types";
import { CreateUUID } from "@/util/helper_function/reusableFunction";
import { CheckUsername, InsertNewUser } from "@/util/queries/user";
import { Hash } from "@/util/server_functions/reusableFunctions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data: AuthValType = await req.json();

  try {
    // return a 409(conflict) status, this will signifies that the username is already existing and need to pick other username
    if (await CheckUsername(data.username))
      return NextResponse.json(
        {
          message:
            "Ang username ay ginagamit na ng ibang tao, gumamit ng ibang username",
        },
        { status: 409 }
      );

    InsertNewUser({
      userId: CreateUUID(),
      username: data.username,
      password: Hash(data.password),
    } as NewUserTye);

    return NextResponse.json(
      {
        message: "Ikaw ay nakapag gawa na ng bagong account",
      },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    console.log(`Error in POST req in sign up: ${err}`);
    return NextResponse.json(
      { message: `Error in POST req in sign up: ${err}` },
      { status: 500 }
    );
  }
}
