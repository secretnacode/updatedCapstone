import {
  GetAllCropInfoQueryReturnType,
  GetFarmerCropInfoQueryReturnType,
  getFarmerCropNameQueryReturnType,
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

/**
 * server action that checkes if the pass cropId is the userId's crop
 * @param userId of the current user
 * @param cropId that will be deleted
 * @returns boolean
 */
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

/**
 * check if the crop that will be deleted has a report reference in the database
 * @param cropId of the crop that will be check
 * @returns boolean
 */
export const CheckCropIfHasReport = async (
  cropId: string
): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.report where "cropIdReported" = $1)`,
        [cropId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag checheck ng iyong pananim bago tanggalin: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag checheck ng iyong pananim bago tanggalin`
    );
  }
};

export const DeleteUserCropInfoQuery = async (cropId: string) => {
  try {
    await pool.query(`delete from capstone.crop where "cropId" = $1`, [cropId]);
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag tatanggal ng iyong pananim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag tatanggal ng iyong pananim`
    );
  }
};

export const GetAllCropInfoQuery = async (): Promise<
  GetAllCropInfoQueryReturnType[]
> => {
  try {
    return (
      await pool.query(
        `select c."cropId", c."cropLocation", c."farmerId", c."farmAreaMeasurement", c."cropName", c."cropLng", c."cropLat", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", f."farmerAlias" from capstone.crop c join capstone.farmer f on c."farmerId" = f."farmerId"`
      )
    ).rows;
  } catch (error) {
    console.error(
      `Unexpected error was encountered while getting all the crop information: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error was encountered while getting all the crop information`
    );
  }
};

export const getFarmerCropNameQuery = async (
  farmerId: string
): Promise<getFarmerCropNameQueryReturnType[]> => {
  try {
    return (
      await pool.query(
        `select "cropName", "cropId" from capstone.crop where "farmerId" = $1`,
        [farmerId]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng pangalan ng iyong pananim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng pangalan ng iyong pananim`
    );
  }
};
