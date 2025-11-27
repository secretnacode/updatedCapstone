"use server";

import {
  checkCreateAgriToken,
  createResetPassWordLinkQuery,
  createSignUpLinkForAgriQuery,
  updateAgriLinkIsUse,
  deleteResetPassLink,
  getCreateAgriLink,
  getRestPasswordLinkQuery,
  linkIsExistInCreateAgriDb,
  linkIsExistInResetPassDb,
  deleteCreateAgriLink,
  checkResetPassToken,
  checkCreateAgriTokenIfUse,
  updatResetPassIsUse,
  checkResetPassTokenIfUse,
  getFarmerIdOfResetPass,
  getResetPassExpirationDate,
  getResetPassLinkId,
} from "@/util/queries/link";
import { ProtectedAction } from "../protectedActions";
import {
  CreateUUID,
  missingFormValNotif,
  RedirectLoginWithNotif,
} from "@/util/helper_function/reusableFunction";
import { headers } from "next/headers";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import {
  changeNewPassParamType,
  changeNewPassReturnType,
  getAllLinkDataReturnType,
  serverActionNormalReturnType,
  serverActionOptionalNotifMessage,
} from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ZodValidateForm } from "../validation/authValidation";
import { resetPasswordSchema } from "@/util/helper_function/validation/validationSchema";
import { Hash } from "../reusableFunctions";
import { updatePassword } from "@/util/queries/user";

const rndmToken = async () => crypto.randomBytes(32).toString("hex");
const hostName = async () => (await headers()).get("host");
const hostNameProtocol = async () =>
  (await headers()).get("x-forwarded-proto") || "http";

/**
 * action for creating a link to renew the farmer password
 * @param farmerId if of the farmer that will reset thier password
 * @returns
 */
