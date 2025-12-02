"use server";

import {
  getAllUserNotifReturnType,
  serverActionNormalReturnType,
  serverActionOptionalNotifMessage,
} from "@/types";
import { ProtectedAction } from "../protectedActions";
import {
  deleteNotifQuery,
  getAllUserNotifQuery,
  updateIsReadNotifQuery,
} from "@/util/queries/notification";
import { timePass } from "@/util/helper_function/reusableFunction";

export const getAllUserNotif = async (): Promise<getAllUserNotifReturnType> => {
  try {
    const { userId } = await ProtectedAction("read:user");

    return {
      success: true,
      notifs: (await getAllUserNotifQuery(userId)).map((val) => ({
        ...val,
        pastTime: timePass(val.pastTime),
      })),
    };
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

export const updateIsReadNotif = async (
  notifId: string
): Promise<serverActionOptionalNotifMessage> => {
  try {
    await updateIsReadNotifQuery(notifId);

    return { success: true };
  } catch (error) {
    const err = (error as Error).message;
    console.log(err);
    return { success: false, notifError: [{ message: err, type: "error" }] };
  }
};

export const deleteNotif = async (
  notifId: string
): Promise<serverActionNormalReturnType> => {
  try {
    const { work } = await ProtectedAction("update:user");

    await deleteNotifQuery(notifId);

    return {
      success: true,
      notifMessage: [
        {
          message:
            work === "admin" || work === "agriculturist"
              ? "The notification was deleted successfuly"
              : "Matagumpay na tinanggal ang notipikasyon",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = (error as Error).message;
    console.log(err);
    return { success: false, notifMessage: [{ message: err, type: "error" }] };
  }
};
