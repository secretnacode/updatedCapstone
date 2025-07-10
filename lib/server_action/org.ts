"use server";

import { AvailableOrgReturnType } from "@/types";
import { GetAvailableOrgQuery } from "@/util/queries/org";

/**
 * gets all the available organizations with their orgId and orgName
 * @returns a {success: boolean} object with data if successful or errors
 * if not errors object that will be consumed by the notification context
 */
export const AvailableOrg = async (): Promise<AvailableOrgReturnType> => {
  try {
    return {
      success: true,
      data: await GetAvailableOrgQuery(),
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Error getting the avaliable organization: ${err}`);
    return {
      success: false,
      errors: [
        {
          message: `Error getting the avaliable organization: ${err}`,
          type: "error",
        },
      ],
    };
  }
};
