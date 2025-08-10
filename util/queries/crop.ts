import {
  GetFarmerCropInfoQueryReturnType,
  InsertCropAfterSignUpType,
} from "@/types";
import { pool } from "../configuration";

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
    console.error("May pag kakamali sa pag gawa ng panibagong pananim:", error);
    throw new Error(
      `May pag kakamali sa pag gawa ng panibagong pananim: ${
        err.message as string
      }`
    );
  }
};

export const GetFarmerCropInfoQuery = async (
  cropId: string
): Promise<GetFarmerCropInfoQueryReturnType> => {
  try {
    return (
      await pool.query(
        `select "dayPlanted", "cropLocation", "farmAreaMeasurement" from capstone.crop where "cropId" = $1`,
        [cropId]
      )
    ).rows[0];
  } catch (error) {
    const err = error as Error;
    console.error(
      "May pag kakamali sa pag kuha ng pananim sa database:",
      error
    );
    throw new Error(
      `May pag kakamali sa pag kuha ng pananim sa database: ${
        err.message as string
      }`
    );
  }
};
