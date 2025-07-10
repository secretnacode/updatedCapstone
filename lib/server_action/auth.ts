"use server";

import {
  AuthResponseType,
  NotificationBaseType,
  QueryUserLoginReturnType,
  ValidateAuthValType,
  AuthLoginType,
  AuthSignUpType,
  NewUserType,
} from "@/types";
import { CreateUUID } from "@/util/helper_function/reusableFunction";
import { CreateSession } from "@/lib/session";
import {
  ValidateLoginVal,
  ValidateSingupVal,
} from "@/util/helper_function/validation/frontendValidation/authvalidation";
import { CheckUsername, InsertNewUser, UserLogin } from "@/util/queries/user";
import { ComparePassword, Hash } from "@/lib/reusableFunctions";

/**
 * used for login authentication of the user and validating the user input before redirecting the user into another page if the user
 * credentials are correct
 * @param data object of username and password of the user inputs
 * @returns an object of success, if the success is a truthy value, it comes with the object url that contains the url the user will be redirected at based on the users role, and if the success value is falsey, it will return a error object that will be used by notification context
 */
export async function LoginAuth(
  data: AuthLoginType
): Promise<AuthResponseType> {
  try {
    // will check the user first then will see if the user input is both string
    const validateData: ValidateAuthValType<NotificationBaseType[]> =
      ValidateLoginVal(data);
    if (!validateData.valid)
      return {
        success: false,
        errors: validateData.errors,
      };

    // will check if the user is existing
    const userCredentials: QueryUserLoginReturnType = await UserLogin(
      data.username
    );
    if (!userCredentials.exist)
      return {
        success: false,
        errors: [{ message: userCredentials.message, type: "warning" }],
      };

    // if its allready existing, will compare the user passwod input and the hash password that is in the database and will compare it
    if (!(await ComparePassword(data.password, userCredentials.data.password)))
      return {
        success: false,
        errors: [
          {
            message: `Mali ang nailagay mong password o username`,
            type: "warning",
          },
        ],
      };

    await CreateSession(userCredentials.data.authId, userCredentials.data.role);

    return { success: true, url: `/${userCredentials.data.role}` };
  } catch (error) {
    const err = error as Error;
    console.log(`Error in logging in: ${err}`);
    return {
      success: false,
      errors: [{ message: `Error in logging in: ${err}`, type: "error" }],
    };
  }
}

/**
 * used for signing up new user and validating the user input before redirecting the user into another page
 * @param data object of username, password, and confirmPassword of the user inputs
 * @returns an object of success, if the success is a truthy value, it comes with the object url that contains the url the user will be redirected at to fill up the user's info, and if the success value is falsey, it will return a error object that will be used by notification context
 */
export async function SignUpAuth(
  data: AuthSignUpType
): Promise<AuthResponseType> {
  try {
    // validating the all the value ({username, password, confirmPassword})
    const err: ValidateAuthValType<NotificationBaseType[]> =
      ValidateSingupVal(data);
    if (!err.valid) {
      console.log(err.errors);
      return {
        success: false,
        errors: err.errors,
      };
    }

    // checking if other user already have the same username
    if (await CheckUsername(data.username))
      return {
        success: false,
        errors: [
          {
            message:
              "Ang username ay ginagamit na ng ibang tao, gumamit ng ibang username",
            type: "warning",
          },
        ],
      };

    const newUserId = CreateUUID();
    const newUserRole = `farmer`;

    await InsertNewUser({
      userId: newUserId,
      username: data.username,
      password: await Hash(data.password),
      role: newUserRole,
    } as NewUserType);

    await CreateSession(newUserId, newUserRole);

    return { success: true, url: `/farmerDetails` };
  } catch (error) {
    const err = error as Error;
    console.log(`Error making a new user: ${err}`);
    return {
      success: false,
      errors: [{ message: `Error making a new user: ${err}`, type: "error" }],
    };
  }
}
