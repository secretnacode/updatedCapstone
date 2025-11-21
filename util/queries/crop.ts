"use server";

import {
  cropStatusType,
  GetAllCropInfoQueryReturnType,
  getCropCountPerBrgyQueryReturnType,
  getCropNameQueryReturnType,
  getCropStatusAndExpectedHarvestReturnType,
  getCropStatusAndPlantedDateReturnType,
  getCropStatusCountQueryReturnType,
  getCropStatusReturnType,
  GetFarmerCropInfoQueryReturnType,
  getFarmerCropNameQueryReturnType,
  GetMyCropInfoQueryRetrunType,
  getMyCropStatusDetailQueryReturnType,
  HandleInsertCropType,
  updateCropPantedPropType,
} from "@/types";
import { pool } from "../configuration";

export const cropStatus = async (): Promise<
  Record<cropStatusType, cropStatusType>
> => ({
  planted: "planted",
  harvested: "harvested",
});

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
  farmerId: string
): Promise<GetFarmerCropInfoQueryReturnType[]> => {
  try {
    return (
      await pool.query(
        `select "cropId", "cropLocation", "farmAreaMeasurement",  "cropStatus", "datePlanted", "dateHarvested", "cropName" from capstone.crop where "farmerId" = $1`,
        [farmerId]
      )
    ).rows;
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
        `select "cropId", "cropLocation", "farmAreaMeasurement", "cropName", "cropLng", "cropLat", "cropStatus", "dateHarvested", "datePlanted"  from capstone.crop where "farmerId" = $1`,
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
        `select exists(select 1 from capstone.report where "cropId" = $1)`,
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

/**
 * query for getting all the crop info of the farmer
 * @returns
 */
export const GetAllCropInfoQuery = async (): Promise<
  GetAllCropInfoQueryReturnType[]
> => {
  try {
    return (
      await pool.query(
        `select c."cropId", c."cropStatus", c."datePlanted", c."dateHarvested", c."cropLocation", c."farmerId", c."farmAreaMeasurement", c."cropLng", c."cropLat", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", f."farmerAlias" from capstone.crop c join capstone.farmer f on c."farmerId" = f."farmerId"`
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

/**
 * qurty for getting all the crop name of the farmer
 * @param farmerId id of the farmer who will get all the crop name
 * @returns
 */
export const getFarmerCropInfoQuery = async (
  farmerId: string
): Promise<getFarmerCropNameQueryReturnType[]> => {
  try {
    return (
      await pool.query(
        `select "cropName", "cropId", "cropStatus", "datePlanted", "dateHarvested" from capstone.crop where "farmerId" = $1`,
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

/**
 * qurty for getting all the crop name of the farmer
 * @param farmerId id of the farmer who will get all the crop name
 * @returns
 */
export const getFarmerCropNameQuery = async (
  farmerId: string
): Promise<getCropNameQueryReturnType> => {
  try {
    const crop = await pool.query(
      `select "cropName", "cropId", "cropStatus", "datePlanted", "dateHarvested" from capstone.crop where "farmerId" = $1`,
      [farmerId]
    );

    if (crop.rowCount === 0)
      return {
        hasCrop: false,
        notifError: [
          { message: "Wala ka pang pananim na nakalagay", type: "warning" },
          {
            message:
              "Mag lagay muna ng impormasyon ng pananim bago mag pasa ng ulat",
            type: "warning",
          },
        ],
      };

    return {
      hasCrop: true,
      cropName: crop.rows,
    };
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

/**
 * query for getting the crop status
 * @param cropId id of the crop to be fetch
 * @returns
 */
export const getCropStatus = async (
  cropId: string
): Promise<getCropStatusReturnType> => {
  try {
    return (
      await pool.query(
        `select "cropStatus" from capstone.crop where "cropId" = $1`,
        [cropId]
      )
    ).rows[0];
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

/**
 * query for getting the crop status and the expected harvest of the crop
 * @param cropId id of the crop to be fetch
 * @returns
 */
export const getCropStatusAndExpectedHarvest = async (
  cropId: string
): Promise<getCropStatusAndExpectedHarvestReturnType> => {
  try {
    return (
      await pool.query(
        `select "cropStatus", date("dateHarvested" + interval '3 months' ) as expectedHarvest from capstone.crop where "cropId" = $1`,
        [cropId]
      )
    ).rows[0];
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

/**
 * query for updating the crop into planted status
 * @param param0 id of the crop and date planted
 */
export const updateCropIntoPlantedStatus = async ({
  datePlanted,
  cropId,
}: updateCropPantedPropType) => {
  try {
    const planted = (await cropStatus()).planted;

    await pool.query(
      `update capstone.crop set "cropStatus" = $1, "datePlanted" = $2 where "cropId" = $3`,
      [planted, datePlanted, cropId]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng kalagayan ng pananim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng kalagayan ng pananim`
    );
  }
};

/**
 * query for updating the crop into planted status
 * @param param0 id of the crop and date planted
 */
export const updateCropIntoHarvestedStatus = async ({
  datePlanted,
  cropId,
}: updateCropPantedPropType) => {
  try {
    const harvested = (await cropStatus()).harvested;

    await pool.query(
      `update capstone.crop set "cropStatus" = $1, "dateHarvested" = $2 where "cropId" = $3`,
      [harvested, datePlanted, cropId]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng kalagayan ng pananim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng kalagayan ng pananim`
    );
  }
};

/**
 * query for ggetting the crop status and its planted date
 * @param cropId id of the crop to be get
 * @returns
 */
export const getCropStatusAndPlantedDate = async (
  cropId: string
): Promise<getCropStatusAndPlantedDateReturnType> => {
  try {
    return (
      await pool.query(
        `select "cropStatus", "dateHarvested" from capstone.crop where "cropId" = $1`,
        [cropId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng kalagayan ng pananim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng kalagayan ng pananim`
    );
  }
};

/**
 * query for getting all the crop status detail
 * @param farmerId id of the farmer that will get the crop status detail
 * @returns
 */
export const getMyCropStatusDetailQuery = async (
  farmerId: string
): Promise<getMyCropStatusDetailQueryReturnType[]> => {
  try {
    return (
      await pool.query(
        `select "cropId", "cropName", "farmAreaMeasurement", "cropStatus", "datePlanted", "dateHarvested" from capstone.crop where "farmerId" = $1 limit 3`,
        [farmerId]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng kalagayan ng pananim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng kalagayan ng pananim`
    );
  }
};

export const getCropCountPerBrgyQuery = async (): Promise<
  getCropCountPerBrgyQueryReturnType[]
> => {
  try {
    return (
      await pool.query(
        `select count("cropId") as "cropCount", "cropLocation" from capstone.crop group by "cropLocation"`
      )
    ).rows;
  } catch (error) {
    console.error(
      `Unexpected error happen while getting the crop count per baranggay: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error happen while getting the crop count per baranggay`
    );
  }
};

export const getAllCropStatusAndPlantedDate = async (): Promise<
  getCropStatusCountQueryReturnType[]
> => {
  try {
    return (
      await pool.query(
        `select "cropStatus", "datePlanted", "dateHarvested" from capstone.crop`
      )
    ).rows;
  } catch (error) {
    console.error(
      `Unexpected error happen while getting the crop status count: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `Unexpected error happen while getting the crop status count`
    );
  }
};

/**
 * query for getting the farm area meassurement of the crop
 * @param cropId id of the crop that will be get
 * @returns string
 */
export const getCropFarmArea = async (cropId: string): Promise<string> => {
  try {
    return (
      await pool.query(
        `select "farmAreaMeasurement" from capstone.crop where "cropId" = $1`,
        [cropId]
      )
    ).rows[0].farmAreaMeasurement;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng sukat ng iyong pananim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng sukat ng iyong pananim`
    );
  }
};
