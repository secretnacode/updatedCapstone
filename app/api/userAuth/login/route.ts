import {
  AuthValType,
  AuthResponseType,
  NotificationBaseType,
  QueryUserLoginReturnType,
  ValidateAuthValType,
} from "@/types";
import { CreateSession } from "@/util/helper_function/session";
import { ValidateLoginVal } from "@/util/helper_function/validation/frontendValidation/authvalidation";
import { UserLogin } from "@/util/queries/user";
import { ComparePassword } from "@/util/server_functions/reusableFunctions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<AuthResponseType>> {
  try {
    const data: AuthValType = await req.json();

    // will check the user first then will see if the passed value is both string
    const validateData: ValidateAuthValType<NotificationBaseType[]> =
      ValidateLoginVal(data);
    if (!validateData.valid)
      return NextResponse.json(
        {
          success: false,
          errors: validateData.errors,
        },
        {
          status: 400,
        }
      );

    // will check if the user is existing
    const userCredentials: QueryUserLoginReturnType = await UserLogin(
      data.username
    );
    if (!userCredentials.exist)
      return NextResponse.json(
        {
          success: false,
          errors: [{ message: userCredentials.message, type: "warning" }],
        },
        {
          status: 404,
        }
      );

    // if its allready existing, will compare the user passwod input and the hash password that is in the database and will compare it
    if (!(await ComparePassword(data.password, userCredentials.data.password)))
      return NextResponse.json(
        {
          success: false,
          errors: [
            {
              message: `Mali ang nailagay mong password o username`,
              type: "warning",
            },
          ],
        },
        {
          status: 401,
        }
      );

    const session = await CreateSession(
      userCredentials.data.authId,
      userCredentials.data.role
    );

    console.log(`session: ${session}`);

    return NextResponse.json(
      { success: true, url: `/${userCredentials.data.role}` },
      {
        status: 200,
      }
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
      {
        status: 500,
      }
    );
  }
}
