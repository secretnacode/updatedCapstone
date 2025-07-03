"use server";

import {
  AuthResponseType,
  AuthSignUpType,
  NewUserType,
  NotificationBaseType,
  ValidateAuthValType,
} from "@/types";
import { CreateUUID } from "@/util/helper_function/reusableFunction";
import { CreateSession } from "@/util/helper_function/session";
import { ValidateSingupVal } from "@/util/helper_function/validation/frontendValidation/authvalidation";
import { CheckUsername, InsertNewUser } from "@/util/queries/user";
import { Hash } from "@/util/server_functions/reusableFunctions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<AuthResponseType>> {
  const data: AuthSignUpType = await req.json();

  try {
    // validating the all the value ({username, password, confirmPassword})
    const err: ValidateAuthValType<NotificationBaseType[]> =
      ValidateSingupVal(data);

    console.log(data);
    if (!err.valid) {
      console.log(err.errors);
      return NextResponse.json(
        {
          success: false,
          errors: err.errors,
        },
        { status: 409 }
      );
    }

    // checking if other user already have the same username
    if (await CheckUsername(data.username))
      return NextResponse.json(
        {
          success: false,
          errors: [
            {
              message:
                "Ang username ay ginagamit na ng ibang tao, gumamit ng ibang username",
              type: "warning",
            },
          ],
        },
        { status: 409 }
      );

    const newUserId = CreateUUID();
    const newUserRole = `farmer`;

    await InsertNewUser({
      userId: newUserId,
      username: data.username,
      password: Hash(data.password),
      role: newUserRole,
    } as NewUserType);

    await CreateSession(newUserId, newUserRole);

    return NextResponse.json(
      { success: true, url: `/user-details` },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    console.log(`Error in POST req in sign up: ${err}`);
    return NextResponse.json(
      {
        success: false,
        errors: [
          { message: `Error in POST req in sign up: ${err}`, type: "error" },
        ],
      },
      { status: 500 }
    );
  }
}
