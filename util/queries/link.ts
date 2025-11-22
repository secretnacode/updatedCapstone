"use server";

import {
  createResetPassWordLinkQueryParamType,
  createSignUpLinkForAgriQueryParamType,
  getLinkQueryReturnTyepe,
  getLinkResetPassQueryReturnType,
  linkTableType,
} from "@/types";
import { pool } from "../configuration";

const resetPassDbName = (): "resetFarmerPassLink" => "resetFarmerPassLink";
const createAgriDbName = (): "signUpLinkForAgri" => "signUpLinkForAgri";

/**
 * query for inserting a new link so the farmer can reset their password if the user go to the said link
 */
export const createResetPassWordLinkQuery = async (
  data: createResetPassWordLinkQueryParamType
) => {
  try {
    await pool.query(
      `insert into capstone."${resetPassDbName()}" ("linkId", "dateCreated", "dateExpired", "link", "farmerId", "linkToken") values ($1, $2, $3, $4, $5, $6)`,
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
      `insert into capstone."${createAgriDbName()}" ("linkId", "linkToken", "link", "dateCreated", "dateExpired", "isUsed") values ($1, $2, $3, $4, $5, $6)`,
      [
        data.linkId,
        data.linkToken,
        data.link,
        data.dateCreated,
        data.dateExpired,
        data.isUsed,
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

/**
 * query for getting the necessary data for viewing the links in reseting the password of the farmer
 */
export const getRestPasswordLinkQuery = async (): Promise<
  getLinkResetPassQueryReturnType[]
> => {
  try {
    return (
      await pool.query(
        `select l."linkId", l."link", l."dateCreated", l."dateExpired", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", a."username" from capstone."${resetPassDbName()}" l join capstone.farmer f on l."farmerId" = f."farmerId" join capstone.auth a on f."farmerId" = a."authId"`
      )
    ).rows;
  } catch (error) {
    console.error(
      `Unexpected error occur while making a getting all the link for reset password: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error occur while making a getting all the link for reset password`
    );
  }
};

/**
 * query for getting the necessary data for viewing the links in creating a user agriculturist
 */
export const getCreateAgriLink = async (): Promise<
  getLinkQueryReturnTyepe[]
> => {
  try {
    return (
      await pool.query(
        `select "linkId", "link", "dateCreated", "dateExpired" from capstone."${createAgriDbName()}"`
      )
    ).rows;
  } catch (error) {
    console.error(
      `Unexpected error occur while making a getting all the link agriculturist creation: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error occur while making a getting all the link agriculturist creation`
    );
  }
};

/**
 * WAS SEPERATED BECAUSE IT CAN BE DYNAMIC DEPENDING ON THE TABLE NAME THAT WILL BE PASSED
 *
 * query for checking if the linkId exsist in the passed table name
 * @param tableName name of the table to be checked
 * @param linkId id of the link that will be checked
 * @returns boolean
 */
const isLinkExist = async (
  tableName: linkTableType,
  linkId: string
): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone."${tableName}" where "linkId" = $1)`,
        [linkId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.error(
      `Unexpected error occur while checking the link if it exist: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error occur while checking the link if it exist`
    );
  }
};

/**
 * query for checking if the linkId exist in the resetFarmerPassLink table
 * @param linkId id of the link
 * @returns boolean
 */
export const linkIsExistInResetPassDb = async (
  linkId: string
): Promise<boolean> => {
  try {
    return await isLinkExist(resetPassDbName(), linkId);
  } catch (error) {
    console.error(
      `Unexpected error occur while checking the link if it exist: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error occur while checking the link if it exist`
    );
  }
};

/**
 * query for checking if the linkId exist in the resetFarmerPassLink table
 * @param linkId id of the link
 * @returns boolean
 */
export const linkIsExistInCreateAgriDb = async (
  linkId: string
): Promise<boolean> => {
  try {
    return await isLinkExist(createAgriDbName(), linkId);
  } catch (error) {
    console.error(
      `Unexpected error occur while checking the link if it exist: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error occur while checking the link if it exist`
    );
  }
};

/**
 * WAS SEPERATED BECAUSE IT CAN BE DYNAMIC DEPENDING ON THE TABLE NAME THAT WILL BE PASSED
 *
 * query for deleting the link base on the passed table name and linkId
 * @param tableName name of the table to be deleted
 * @param linkId id of the link that will be deleted
 */
const deleteLink = async (tableName: linkTableType, linkId: string) => {
  try {
    await pool.query(
      `delete from capstone."${tableName}" where "linkId" = $1`,
      [linkId]
    );
  } catch (error) {
    console.error(
      `Unexpected error occur while deleting the link: ${
        (error as Error).message
      }`
    );
    throw new Error(`Unexpected error occur while deleting the link`);
  }
};

/**
 * query for deleting the resetPassword link in the database base on the linkId that will be passed
 * @param linkId id of the link that will be deleted
 */
export const deleteResetPassLink = async (linkId: string) => {
  try {
    await deleteLink(resetPassDbName(), linkId);
  } catch (error) {
    console.error(
      `Unexpected error occur while deleting the link: ${
        (error as Error).message
      }`
    );
    throw new Error(`Unexpected error occur while deleting the link`);
  }
};

/**
 * query for deleting the createAgri link in the database base on the linkId that will be passed
 * @param linkId id of the link that will be deleted
 */
export const deleteCreateAgriLink = async (linkId: string) => {
  try {
    await deleteLink(createAgriDbName(), linkId);
  } catch (error) {
    console.error(
      `Unexpected error occur while deleting the link: ${
        (error as Error).message
      }`
    );
    throw new Error(`Unexpected error occur while deleting the link`);
  }
};

/**
 * query for checking the link if it exist or not by finding if the passed token is in the db and if that token wasnt used yet
 * @param token link token to be ckecked
 * @returns boolean
 */
export const checkCreateAgriToken = async (token: string): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone."${createAgriDbName()}" where "linkToken" = $1)`,
        [token]
      )
    ).rows[0].exists;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `Error occured while checking the agriculturist's verification`
    );
  }
};

