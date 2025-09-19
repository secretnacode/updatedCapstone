"use server";

import {
  CropFormErrorsType,
  FarmerFirstDetailActionReturnType,
  FarmerFirstDetailFormType,
  FarmerSecondDetailActionReturnType,
  FarmerSecondDetailFormType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import {
  farmerFirstDetailFormSchema,
  farmerSecondDetailFormSchema,
} from "@/util/helper_function/validation/validationSchema";
import { FarmerFirstDetailQuery } from "@/util/queries/user";
import { ProtectedAction } from "@/lib/protectedActions";
import { CreateNewOrg } from "@/util/queries/org";
import { CreateNewCropAfterSignUp } from "@/util/queries/crop";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * server action that partners with the actionState hook
 * @param prevData is the default value of the state in the front end
 * @param formData is the values of the form
 * @returns the prevData and a success object that if a falsey value it will return a formError that will show the error of the form and notifError if there's an error that needs to be notified
 */
export const AddFirstFarmerDetails = async (
  newUserVal: FarmerFirstDetailFormType
): Promise<FarmerFirstDetailActionReturnType<FarmerFirstDetailFormType>> => {
  try {
    const userId = await ProtectedAction("create:user");

    const validateVal = ZodValidateForm(
      newUserVal,
      farmerFirstDetailFormSchema
    );
    console.log(validateVal);
    if (!validateVal.valid) {
      return {
        success: false,
        notifError: [
          {
            message:
              "May mga mali kang nailagay, ayusin muna ito bago mag pasa ng panibago",
            type: "warning",
          },
        ],
        formError: validateVal.formError,
      };
    }

    const org =
      newUserVal.organization === "other" && newUserVal.newOrganization
        ? (await CreateNewOrg(newUserVal.newOrganization, userId)).orgId
        : newUserVal.organization === "none"
        ? null
        : newUserVal.organization;

    const orgRole =
      newUserVal.organization === "other" && newUserVal.newOrganization
        ? "leader"
        : newUserVal.organization === "none"
        ? null
        : "member";

    await FarmerFirstDetailQuery({
      ...newUserVal,
      countFamilyMember: Number(newUserVal.countFamilyMember),
      organization: org,
      orgRole: orgRole,
      mobileNumber: Number(newUserVal.mobileNumber),
      farmerId: userId,
      verified: false,
      dateCreated: new Date(),
    });

    return {
      success: true,
    };
  } catch (error) {
    const err = error as Error;
    console.error(`Error in Adding First Farmer Detial: ${err.message}`);
    return {
      success: false,
      notifError: [
        {
          message: ` ${err.message}`,
          type: "error",
        },
      ],
    };
  }
};

/**
 * server action for second farmer detail where the user i
 * @param cropList
 * @returns redirect the use if the validation was success
 */
export const AddSecondFarmerDetails = async (
  cropList: FarmerSecondDetailFormType[]
): Promise<FarmerSecondDetailActionReturnType> => {
  try {
    console.log(cropList);
    const userId = await ProtectedAction("create:crop");

    const validateCropList: CropFormErrorsType[] = cropList.reduce(
      (acc: CropFormErrorsType[] | [], crop: FarmerSecondDetailFormType) => {
        const validateCrop = ZodValidateForm(
          crop,
          farmerSecondDetailFormSchema
        );
        if (!validateCrop.valid)
          return [
            ...acc,
            { cropId: crop.cropId, formError: validateCrop.formError },
          ];
        return acc;
      },
      []
    );

    console.log(validateCropList);
    if (validateCropList.length > 0)
      return {
        success: false,
        formList: validateCropList,
        notifError: [
          {
            message:
              "May mga kulang sa inilagay mong impormasyon, ayusin to saka mag pasa ulit",
            type: "warning",
          },
        ],
      };

    // one by one inserting the crop information in the database
    cropList.forEach(async (crop) => {
      const { cropFarmArea, farmAreaMeasurement, ...cropVal } = crop;

      await CreateNewCropAfterSignUp({
        farmArea: ConvertMeassurement(cropFarmArea, farmAreaMeasurement),
        userId,
        ...cropVal,
      });
    });

    redirect("/farmer");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;
    console.error(`Error in Adding First Farmer Detial: ${err.message}`);
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

/**
 * used to convert the user farmerAreaMasurement into a hectare value
 * @param measurement of the area (e.g. 200)
 * @param unit of the area (e.g. sqm(square meter))
 * @returns the converted measurements value of the area into a hectare value
 */
const ConvertMeassurement = (measurement: string, unit: string): string => {
  switch (unit) {
    case "ac":
      return (Number(measurement) / 2.471).toFixed(4);
    case "sqft":
      return (Number(measurement) / 107600).toFixed(4);
    case "sqm":
      return (Number(measurement) / 10000).toFixed(4);
    default:
      return measurement;
  }
};
