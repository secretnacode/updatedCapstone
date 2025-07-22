"use server";

import {
  FarmerFirstDetailActionType,
  FarmerSecondDetailActionType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import { farmerFirstDetailFormSchema } from "@/util/helper_function/validation/validationSchema";
import { FarmerFirstDetailQuery } from "@/util/queries/user";
import { ProtectedAction } from "@/lib/protectedActions";

export const AddFirstFarmerDetails = async (
  prevData: FarmerFirstDetailActionType,
  formData: FormData
): Promise<FarmerFirstDetailActionType> => {
  const farmVal = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    alias: formData.get("alias") as string,
    mobileNumber: formData.get("mobileNumber") as string,
    birthdate: new Date(formData.get("birthdate") as string),
    farmerBarangay: formData.get("farmerBarangay") as string,
  };

  const returnVal: FarmerFirstDetailActionType = {
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
      notifError: {
        message: `Error in Adding First Farmer Detial: ${err.message}`,
        type: "error",
      },
    };
  }
};

export const AddSecondFarmerDetails = async (
  prevData: FarmerSecondDetailActionType,
  formData: FormData
): Promise<FarmerSecondDetailActionType> => {
  console.log(formData);
  const farmVal = {
    organization: null,
    otherOrg: null,
    cropFarmArea: "",
    farmAreaMeasurement: "ha",
    cropBaranggay: "",
  };

  const returnVal = {
    success: null,
    formError: null,
    notifError: null,
    fieldValues: {
      ...farmVal,
    },
  };

  try {
    return {
      ...returnVal,
    };
  } catch (error) {
    const err = error as Error;
    console.error(`Error in Adding First Farmer Detial: ${err.message}`);
    return {
      ...returnVal,
    };
  }
};
