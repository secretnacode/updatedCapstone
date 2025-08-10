"use server";

import { GetFarmerCropInfoQuery } from "@/util/queries/crop";
import { ProtectedAction } from "../protectedActions";
import { GetFarmerCropInfoReturnType } from "@/types";

export const GetFarmerNameCrop = async () => {
  try {
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.log(`Error in getting the farmer crop: ${err.message}`);
    return {
      success: false,
      notifError: [
        {
          message: `Error in getting the farmer crop: ${err.message}`,
          type: "error",
        },
      ],
    };
  }
};

export const GetFarmerCropInfo = async (
  cropId: string,
  isViewing: boolean
): Promise<GetFarmerCropInfoReturnType> => {
  try {
    if (isViewing) await ProtectedAction("read:farmer:crop");
    else await ProtectedAction("read:crop");

    return { success: true, cropData: await GetFarmerCropInfoQuery(cropId) };
  } catch (error) {
    const err = error as Error;
    console.log(`May pag kakamali sa pag gawa ng mga pananim: ${err.message}`);
    return {
      success: false,
      notifError: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }
};
