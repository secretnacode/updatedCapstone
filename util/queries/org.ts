import {
  GetAllOrganizationQueryReturnType,
  NewOrgType,
  QueryAvailableOrgReturnType,
} from "@/types";
import { pool } from "../configuration";
import { CreateUUID } from "../helper_function/reusableFunction";

/**
 * get all the available organizations with their orgId and orgName
 * @returns an array of objects containing orgId and orgNam [{orgId: string, orgName: string}]
 */
export const GetAvailableOrgQuery = async (): Promise<
  QueryAvailableOrgReturnType[]
> => {
  try {
    return (await pool.query(`select "orgId", "orgName" from capstone.org`))
      .rows;
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
 * query to create a new org by just passing orgname and userId
 * @param orgName is the name of the organization that the user want to create
 * @param userId is the id of the current user
 * @returns result of the query
 */
export const CreateNewOrg = async (
  orgName: string,
  userId: string
): Promise<{ orgId: string }> => {
  try {
    return (
      await pool.query(
        `insert into capstone.org ("orgId", "orgName", "orgLeadFarmerId") values ($1, $2, $3) returning "orgId"`,
        [CreateUUID(), orgName, userId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag gawa ng panibagong organisasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag gawa ng panibagong organisasyon`
    );
  }
};

/**
 * geting the user orgId
 * @param userId id of the user that you want to get the orgId
 * @returns orgId of the user
 */
export const GetUserOrgId = async (
  userId: string
): Promise<{ orgId: string }> => {
  try {
    return (
      await pool.query(
        `select "orgId" from capstone.farmer where "farmerId" = $1`,
        [userId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng organisasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng organisasyon`
    );
  }
};

/**
 * server action for updating the user organization in path /[userRole]/profile
 * @param newOrg neccesities to update the user org (orgId, orgRole, farmerId)
 */
export const UpdateUserOrg = async (newOrg: NewOrgType): Promise<void> => {
  try {
    await pool.query(
      `update capstone.farmer set "orgId" = $1, "orgRole" = $2 where "farmerId" = $3`,
      [newOrg.orgId, newOrg.orgRole, newOrg.farmerId]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag uupdate ng organisasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag uupdate ng organisasyon`
    );
  }
};

export const GetAllOrganizationQuery = async (): Promise<
  GetAllOrganizationQueryReturnType[]
> => {
  try {
    return (
      await pool.query(
        `select o."orgId", o."orgName", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName" from capstone.org o join capstone.farmer f on o."orgLeadFarmerId" = f."farmerId"`
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga organisasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga organisasyon`
    );
  }
};