/**
 * query for getting the state of the link if its used or not
 * @param token value of the tokken
 * @returns boolean
 */
export const checkCreateAgriTokenIfUse = async (
  token: string
): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select "isUsed" from capstone."${createAgriDbName()}" where "linkToken" = $1`,
        [token]
      )
    ).rows[0].isUsed;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `Error occured while checking the agriculturist's verification`
    );
  }
};

/**
 * query for marking the token in the database that it was used
 * @param token value of token to be deleted
 */
export const updateAgriLinkIsUse = async (token: string) => {
  try {
    await pool.query(
      `update capstone."${createAgriDbName()}" set "isUsed" = $1 where "linkToken" = $2`,
      [true, token]
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(`Error occured while consuming the token`);
  }
};

/**
 * query for checking the link if it exist or not by finding if the passed token is in the db and if that token wasnt used yet
 * @param token link token to be ckecked
 * @returns boolean
 */
export const checkResetPassToken = async (token: string): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone."${resetPassDbName()}" where "linkToken" = $1)`,
        [token]
      )
    ).rows[0].exists;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(`May Hindi inaasahang pag kakamali habang chinecheck link`);
  }
};

/**
 * query for getting the state of the link if its used or not
 * @param token value of the tokken
 * @returns boolean
 */
export const checkResetPassTokenIfUse = async (
  token: string
): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select "isUsed" from capstone."${resetPassDbName()}" where "linkToken" = $1`,
        [token]
      )
    ).rows[0].isUsed;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(`May Hindi inaasahang pag kakamali habang chinecheck link`);
  }
};

/**
 * query for marking the token in the database that it was used
 * @param token value of token to be deleted
 */
export const updatResetPassIsUse = async (token: string) => {
  try {
    await pool.query(
      `update capstone."${resetPassDbName()}" set "isUsed" = $1 where "linkToken" = $2`,
      [true, token]
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May Hindi inaasahang pag kakamali habang inuupdate ang link`
    );
  }
};

/**
 * query for getting the farmerId of the resetPass link
 * @param token value of the token
 * @returns farmerId value
 */
export const getFarmerIdOfResetPass = async (
  token: string
): Promise<string> => {
  try {
    return (
      await pool.query(
        `select "farmerId" from capstone."${resetPassDbName()} where "linkToken" = $1`,
        [token]
      )
    ).rows[0].farmerId;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May Hindi inaasahang pag kakamali habang binabago ang password`
    );
  }
};
