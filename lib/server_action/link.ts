"use server";

import {
  createResetPassWordLinkQuery,
  createSignUpLinkForAgriQuery,
  deleteCreateAgriLink,
  deleteResetPassLink,
  getCreateAgriLink,
  getRestPasswordLinkQuery,
  linkIsExistInCreateAgriDb,
  linkIsExistInResetPassDb,
} from "@/util/queries/link";
import { ProtectedAction } from "../protectedActions";
import { CreateUUID } from "@/util/helper_function/reusableFunction";
import { headers } from "next/headers";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import {
  getAllLinkDataReturnType,
  serverActionNormalReturnType,
} from "@/types";

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

      const link = `${protocol}://${host}/createAgri/${token}`;

      await createSignUpLinkForAgriQuery({
        linkId: CreateUUID(),
        dateCreated: new Date(),
        dateExpired: new Date(Date.now() + 3600000), // an hour from now on
        link: link,
        linkToken: token,
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

    if (work === "admin")
      return {
        success: true,
        work,
        createAgriLink: await getCreateAgriLink(),
        resetPassLink,
      };

    return {
      success: true,
      work: "agriculturist",
      resetPassLink,
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

    const isCreateAgrfi = await linkIsExistInCreateAgriDb(linkId);

    // can only be accessed by the user that is an admin
    if (isCreateAgrfi && work === "admin") {
      await deleteCreateAgriLink(linkId);

      return {
        success: true,
        notifMessage: [
          {
            message:
              "Successfully deleted the link sign up for agriculturist!!!",
            type: "success",
          },
        ],
      };
    } else if (isCreateAgrfi && work !== "admin")
      // if still exist and not an admin, it will not still delete the link
      return {
        success: false,
        notifMessage: [
          {
            message: "Only admin users can execute this action",
            type: "warning",
          },
        ],
      };

    // if the linkId was not found in both table, it means its not existing
    return {
      success: false,
      notifMessage: [
        { message: "No link was found in the data base!!!", type: "error" },
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
