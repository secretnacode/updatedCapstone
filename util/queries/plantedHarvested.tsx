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
  farmerId,
}: addPlantedCropParamType) => {
  try {
    await pool.query(
      `insert into capstone.planted ("plantedId", "reportId", "cropId", "cropKgPlanted", "datePlanted", "farmerId") values ($1, $2, $3, $4, $5, $6)`,
      [plantedId, reportId, cropId, cropKgPlanted, datePlanted, farmerId]
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
  farmerId,
}: addHarvestedCropParamType) => {
  try {
    await pool.query(
      `insert into capstone.harvested ("harvestId", "reportId", "cropId", "totalKgHarvest", "dateHarvested", "farmerId") values ($1, $2, $3, $4, $5, $6)`,
      [harvestId, reportId, cropId, totalKgHarvested, dateHarvested, farmerId]
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
