"use server";

import { getAllUserNotifReturnType } from "@/types";
import { ProtectedAction } from "../protectedActions";
import { getAllUserNotifQuery } from "@/util/queries/notification";

export const getAllUserNotif = async (): Promise<getAllUserNotifReturnType> => {
  try {
    const { userId } = await ProtectedAction("read:user");

    return { success: true, notifs: await getAllUserNotifQuery(userId) };
  } catch (error) {
    const err = error as Error;
    console.log(
      `Unexpected error occured while getting all the notification: ${err}`
    );
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
