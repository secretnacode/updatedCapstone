import {
  AuthValType,
  LoginFailedReturnType,
  NotificationBaseType,
  QueryUserLoginReturnType,
  ValidateAuthValType,
} from "@/types";
import { CreateSession } from "@/util/helper_function/session";
import { ValidateloginVal } from "@/util/helper_function/validation/frontendValidation/authvalidation";
import { UserLogin } from "@/util/queries/user";
import { ComparePassword } from "@/util/server_functions/reusableFunctions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data: AuthValType = await req.json();

    // will check the user first then will see if the passed value is both string
    const validateData: ValidateAuthValType<NotificationBaseType[]> =
      ValidateloginVal(data);
    if (!validateData.valid)
      return NextResponse.json(
        {
          success: false,
          errors: validateData.errors,
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    // will check if the user is existing
    const userCredentials: QueryUserLoginReturnType = await UserLogin(
      data.username
    );
    if (!userCredentials.exist)
      return NextResponse.json(
        { message: userCredentials.message },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    // if its allready existing, will compare the user passwod input and the hash password that is in the database and will compare it
    if (!(await ComparePassword(data.password, userCredentials.data.password)))
      return NextResponse.json(
        { message: `Mali ang nailagay mong password` },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    await CreateSession(userCredentials.data.authId, userCredentials.data.role);

    return NextResponse.json(
      { redirectUrl: `/${userCredentials.data.role}` },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    const err = error as Error;
    console.log(`Error in POST req in sign up: ${err}`);
    return NextResponse.json(
      { message: `Error in POST req in sign up: ${err}` },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
