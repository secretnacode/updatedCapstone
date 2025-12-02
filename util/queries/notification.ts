"use server";

import { getAllUserNotifQueryReturnType, newNotifParamType } from "@/types";
import { pool } from "../configuration";
import {
  CreateUUID,
  UnexpectedErrorMessageEnglish,
} from "../helper_function/reusableFunction";

export const addNewUserNotif = async ({
  recipientId,
  recipientType,
  notifType,
  title,
  message,
  actionId,
  actionType,
}: newNotifParamType) => {
  try {
    await pool.query(
      `insert into capstone.notification ("notifId", "recipientId", "recipientType", "notifType", "title", "message", "createdAt", "isRead", "actionId", "actionType") values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        CreateUUID(),
        recipientId,
        recipientType,
        notifType,
        title,
        message,
        new Date(),
        false,
        actionId,
        actionType,
      ]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga available na organisasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga available na organisasyon`
    );
  }
};

/**
 * query for getting all the notification of the user
 * @param userId id of the user that will get the notification
 * @returns notif value
 */
export const getAllUserNotifQuery = async (
  userId: string
): Promise<getAllUserNotifQueryReturnType[]> => {
  try {
    return (
      await pool.query(
        `select "notifId", "notifType", "title", "message", current_timestamp - "createdAt" as "pastTime", "isRead", "actionId", "actionType" from capstone.notification where "recipientId" = $1 order by case when "isRead" = $2 then $3 else $4 end asc`,
        [userId, false, 1, 2]
      )
    ).rows;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error(UnexpectedErrorMessageEnglish());
  }
};

/**
 * query for updating the notification into read state
 * @param notifId id to be updated
 */
export const updateIsReadNotifQuery = async (notifId: string) => {
  try {
    await pool.query(
      `update capstone.notification set "isRead" = $1 where "notifId" = $2`,
      [true, notifId]
    );
  } catch (error) {
    console.error((error as Error).message);
    throw new Error(UnexpectedErrorMessageEnglish());
  }
};

/**
 * query for deleting the notif
 * @param notifId id of the notif to be deleted
 */
export const deleteNotifQuery = async (notifId: string) => {
  try {
    await pool.query(`delete from capstone.notification where "notifId" = $1`, [
      notifId,
    ]);
  } catch (error) {
    console.error((error as Error).message);
    throw new Error(UnexpectedErrorMessageEnglish());
  }
};
