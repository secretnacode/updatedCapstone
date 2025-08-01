import { GetUserReportReturnType } from "@/types";
import pool from "../db";

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
