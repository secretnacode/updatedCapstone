"use server";

import { newNotifParamType } from "@/types";
import { pool } from "../configuration";
import { CreateUUID } from "../helper_function/reusableFunction";

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
      `insert into capstone.notification ("notificationId", "recipientId", "recipientType", "notifType", "title", "message", "createdAt", "isRead", "actionId", "actionType") values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
