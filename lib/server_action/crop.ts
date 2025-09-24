"use server";

import {
  checkIfFarmerCrop,
  GetFarmerCropInfoQuery,
  GetMyCropInfoQuery,
  UpdateUserCropInfoQuery,
} from "@/util/queries/crop";
import { ProtectedAction } from "../protectedActions";
import {
  FarmerSecondDetailFormType,
  GetFarmerCropInfoReturnType,
  GetMyCropInfoReturnType,
  UpdateUserCropInfoReturnType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import { farmerSecondDetailFormSchema } from "@/util/helper_function/validation/validationSchema";
import {
  ConvertMeassurement,
  FormErrorMessage,
} from "@/util/helper_function/reusableFunction";
import { revalidatePath } from "next/cache";

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

export const GetMyCropInfo = async (): Promise<GetMyCropInfoReturnType> => {
  try {
    const userId = await ProtectedAction("read:crop");

    return { success: true, myCropInfoList: await GetMyCropInfoQuery(userId) };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May pagkakamali sa pag kuha ng impormasyon sa iyong pananim: ${err.message}`
    );
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

export const UpdateUserCropInfo = async (
  cropVal: FarmerSecondDetailFormType
): Promise<UpdateUserCropInfoReturnType> => {
  try {
    const userId = await ProtectedAction("update:crop");

    // validate crop val
    const validate = ZodValidateForm<FarmerSecondDetailFormType>(
      cropVal,
      farmerSecondDetailFormSchema
    );
    if (!validate.valid)
      return {
        success: false,
        formError: validate.formError,
        notifMessage: [{ message: FormErrorMessage(), type: "warning" }],
      };

    if (!(await checkIfFarmerCrop(userId, cropVal.cropId))) {
      return {
        success: false,
        closeModal: true,
        notifMessage: [
          { message: "Bawal mo mabago ang impormasyon na ito", type: "error" },
        ],
      };
    }

    const { farmAreaMeasurement, cropFarmArea, ...crop } = cropVal;

    await UpdateUserCropInfoQuery({
      ...crop,
      userId,
      farmArea: ConvertMeassurement(cropFarmArea, farmAreaMeasurement),
    });

    revalidatePath("/farmer/crop");

    return {
      success: true,
      notifMessage: [
        {
          message: "Matagumpay na nabago ang impormasyong ng iyong pananim",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May pagkakamali sa pag uupdate ng impormasyon sa iyong pananim: ${err.message}`
    );
    return {
      success: false,
      notifMessage: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }
};
