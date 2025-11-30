"use server";

import {
  addDamageReportParamType,
  addHarvestedCropParamType,
  addPlantedCropParamType,
  getDamageInfoReturnType,
  getPlantedCropTypeReturnType,
  getTotalHarvestReturnType,
} from "@/types";
import { pool } from "../configuration";

/**
 * query for adding a record in the planted table
 * @param param0
 */
export const addPlantedCrop = async ({
  plantedId,
  reportId,
  cropId,
  cropType,
  datePlanted,
  farmerId,
}: addPlantedCropParamType) => {
  try {
    await pool.query(
      `insert into capstone.planted ("plantedId", "reportId", "cropId", "cropType", "datePlanted", "farmerId") values ($1, $2, $3, $4, $5, $6)`,
      [plantedId, reportId, cropId, cropType, datePlanted, farmerId]
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

/**
 * query for adding a damage report info
 * @param param0
 */
export const addDamageReport = async ({
  damageId,
  reportId,
  cropId,
  farmerId,
  totalDamageArea,
}: addDamageReportParamType) => {
  try {
    await pool.query(
      `insert into capstone.damage ("damageId", "reportId", "cropId", "farmerId", "totalDamageArea") values ($1, $2, $3, $4, $5)`,
      [damageId, reportId, cropId, farmerId, totalDamageArea]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag dadag dag mo ng ulat patungkol sa pagkasira: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag dadag dag mo ng ulat patungkol sa pagkasira`
    );
  }
};

/**
 * query for getting how much the damage has done in the field
 * @param reportId id of the report that will get the damage
 * @returns
 */
export const getCropTotalDamage = async (
  reportId: string
): Promise<getDamageInfoReturnType> => {
  try {
    return (
      await pool.query(
        `select "totalDamageArea" from capstone.damage where "reportId" = $1`,
        [reportId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha mo ng ulat patungkol sa pagka sira: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha mo ng ulat patungkol sa pagka sira`
    );
  }
};

export const getTotalHarvest = async (
  reportId: string
): Promise<getTotalHarvestReturnType> => {
  try {
    return (
      await pool.query(
        `select "totalKgHarvest" from capstone.harvested where "reportId" = $1`,
        [reportId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha mo ng ulat patungkol sa pag-aani: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha mo ng ulat patungkol sa pag-aani`
    );
  }
};

export const getPlantedCropType = async (
  reportId: string
): Promise<getPlantedCropTypeReturnType> => {
  try {
    return (
      await pool.query(
        `select "cropType" from capstone.planted where "reportId" = $1`,
        [reportId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha mo ng ulat patungkol sa pagtatanim: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha mo ng ulat patungkol sa pagtatanim`
    );
  }
};
