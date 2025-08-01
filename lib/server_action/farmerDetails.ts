"use server";

import {
  CropErrorFormType,
  FarmerDetailCropType,
  FarmerFirstDetailActionReturnType,
  FarmerSecondDetailActionReturnType,
  HandleInsertCropType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import {
  farmerFirstDetailFormSchema,
  farmerSecondDetailFormSchema,
} from "@/util/helper_function/validation/validationSchema";
import {
  FarmerFirstDetailQuery,
  GetAgriRole,
  GetFarmerRole,
  UpdateUserOrgAndRoleAfterSignUp,
} from "@/util/queries/user";
import { ProtectedAction } from "@/lib/protectedActions";
import { CreateNewOrgAfterSignUp } from "@/util/queries/org";
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
 * @returns
 */
export const AddSecondFarmerDetails = async (
  cropList: FarmerDetailCropType[]
): Promise<FarmerSecondDetailActionReturnType> => {
  try {
    const userId = await ProtectedAction("create:crop");

    const validateCropList: CropErrorFormType = cropList.reduce(
      (acc: CropErrorFormType | [], crop: FarmerDetailCropType) => {
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

    if (validateCropList.length > 0)
      return {
        success: false,
        cropErrors: validateCropList,
        notifError: [
          {
            message:
              "May mga kulang sa inilagay mong impormasyon, ayusin to saka mag pasa ulit",
            type: "warning",
          },
        ],
      };

    cropList.forEach(async (crop) => {
      const convertedMeasurement = ConvertMeassurement(
        crop.cropFarmArea,
        crop.farmAreaMeasurement
      );

      await CreateNewOrgForNewUser({
        ...crop,
        farmAreaMeasurement: convertedMeasurement,
        userId: userId,
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
 * functions to call another function to inserted the data in the db
 * @param data of the user that will be inserted and updated in the DB
 */
const CreateNewOrgForNewUser = async (
  data: HandleInsertCropType
): Promise<void> => {
  try {
    console.log(data);

    let orgId = "";
    const isOtherOrg = data.organization === "other";

    if (isOtherOrg && data.otherOrg) {
      orgId = (await CreateNewOrgAfterSignUp(data.otherOrg, data.userId)).orgId;
    }

    await UpdateUserOrgAndRoleAfterSignUp(
      data.organization === "none"
        ? null
        : isOtherOrg
        ? orgId
        : data.organization,
      data.organization === "none" ? null : isOtherOrg ? "leader" : "member",
      data.userId
    );

    await CreateNewCropAfterSignUp({
      cropId: data.cropId,
      userId: data.userId,
      cropLocation: data.cropBaranggay,
      farmAreaMeasurement: data.farmAreaMeasurement,
    });
  } catch (error) {
    const err = error as Error;
    console.error(
      "Error updating the farmer and inserting a value in org and crop:",
      error
    );
    throw new Error(`${err.message as string}`);
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

/**
 * gets the user role base on the passed params of work and will only throw an error and will be consumed by redirect function
 * @param userId params id of the current user
 * @param work params of the work of th current user(e.g. farmer or agriculturist)
 * @returns the role of the user
 */
export const GetUserRole = async (
  userId: string,
  work: string
): Promise<string> => {
  try {
    const userId = await ProtectedAction("read:user");

    if (work === "farmer") return (await GetFarmerRole(userId)).orgRole;
    else return (await GetAgriRole(userId)).orgRole;
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message);
  }
};
