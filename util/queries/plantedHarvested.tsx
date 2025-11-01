"use server";

import { addHarvestedCropParamType, addPlantedCropParamType } from "@/types";
import { pool } from "../configuration";

/**
 * query for adding a record in the planted table
 * @param param0
 */
export const addPlantedCrop = async ({
  plantedId,
  reportId,
  cropId,
  cropKgPlanted,
  datePlanted,
}: addPlantedCropParamType) => {
  try {
    await pool.query(
      `insert into capstone.planted ("plantedId", "reportId", "cropId", "cropKgPlanted", "datePlanted") values ($1, $2, $3, $4, $5)`,
      [plantedId, reportId, cropId, cropKgPlanted, datePlanted]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lalagay ng panibagong tanim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lalagay ng panibagong tanim`
    );
  }
};

/**
 * query for adding a record in the harvested table
 * @param param0
 */
export const addHarvestedCrop = async ({
  harvestId,
  reportId,
  cropId,
  totalKgHarvested,
  dateHarvested,
}: addHarvestedCropParamType) => {
  try {
    await pool.query(
      `insert into capstone.harvested ("harvestId", "reportId", "cropId", "totalKgHarvested", "dateHarvested") values ($1, $2, $3, $4, $5)`,
      [harvestId, reportId, cropId, totalKgHarvested, dateHarvested]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lalagay ng panibagong tanim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lalagay ng panibagong tanim`
    );
  }
};
