"use server";

import {
  createResetPassWordLinkQueryParamType,
  createSignUpLinkForAgriQueryParamType,
} from "@/types";
import { pool } from "../configuration";

/**
 * query for inserting a new link so the farmer can reset their password if the user go to the said link
 */
export const createResetPassWordLinkQuery = async (
  data: createResetPassWordLinkQueryParamType
) => {
  try {
    await pool.query(
      `insert into capstone."resetFarmerPassLink" ("linkId", "dateCreated", "dateExpired", "link", "farmerId", "linkToken") values ($1, $2, $3, $4, $5, $6)`,
      [
        data.linkId,
        data.dateCreated,
        data.dateExpired,
        data.link,
        data.farmerId,
        data.linkToken,
      ]
    );
  } catch (error) {
    console.error(
      `Unexpected error occur while making a link for farmer user: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error occur while making a link for farmer user`
    );
  }
};

/**
 * query for inserting a new link so the new user that will sign up will be automatically a agriculturist
 */
export const createSignUpLinkForAgriQuery = async (
  data: createSignUpLinkForAgriQueryParamType
) => {
  try {
    await pool.query(
      `insert into capstone.signUpLinkForAgri ("linkId", "linkToken", "link", "dateCreated", "dateExpired") values ($1, $2, $3, $4, $5)`,
      [
        data.linkId,
        data.linkToken,
        data.link,
        data.dateCreated,
        data.dateExpired,
      ]
    );
  } catch (error) {
    console.error(
      `Unexpected error occur while making a link for agriculturist: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error occur while making a link for agriculturist`
    );
  }
};
