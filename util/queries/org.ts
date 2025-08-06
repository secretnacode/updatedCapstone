import { QueryAvailableOrgReturnType } from "@/types";
import { pool } from "../configuration";
import { CreateUUID } from "../helper_function/reusableFunction";

/**
 * get all the available organizations with their orgId and orgName
 * @returns an array of objects containing orgId and orgNam [{orgId: string, orgName: string}]
 */
export const GetAvailableOrgQuery =
  async (): Promise<QueryAvailableOrgReturnType> => {
    try {
      return (await pool.query(`select "orgId", "orgName" from capstone.org`))
        .rows;
    } catch (error) {
      const err = error as Error;
      console.error("Error in Getting the available org:", error);
      throw new Error(
        `Error in Getting the available org: ${err.message as string}`
      );
    }
  };

/**
 * query to create a new org by just passing orgname and userId
 * @param orgName is the name of the organization that the user want to create
 * @param userId is the id of the current user
 * @returns result of the query
 */
export const CreateNewOrgAfterSignUp = async (
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
    const err = error as Error;
    console.error("Error in Creating new org after sign up:", error);
    throw new Error(
      `Error in Creating new org after sign up: ${err.message as string}`
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
    const err = error as Error;
    console.error("Error on getting the user orgId: ", error);
    throw new Error(
      `Error on getting the user orgId: ${err.message as string}`
    );
  }
};
