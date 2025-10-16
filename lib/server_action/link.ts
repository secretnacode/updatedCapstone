"use server";

import {
  createResetPassWordLinkQuery,
  createSignUpLinkForAgriQuery,
} from "@/util/queries/link";
import { ProtectedAction } from "../protectedActions";
import { CreateUUID } from "@/util/helper_function/reusableFunction";
import { headers } from "next/headers";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { serverActionNormalReturnType } from "@/types";

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
      await ProtectedAction("create:agriculturist:link");

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
