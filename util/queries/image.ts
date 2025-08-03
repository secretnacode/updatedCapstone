import { AddNewFarmerReportImageType } from "@/types";
import { pool } from "../configuration";

export const AddNewFarmerReportImage = async (
  data: AddNewFarmerReportImageType
): Promise<void> => {
  try {
    await pool.query(
      `insert into capstone.image ("pictureId", "reportId", "pictureUrl") values ($1, $2, $3)`,
      [data.picId, data.reportId, data.pictureUrl]
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in Getting the available org:", error);
    throw new Error(
      `Error in Getting the available org: ${err.message as string}`
    );
  }
};
