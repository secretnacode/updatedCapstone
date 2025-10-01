import {
  GetAllOrganizationQueryReturnType,
  GetAllOrgMemberListQueryReturnType,
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
 * @returns orgId that was created
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

/**
 * query for getting all the organization query to get all the organization information
 * @returns list of organization query
 */
export const GetAllOrganizationQuery = async (): Promise<
  GetAllOrganizationQueryReturnType[]
> => {
  try {
    return (
      await pool.query(
        `select o."orgId", o."orgName", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerLeaderName", f."farmerId", count(m."orgId") as "totalMember" from capstone.org o join capstone.farmer f on o."orgLeadFarmerId" = f."farmerId" join capstone.farmer m on o."orgId" = m."orgId" group by o."orgId", o."orgName", f."farmerFirstName", f."farmerLastName", f."farmerId"`
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

/**
 * query for getting all the org member
 * @param orgId orgId the org member you want to get
 * @returns list of the org member
 */
export const GetAllOrgMemberListQuery = async (
  orgId: string
): Promise<GetAllOrgMemberListQueryReturnType[]> => {
  try {
    return (
      await pool.query(
        `select "farmerId", concat("farmerFirstName", ' ', "farmerLastName") as "farmerName", "farmerAlias", "barangay", "verified", "orgRole" from capstone.farmer where "orgId" = $1 order by case when "orgRole" = $2 then $3 else $4 end asc`,
        [orgId, "leader", 1, 2]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga miyembro ng organisasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga miyembro ng organisasyon`
    );
  }
};

/**
 * query that returns a boolean if the passed orgId exist or not
 * @param orgId orgId you want to check if exist
 * @returns boolean value wether it doesnt exist or when the query fails(orgId that was past is not UUID type)
 */
export const organizationIsExist = async (orgId: string): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.org where "orgId" = $1)`,
        [orgId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag checheck ng organisasyon`
    );
  }
};

/**
 * query to check if the organization name is already existing
 * @param orgName org name of the org that you want to check
 * @returns boolean
 */
export const organizationNameIsExist = async (
  orgName: string
): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.org where "orgName" = $1)`,
        [orgName]
      )
    ).rows[0].exist;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag checheck ng organisasyon`
    );
  }
};
