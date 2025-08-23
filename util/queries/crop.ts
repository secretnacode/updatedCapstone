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
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag gawa ng panibagong pananim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag gawa ng panibagong pananim`
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
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng pananim sa database: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng pananim sa database`
    );
  }
};
