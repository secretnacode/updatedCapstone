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
import { FarmerFirstDetailQuery, GetFarmerRole } from "@/util/queries/user";
import { ProtectedAction } from "@/lib/protectedActions";
import {
  CreateNewOrg,
  organizationNameIsExist,
  UpdateUserOrg,
} from "@/util/queries/org";
import { CreateNewCropAfterSignUp } from "@/util/queries/crop";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ConvertMeassurement } from "@/util/helper_function/reusableFunction";
import { UpdateSessionRole } from "../session";

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
    const userId = (await ProtectedAction("create:user")).userId;

    const validateVal = ZodValidateForm(
      newUserVal,
      farmerFirstDetailFormSchema
    );
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

    // check if the new organization name is already existing or not
    if (newUserVal.organization === "other" && newUserVal.newOrganization)
      if (await organizationNameIsExist(newUserVal.newOrganization))
        return {
          success: false,
          notifError: [
            {
              message:
                "Paltan ang pangalan ng organisasyon na iyong inilagay sapagkat may gumagamit na nito",
              type: "warning",
            },
          ],
          formError: {
            newOrganization: [
              "May gumagamit na ng panglan na ito, ito ay paltan!",
            ],
          },
        };

    await FarmerFirstDetailQuery({
      ...newUserVal,
      countFamilyMember: Number(newUserVal.countFamilyMember),
      mobileNumber: Number(newUserVal.mobileNumber),
      farmerId: userId,
      verified: false,
      isDeleted: false,
      dateCreated: new Date(),
    });

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

    await UpdateUserOrg({
      orgId: org,
      orgRole: orgRole,
      farmerId: userId,
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
    const userId = (await ProtectedAction("create:crop")).userId;

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
    await Promise.all(
      cropList.map(async (crop) => {
        const { cropFarmArea, farmAreaMeasurement, ...cropVal } = crop;

        return CreateNewCropAfterSignUp({
          farmArea: ConvertMeassurement(cropFarmArea, farmAreaMeasurement),
          userId,
          ...cropVal,
        });
      })
    );

    await UpdateSessionRole(
      (await GetFarmerRole(userId)).orgRole === "member" ? "farmer" : "leader"
    );

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
