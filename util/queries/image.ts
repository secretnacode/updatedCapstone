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
    console.error(
      `May pagkakamali na hindi inaasahang nang yari habang kinukuha ang mga imahe: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang kinukuha ang mga imahe`
    );
  }
};