export const createResetPassWordLink = async (
  farmerId: string
): Promise<serverActionNormalReturnType> => {
  try {
    await ProtectedAction("create:reset:password:link");

    const token = await rndmToken();
    const host = await hostName();
    const protocol = await hostNameProtocol();

    const link = `${protocol}://${host}/resetPassword/${token}`;

    await createResetPassWordLinkQuery({
      linkId: CreateUUID(),
      dateCreated: new Date(),
      dateExpired: new Date(Date.now() + 3600000), // an hour from now on
      link: link,
      linkToken: token,
      farmerId,
      isUsed: false,
    });

    revalidatePath(`/agriculturist/createLink`);

    return {
      success: true,
      notifMessage: [
        {
          message: "Successfully made a link for the user!!!",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Unexpected error occured while making a link : ${err}`);
    return {
      success: false,
      notifMessage: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }
};

/**
 * action for creating a link for the new user, and this user will automatically be an agriculturist
 * @returns
 */
export const createSignUpLinkForAgri =
  async (): Promise<serverActionNormalReturnType> => {
    try {
      const { work } = await ProtectedAction("create:agriculturist:link");

      if (work !== "admin")
        return {
          success: false,
          notifMessage: [
            { message: "Only admin can execute this action", type: "warning" },
          ],
        };

      const token = await rndmToken();
      const host = await hostName();
      const protocol = await hostNameProtocol();

      // secured link with a token
      const link = `${protocol}://${host}/agriAuth/${token}/signUp`;

      await createSignUpLinkForAgriQuery({
        linkId: CreateUUID(),
        dateCreated: new Date(),
        dateExpired: new Date(Date.now() + 3600000), // an hour from now on
        link: link,
        linkToken: token,
        isUsed: false,
      });

      revalidatePath(`/agriculturist/createLink`);

      return {
        success: true,
        notifMessage: [
          {
            message: "Successfully made a link for the agriculturist!!!",
            type: "success",
          },
        ],
      };
    } catch (error) {
      const err = error as Error;
      console.log(`Unexpected error occured while making a link : ${err}`);
      return {
        success: false,
        notifMessage: [
          {
            message: err.message,
            type: "error",
          },
        ],
      };
    }
  };

export const getAllLinkData = async (): Promise<getAllLinkDataReturnType> => {
  try {
    const { work } = await ProtectedAction("read:link");

    const resetPassLink = await getRestPasswordLinkQuery();

    if (work === "agriculturist")
      return {
        success: true,
        work,
        links: resetPassLink,
      };

    return {
      success: true,
      work: "admin",
      links: [
        ...resetPassLink,
        ...(await getCreateAgriLink()).map((val) => ({
          ...val,
          farmerName: null,
          username: null,
        })),
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Unexpected error occured while making a link : ${err}`);
    return {
      success: false,
      notifError: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }
};

/**
 * server action for deleting the link
 * @param linkId id of the link that will be deleted
 * @returns
 */
export const deleteLink = async (
  linkId: string
): Promise<serverActionNormalReturnType> => {
  try {
    const { work } = await ProtectedAction("delete:link");

    if (await linkIsExistInResetPassDb(linkId)) {
      await deleteResetPassLink(linkId);

      return {
        success: true,
        notifMessage: [
          {
            message:
              "Successfully deleted the link that reset the password of the farmer!!!",
            type: "success",
          },
        ],
      };
    }

    const isCreateAgri = await linkIsExistInCreateAgriDb(linkId);

    // if the linkId was not found in both table, it means its not existing
    if (!isCreateAgri)
      return {
        success: false,
        notifMessage: [
          { message: "No link was found in the data base!!!", type: "error" },
        ],
      };

    // if still exist and not an admin, it will not still delete the link
    if (isCreateAgri && work !== "admin")
      return {
        success: false,
        notifMessage: [
          {
            message: "Only admin users can execute this action",
            type: "warning",
          },
        ],
      };

    await deleteCreateAgriLink(linkId);

    return {
      success: true,
      notifMessage: [
        {
          message: "Successfully deleted the link sign up for agriculturist!!!",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Unexpected error occured while making a link : ${err}`);
    return {
      success: false,
      notifMessage: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  } finally {
    revalidatePath("/agriculturist/createLink");
  }
};

export const checkSignUp = async (
  token: string
): Promise<serverActionOptionalNotifMessage> => {
  try {
    if (!(await checkCreateAgriToken(token)))
      return {
        success: false,
        notifError: [
          {
            message: "You are unauthorized to access the page",
            type: "warning",
          },
        ],
      };

    if (await checkCreateAgriTokenIfUse(token))
      return {
        success: false,
        notifError: [
          {
            message: "The link is already used",
            type: "warning",
          },
        ],
      };

    await updateAgriLinkIsUse(token);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;
    console.log(`Error making a new user: ${err}`);
    return {
      success: false,
      notifError: [
        {
          message: `Unexpected error occured while making validating the link for sign up`,
          type: "error",
        },
      ],
    };
  }
};

export const checkResetPass = async (
  token: string
): Promise<serverActionOptionalNotifMessage> => {
  try {
    if (!(await checkResetPassToken(token)))
      return {
        success: false,
        notifError: [
          {
            message: "Hindi ka pupwedeng mag palit ng password",
            type: "warning",
          },
        ],
      };

    if (await checkResetPassTokenIfUse(token))
      return {
        success: false,
        notifError: [
          {
            message: "Nagamit na ang link na ito",
            type: "warning",
          },
          {
            message: "Humingi ng panibagong link sa agriculturist",
            type: "warning",
          },
        ],
      };

    await updatResetPassIsUse(token);

    return { success: true };
  } catch (error) {
    const err = error as Error;

    console.log(`Error occured while logging out: ${err.message}`);

    return {
      success: false,
      notifError: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }
};

export const changeNewPass = async ({
  token,
  newPass,
  confirmNewPass,
}: changeNewPassParamType): Promise<changeNewPassReturnType> => {
  try {
    if (!(await checkResetPassToken(token)))
      return {
        success: false,
        notifError: [
          {
            message: "Hindi ka pupwedeng mag palit ng password",
            type: "warning",
          },
        ],
      };

    const exp = await getResetPassExpirationDate(token);

    if (Date.now() > exp.dateExpired.getTime())
      return {
        success: false,
        notifError: [
          {
            message: "Nag expired na ang iyong pag babago ng password",
            type: "warning",
          },
          {
            message: "Humingi ng panibagong link sa agriculturist",
            type: "warning",
          },
        ],
      };

    const { valid, formError } = ZodValidateForm(
      { newPass, confirmNewPass },
      resetPasswordSchema
    );
    if (!valid)
      return {
        success: false,
        formError: formError,
        notifError: missingFormValNotif(),
      };

    await updatePassword(
      await getFarmerIdOfResetPass(token),
      await Hash(newPass)
    );

    await deleteResetPassLink((await getResetPassLinkId(token)).linkId);

    return RedirectLoginWithNotif([
      { message: "Matagumpay ang pag papalit mo ng password", type: "success" },
    ]);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;

    console.log(`Error occured while logging out: ${err.message}`);

    return {
      success: false,
      notifError: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }
};
