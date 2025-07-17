"use server";

import { FarmerFirstDetailType, FirstFarmerDetailFormType } from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import { farmerFirstDetailFormSchema } from "@/util/helper_function/validation/validationSchema";
import {
  CheckMobileNumFormat,
  CreateUUID,
} from "@/util/helper_function/reusableFunction";
import { FarmerFirstDetailQuery } from "@/util/queries/user";
import { GetSession } from "../session";

export const AddFirstFarmerDetails = async (
  prevData: FirstFarmerDetailFormType,
  formData: FormData
): Promise<FirstFarmerDetailFormType> => {
  const farmVal = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    alias: formData.get("alias") as string,
    mobileNumber: formData.get("mobileNumber") as string,
    birthdate: new Date(formData.get("birthdate") as string),
    farmerBarangay: formData.get("farmerBarangay") as string,
  };

  const returnVal: FirstFarmerDetailFormType = {
    success: null,
    formError: null,
    notifError: null,
    fieldValues: {
      firstName: farmVal.firstName,
      lastName: farmVal.lastName,
      alias: farmVal.alias,
      mobileNumber: farmVal.mobileNumber,
      birthdate: new Date(farmVal.birthdate),
      farmerBarangay: farmVal.farmerBarangay,
    },
  };

  try {
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
      farmerId: await GetSession(),
      verified: false,
      dateCreated: new Date(),
    });

    return {
      success: false,
      formError: null,
      notifError: null,
      fieldValues: {
        firstName: farmVal.firstName,
        lastName: farmVal.lastName,
        alias: farmVal.alias,
        mobileNumber: farmVal.mobileNumber,
        birthdate: new Date(farmVal.birthdate),
        farmerBarangay: farmVal.farmerBarangay,
      },
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
