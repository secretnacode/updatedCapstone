import {
  GetFarmerCropInfoQueryReturnType,
  GetMyCropInfoQueryRetrunType,
  HandleInsertCropType,
} from "@/types";
import { pool } from "../configuration";

/**
 * query function that is used to insert the new information of the farmer about their crops
 * @param data of the user crop that will be inserted in the DB
 */
export const CreateNewCropAfterSignUp = async (
  data: HandleInsertCropType
): Promise<void> => {
  try {
    await pool.query(
      `insert into capstone.crop ("cropId", "cropName", "cropLocation", "farmerId", "farmAreaMeasurement", "cropLng", "cropLat") values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        data.cropId,
        data.cropName,
        data.cropBaranggay,
        data.userId,
        data.farmArea,
        data.cropCoor.lng,
        data.cropCoor.lat,
      ]
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

export const GetMyCropInfoQuery = async (
  userId: string
): Promise<GetMyCropInfoQueryRetrunType[]> => {
  try {
    return (
      await pool.query(
        `select "cropId", "cropLocation", "farmAreaMeasurement", "cropName", "cropLng", "cropLat" from capstone.crop where "farmerId" = $1`,
        [userId]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng iyong pananim sa database: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng iyong pananim sa database`
    );
  }
};

export const checkIfFarmerCrop = async (
  userId: string,
  cropId: string
): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.crop where "farmerId" = $1 and "cropId" =  $2)`,
        [userId, cropId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag vavalidate ng iyong impormasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag vavalidate ng iyong impormasyon`
    );
  }
};

export const UpdateUserCropInfoQuery = async (
  cropVal: HandleInsertCropType
) => {
  try {
    await pool.query(
      `update capstone.crop set "cropName" = $1, "cropLocation" = $2, "farmAreaMeasurement" = $3, "cropLng" = $4, "cropLat" = $5 where "cropId" = $6 and "farmerId" = $7`,
      [
        cropVal.cropName,
        cropVal.cropBaranggay,
        cropVal.farmArea,
        cropVal.cropCoor.lng,
        cropVal.cropCoor.lat,
        cropVal.cropId,
        cropVal.userId,
      ]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng impormasyong ng iyong pananim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng impormasyong ng iyong pananim`
    );
  }
};
