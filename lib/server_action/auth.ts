"use server";

import {
  QueryUserLoginReturnType,
  AuthLoginType,
  AuthSignUpType,
  serverActionNormalReturnType,
  AuthResponseType,
} from "@/types";
import {
  CreateUUID,
  missingFormValNotif,
  NotifToUriComponent,
  UnexpectedErrorMessage,
} from "@/util/helper_function/reusableFunction";
import { CreateSession } from "@/lib/session";
import {
  agriAuthQuery,
  CheckUsername,
  getFarmerIdByAuthId,
  InsertNewUser,
  isFarmerVerified,
  UserLogin,
} from "@/util/queries/user";
import { ComparePassword, Hash } from "@/lib/reusableFunctions";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ZodValidateForm } from "../validation/authValidation";
import {
  authLogInSchema,
  authSignUpSchema,
} from "@/util/helper_function/validation/validationSchema";

/**
 * used for login authentication of the user and validating the user input before redirecting the user into another page if the user
 * credentials are correct
 * @param data object of username and password of the user inputs
 * @returns an object of success, if the success is a truthy value, it comes with the object url that contains the url the user will be redirected at based on the users role, and if the success value is falsey, it will return a error object that will be used by notification context
 */
export async function LoginAuth(
  data: AuthLoginType
): Promise<AuthResponseType<AuthLoginType>> {
  // let work = ""
  try {
    // will check the user first then will see if the user input is both string
    const validate = ZodValidateForm(data, authLogInSchema);
    if (!validate.valid)
      return {
        formError: validate.formError,
        notifError: missingFormValNotif(),
      };

    // will check if the user is existing
    const userCredentials: QueryUserLoginReturnType = await UserLogin(
      data.username
    );

    if (!userCredentials.exist)
      return {
        notifError: [{ message: userCredentials.message, type: "warning" }],
      };

    const compare = await ComparePassword(
      data.password,
      userCredentials.data.password
    );

    // if its allready existing, will compare the user passwod input and the hash password that is in the database and will compare it
    if (!compare)
      return {
        notifError: [
          {
            message: `Mali ang nailagay mong password o username`,
            type: "warning",
          },
        ],
      };

    if (userCredentials.data.status === "block")
      return {
        notifError: [
          {
            message: `Naka block ang iyong account`,
            type: "warning",
          },
          {
            message: `Kausapin ang iyong leader o ang agriculturist para maalis`,
            type: "warning",
          },
        ],
      };

    const farmerId = await getFarmerIdByAuthId(userCredentials.data.authId);

    // this means the user already sign up but didnt insert its personal information(no farmerId was crerated) so the user will be redirected in the farmerDetails instead to finish that
    if (!farmerId) {
      await CreateSession(userCredentials.data.authId, "newUser");

      redirect("/farmerDetails");
    }

    if (!(await isFarmerVerified(farmerId.farmerId)))
      return {
        notifError: [
          {
            message: "Hindi pa beripikado and iyong account!!!",
            type: "warning",
          },
        ],
      };

    await CreateSession(
      farmerId.farmerId,
      farmerId.orgRole === "leader" ? farmerId.orgRole : "farmer"
    );

    redirect(
      `/farmer/?notif=${NotifToUriComponent([
        { message: "Matagumpay ang iyong pag lologin", type: "success" },
      ])}`
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.log(
      `May pagkakamali na hindi inaasahan sa pag lologin ${
        (error as Error).message
      }`
    );
    return {
      notifError: [
        {
          message: `May pagkakamali na hindi inaasahan sa pag lologin`,
          type: "error",
        },
      ],
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
): Promise<AuthResponseType<AuthSignUpType>> {
  try {
    // validating the all the value ({username, password, confirmPassword})
    const validate = ZodValidateForm(data, authSignUpSchema);
    if (!validate.valid) {
      return {
        formError: validate.formError,
        notifError: missingFormValNotif(),
      };
    }

    // checking if other user already have the same username
    if (await CheckUsername(data.username))
      return {
        notifError: [
          {
            message:
              "Ang username ay ginagamit na ng ibang tao, gumamit ng ibang username",
            type: "warning",
          },
        ],
      };

    const authId = CreateUUID();

    await InsertNewUser({
      userId: authId,
      username: data.username,
      password: await Hash(data.password),
    });

    await CreateSession(authId, "newUser");

    redirect("/farmerDetails");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;
    console.log(`Error making a new user: ${err}`);
    return {
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }
}

/**
 * server action for log in of the agriculturist user
 * @param id id of the current use(clerk)
 * @param email email of the current user(clerk)
 * @returns
 */
export const agriSignIn = async (
  id: string,
  email: string
): Promise<serverActionNormalReturnType> => {
  try {
    const agriVal = await agriAuthQuery({ id, email });

    if (!agriVal.exist)
      return {
        success: false,
        notifMessage: [{ message: agriVal.message, type: "warning" }],
      };

    const res = await CreateSession(
      agriVal.agriVal.agriId,
      agriVal.agriVal.agriRole
    );

    console.log(`session val: ${res}`);

    redirect(
      `/agriculturist?notif=${NotifToUriComponent([
        { message: "You've successfully logged in!!!", type: "success" },
      ])}`
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;
    console.log(`Error making a new user: ${err}`);
    return {
      success: false,
      notifMessage: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }
};
