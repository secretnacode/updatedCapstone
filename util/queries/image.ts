import { AddNewFarmerReportImageType } from "@/types";
import { pool } from "../configuration";

export const AddNewFarmerReportImage = async (
  data: AddNewFarmerReportImageType
): Promise<void> => {
  try {
    await pool.query(
      `insert into capstone.image ("imageId", "reportId", "imageUrl") values ($1, $2, $3)`,
      [data.picId, data.reportId, data.pictureUrl]
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in adding image in the report:", error);
    throw new Error(
      `Error in adding image in the report: ${err.message as string}`
    );
  }
};
