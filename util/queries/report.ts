import {
  AddNewFarmerReportQueryType,
  GetAllFarmerReportQueryReturnType,
  GetFarmerReportDetailQueryReturnType,
  GetOrgMemberReportQueryType,
  GetUserReportReturnType,
} from "@/types";
import { pool } from "../configuration";

export const GetUserReport = async (
  userId: string
): Promise<GetUserReportReturnType> => {
  try {
    return (
      await pool.query(
        `select "reportId", "cropIdReported", "verificationStatus",  "dayReported", "dayHappen",  "title" from capstone.report where "farmerId" = $1`,
        [userId]
      )
    ).rows;
  } catch (error) {
    const err = error as Error;
    console.error("Error on getting the user report", error);
    throw new Error(
      `Error on getting the user report ${err.message as string}`
    );
  }
};

/**
 * query for inserting the new value of the report in the db
 * @param data are the needed value in the insertion
 */
export const AddNewFarmerReport = async (
  data: AddNewFarmerReportQueryType
): Promise<void> => {
  try {
    await pool.query(
      `insert into capstone.report ("reportId", "farmerId", "verificationStatus", "dayReported", "dayHappen", "title", "description") values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        data.reportId,
        data.farmerId,
        data.verificationStatus,
        data.dayReported,
        data.dayHappen,
        data.reportTitle,
        data.reportDescription,
      ]
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error on getting the user report", error);
    throw new Error(
      `Error on getting the user report ${err.message as string}`
    );
  }
};

export const GetFarmerReportDetailQuery = async (
  reportId: string
): Promise<GetFarmerReportDetailQueryReturnType> => {
  try {
    return (
      await pool.query(
        `SELECT r."cropIdReported", r."verificationStatus", r."dayReported", r."dayHappen", r."title", r."description", string_agg(i."imageUrl", ', ') AS pictures FROM capstone.report r LEFT JOIN capstone.image i ON r."reportId" = i."reportId" WHERE r."reportId" = $1 GROUP BY r."reportId", r."cropIdReported", r."verificationStatus", r."dayReported", r."dayHappen", r."title"`,
        [reportId]
      )
    ).rows[0];
  } catch (error) {
    const err = error as Error;
    console.error("Error on getting the user report", error);
    throw new Error(
      `Error on getting the user report ${err.message as string}`
    );
  }
};

/**
 * gets the report of the member in the same organization
 * @param orgId id of the organization that you want to see the reports
 * @returns reports of the members within the organization
 */
export const GetOrgMemberReportQuery = async (
  orgId: string
): Promise<GetOrgMemberReportQueryType> => {
  try {
    return (
      await pool.query(
        `select r."reportId", r."verificationStatus", r."dayReported", r."title", f."farmerFirstName", f."farmerLastName", f."farmerAlias" from capstone.report r join capstone.farmer f on f."farmerId" = r."farmerId" where f."orgId" = $1 order by case when r."verificationStatus" = $2 then $3 else $4 end asc`,
        [orgId, "false", 1, 2]
      )
    ).rows;
  } catch (error) {
    const err = error as Error;
    console.error("Error on getting the farm member report:", error);
    throw new Error(
      `Error on getting the farm member report: ${err.message as string}`
    );
  }
};

/**
 * query for approving the farmer org member
 * @param reportId id that you want to approved
 */
export const ApprovedOrgMemberQuery = async (reportId: string) => {
  try {
    await pool.query(
      `update capstone.report set "verificationStatus" = $1, "verifiedByOrgId" = (select f."orgId" from capstone.farmer f join capstone.report r on f."farmerId" = r."farmerId" where r."reportId" = $2), "dayVerified" = $3 where "reportId" = $4`,
      ["pending", reportId, new Date(), reportId]
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error on approving the farmer report:", error);
    throw new Error(
      `Error on approving the farmer report: ${err.message as string}`
    );
  }
};

export const GetAllFarmerReportQuery =
  async (): Promise<GetAllFarmerReportQueryReturnType> => {
    try {
      return (
        await pool.query(
          `select r."reportId", r."cropIdReported", r."verificationStatus", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", r."dayReported", r."dayHappen", o."orgName" from capstone.report r join capstone.farmer f on r."farmerId" = f."farmerId" left join capstone.org o on r."verifiedByOrgId" = o."orgId" where r."verificationStatus" = $1 or f."orgId" is null`,
          ["pending"]
        )
      ).rows;
    } catch (error) {
      const err = error as Error;
      console.error("Error on approving the farmer report:", error);
      throw new Error(
        `Error on approving the farmer report: ${err.message as string}`
      );
    }
  };
