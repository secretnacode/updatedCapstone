import { QueryAvailableOrgReturnType } from "@/types";
import pool from "../db";

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
