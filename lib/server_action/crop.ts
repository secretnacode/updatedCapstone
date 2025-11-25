"use server";

import {
  checkIfFarmerCrop,
  CreateNewCropAfterSignUp,
  GetAllCropInfoQuery,
  getAllCropStatusAndPlantedDate,
  getCropCountPerBrgyQuery,
  GetFarmerCropInfoQuery,
  getFarmerCropNameQuery,
  GetMyCropInfoQuery,
  getMyCropStatusDetailQuery,
  UpdateUserCropInfoQuery,
} from "@/util/queries/crop";
import { ProtectedAction } from "../protectedActions";
import {
  AddUserCropInfoReturnType,
  FarmerSecondDetailFormType,
  GetAllCropInfoReturnType,
  getCropCountPerBrgyReturnType,
  getCropStatusCountCropStatusAccType,
  getCropStatusCountQueryReturnType,
  getCropStatusCountReturnType,
  GetFarmerCropInfoReturnType,
  getFarmerCropNameReturnType,
  GetMyCropInfoReturnType,
  getMyCropStatusDetailReturnType,
  SessionValueType,
  UpdateUserCropInfoReturnType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import { farmerSecondDetailFormSchema } from "@/util/helper_function/validation/validationSchema";
import {
  CreateUUID,
  determineCropStatus,
  missingFormValNotif,
  NotAMemberErrorMessage,
  redirectWithNotifMessage,
} from "@/util/helper_function/reusableFunction";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { CheckMyMemberquery } from "@/util/queries/user";

export const GetFarmerCropInfo = async (
  farmerId: string,
  isViewing: boolean
): Promise<GetFarmerCropInfoReturnType> => {
  try {
    let validate: SessionValueType | null = null;

    if (isViewing) {
      validate = await ProtectedAction("read:farmer:crop");

      // checks if the user that is viewing the farmer profile is a leader and if the leader and the farmer is in the same organization
      if (
        validate.work === "leader" &&
        !(await CheckMyMemberquery(farmerId, validate.userId))
      )
        return {
          success: false,
          notifError: [
            {
              message: NotAMemberErrorMessage(),
              type: "error",
            },
          ],
        };
    }

    if (!validate) validate = await ProtectedAction("read:crop");

    return {
      success: true,
      cropData: await GetFarmerCropInfoQuery(farmerId),
    };
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
    const userId = (await ProtectedAction("read:crop")).userId;

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
    const userId = (await ProtectedAction("update:crop")).userId;

    const validate = ZodValidateForm<FarmerSecondDetailFormType>(
      cropVal,
      farmerSecondDetailFormSchema
    );
    if (!validate.valid)
      return {
        success: false,
        formError: validate.formError,
        notifMessage: missingFormValNotif(),
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

    const { cropFarmArea, ...crop } = cropVal;

    await UpdateUserCropInfoQuery({
      ...crop,
      userId,
      farmArea: cropFarmArea,
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
export const AddUserCropInfo = async (
  cropVal: FarmerSecondDetailFormType
): Promise<AddUserCropInfoReturnType> => {
  try {
    const { userId } = await ProtectedAction("create:crop");

    // eslint-disable-next-line prefer-const
    let { cropId, cropFarmArea, ...otherCropInfo } = cropVal;
    cropId = CreateUUID();

    const validate = ZodValidateForm<FarmerSecondDetailFormType>(
      { ...otherCropInfo, cropId, cropFarmArea },
      farmerSecondDetailFormSchema
    );
    if (!validate.valid)
      return {
        success: false,
        formError: validate.formError,
        notifMessage: missingFormValNotif(),
      };

    await CreateNewCropAfterSignUp({
      cropId,
      userId,
      ...otherCropInfo,
      farmArea: cropFarmArea,
    });

    revalidatePath("/farmer/crop");

    return {
      success: true,
      notifMessage: [
        {
          message: "Matagumpay ang pagdadagdag mo ng taniman",
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

export const GetAllCropInfo = async (): Promise<GetAllCropInfoReturnType> => {
  try {
    await ProtectedAction("read:farmer:crop");

    return { success: true, allCropInfo: await GetAllCropInfoQuery() };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May pagkakamali sa pag kuha lahat ng impormasyon ng lahat ng taniman: ${err.message}`
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

export const getFarmerCropName =
  async (): Promise<getFarmerCropNameReturnType> => {
    try {
      const userId = (await ProtectedAction("read:crop")).userId;

      const crop = await getFarmerCropNameQuery(userId);

      if (!crop.hasCrop)
        return redirectWithNotifMessage("/farmer/crop", crop.notifError);

      return { success: true, cropList: crop.cropName };
    } catch (error) {
      if (isRedirectError(error)) throw error;

      const err = error as Error;
      console.log(
        `May pagkakamali sa pag kuha ng pangalan ng iyong taniman: ${err.message}`
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

export const getMyCropStatusDetail =
  async (): Promise<getMyCropStatusDetailReturnType> => {
    try {
      const { userId } = await ProtectedAction("read:crop");

      return {
        success: true,
        cropInfoStatus: await getMyCropStatusDetailQuery(userId),
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `May pagkakamali sa pag kuha ng impormasyon ng iyong pananim: ${err.message}`
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

export const getCropCountPerBrgy =
  async (): Promise<getCropCountPerBrgyReturnType> => {
    try {
      await ProtectedAction("read:farmer:crop");

      return { success: true, cropCount: await getCropCountPerBrgyQuery() };
    } catch (error) {
      const err = error as Error;
      console.log(
        `Unexpected error happen while getting the crop count per baranggay: ${err.message}`
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

export const getCropStatusCount =
  async (): Promise<getCropStatusCountReturnType> => {
    try {
      await ProtectedAction("read:farmer:crop");

      const crop = await getAllCropStatusAndPlantedDate();

      const cropStatusCount = crop.reduce(
        (
          acc: getCropStatusCountCropStatusAccType[],
          cur: getCropStatusCountQueryReturnType
        ): getCropStatusCountCropStatusAccType[] => {
          const cropStatus = determineCropStatus({
            cropStatus: cur.cropStatus,
            datePlanted: cur.datePlanted,
            dateHarvested: cur.dateHarvested,
            isEnglish: true,
          }).status;

          console.log(cropStatus);

          if (acc.some((val) => val.status === cropStatus))
            return acc.map((val) =>
              val.status === cropStatus
                ? { status: val.status, count: val.count + 1 }
                : { ...val }
            );

          return [...acc, { status: cropStatus, count: 1 }];
        },
        []
      );

      console.log(crop);

      console.log(cropStatusCount);

      return {
        success: true,
        cropStatusCount: cropStatusCount,
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `Unexpected error happen while getting the crop status count: ${err.message}`
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
