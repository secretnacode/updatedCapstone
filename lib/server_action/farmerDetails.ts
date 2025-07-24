"use server";

import {
  FarmerFirstDetailActionReturnType,
  FarmerSecondDetailActionReturnType,
  FarmerSecondDetailFormType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import { farmerFirstDetailFormSchema } from "@/util/helper_function/validation/validationSchema";
import { FarmerFirstDetailQuery } from "@/util/queries/user";
import { ProtectedAction } from "@/lib/protectedActions";

export const AddFirstFarmerDetails = async (
  prevData: FarmerFirstDetailActionReturnType,
  formData: FormData
): Promise<FarmerFirstDetailActionReturnType> => {
  const farmVal = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    alias: formData.get("alias") as string,
    mobileNumber: formData.get("mobileNumber") as string,
    birthdate: new Date(formData.get("birthdate") as string),
    farmerBarangay: formData.get("farmerBarangay") as string,
  };

  const returnVal: FarmerFirstDetailActionReturnType = {
    success: null,
    formError: null,
    notifError: null,
    fieldValues: {
      ...farmVal,
    },
  };

  try {
    const userId = await ProtectedAction("create:user");

    const validateVal = ZodValidateForm(farmVal, farmerFirstDetailFormSchema);
    if (!validateVal.valid) {
      console.log(validateVal.formError);
      return {
        ...returnVal,
        success: false,
        formError: validateVal.formError,
      };
    }

    await FarmerFirstDetailQuery({
      ...farmVal,
      mobileNumber: farmVal.mobileNumber,
      farmerId: userId,
      verified: false,
      dateCreated: new Date(),
    });

    return {
      ...returnVal,
      success: true,
    };
  } catch (error) {
    const err = error as Error;
    console.error(`Error in Adding First Farmer Detial: ${err.message}`);
    return {
      ...returnVal,
      success: false,
      notifError: [
        {
          message: `Error in Adding First Farmer Detial: ${err.message}`,
          type: "error",
        },
      ],
    };
  }
};

export const AddSecondFarmerDetails = async (
  cropList: FarmerSecondDetailFormType[]
): Promise<FarmerSecondDetailActionReturnType> => {
  const returnVal: FarmerSecondDetailActionReturnType = {
    success: null,
    formError: null,
    notifError: null,
    fieldValues: cropList,
  };

  try {
    console.log(cropList);
    const userId = await ProtectedAction("create:ussser");

    return returnVal;
  } catch (error) {
    const err = error as Error;
    return {
      ...returnVal,
      success: false,
      formError: null,
      notifError: [
        {
          message: `Error in Adding First Farmer Detial: ${err.message}`,
          type: "error",
        },
      ],
    };
  }
};
