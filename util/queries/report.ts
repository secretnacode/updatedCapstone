import {
  AddNewFarmerReportQueryType,
  GetFarmerReportDetailQueryReturnType,
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
