import { InsertCropAfterSignUpType } from "@/types";
import pool from "../db";

/**
 * query function that is used to insert the new information of the farmer about their crops
 * @param data of the user crop that will be inserted in the DB
 */
export const CreateNewCropAfterSignUp = async (
  data: InsertCropAfterSignUpType
): Promise<void> => {
  try {
    await pool.query(
      `insert into capstone.crop ("cropId", "cropLocation", "farmerId", "farmAreaMeasurement") values ($1, $2, $3, $4)`,
      [data.cropId, data.cropLocation, data.userId, data.farmAreaMeasurement]
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in Getting the available org:", error);
    throw new Error(
      `Error in Getting the available org: ${err.message as string}`
    );
  }
};
