"use server";

import {
  ApprovedOrgFarmerAccQuery,
  CheckMyMemberquery,
  farmerIsExist,
  GetFarmerOrgMemberQuery,
  GetFarmerProfileCropInfoQuery,
  GetFarmerProfileOrgInfoQuery,
  GetFarmerProfilePersonalInfoQuery,
  UpdateUserProfileInfoQuery,
  ViewAllUnvalidatedFarmerQuery,
  ViewAllVerifiedFarmerUserQuery,
} from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import {
  GetFarmerOrgMemberReturnType,
  GetFarmerProfilePersonalInfoQueryReturnType,
  GetFarmerUserProfileInfoReturnType,
  GetMyProfileInfoReturnType,
  NotificationBaseType,
  SuccessGetMyProfileInfoReturnType,
  UpdateUserProfileInfoReturnType,
  ViewAllUnvalidatedFarmerReturnType,
  ViewAllValidatedFarmerUserReturnType,
} from "@/types";
import { GetSession } from "../session";
import { farmerFirstDetailFormSchema } from "@/util/helper_function/validation/validationSchema";
import { ZodValidateForm } from "../validation/authValidation";
import { headers } from "next/headers";

/**
 * fetch the farmer member within the organization to gether with its information
 * @returns success object that if a falsey value will return with a notifError that can be consumed by notification context, but if a truthy value it will come with farmerMember object that contains the farmer member information
 */
export const GetFarmerOrgMember =
  async (): Promise<GetFarmerOrgMemberReturnType> => {
    try {
      const farmerId = await ProtectedAction("read:all:farmer:org:member:user");

      return {
        success: true,
        farmerMember: await GetFarmerOrgMemberQuery(farmerId),
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `Nagka problema sa pagkuha ng detalye sa mga miyembro mo: ${err}`
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

/**
 * verifying the farmer account by updating its info in the db
 * @param farmerId id of the farmer you want to update
 * @returns a notifMessage object that can be consumed by the notif context, if the update was successful it will comes woth the refresh object
 */
export const ApprovedOrgFarmerAcc = async (
  farmerId: string
): Promise<{ notifMessage: NotificationBaseType[]; refresh?: boolean }> => {
  try {
    await ProtectedAction("update:farmer:org:member:user");

    await ApprovedOrgFarmerAccQuery(farmerId);

    return {
      refresh: true,
      notifMessage: [
        { message: `Matagumpay ang iyong pag aapruba!!!`, type: "success" },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Nagka problema sa pag aapruba ng account ${err}`);
    return {
      notifMessage: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }
};

/**
 * server action for VIEWING(with security applied) farmer profile picture
 * @param farmerId id of the farmer you want to view
 * @returns farmer user profile info
 */
export const GetViewingFarmerUserProfileInfo = async (
  farmerId: string
): Promise<GetFarmerUserProfileInfoReturnType> => {
  try {
    const session = await GetSession();

    if (session?.work === "leader") {
      await ProtectedAction("read:farmer:org:member:user");
      const myMember = await CheckMyMemberquery(farmerId, session.userId);

      if (!myMember) return { success: false, isMember: false };
    } else await ProtectedAction("read:farmer:user");

    if (!(await farmerIsExist(farmerId)))
      return { success: false, isExist: false };

    return await userFarmerProfileInfo(farmerId);
  } catch (error) {
    const err = error as Error;
    console.log(
      `Nagka problema sa pag kuha ng impormasyon ng mag sasaka ${err}`
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

/**
 * server action for GETTING the user information of the current user
 * @returns user profile info
 */
export const GetMyProfileInfo =
  async (): Promise<GetMyProfileInfoReturnType> => {
    try {
      await ProtectedAction("read:user");

      const session = await GetSession();

      if (session) return await userFarmerProfileInfo(session.userId);
      else
        throw new Error("Nag expire na ang iyong pag lologin, mag log in ulit");
    } catch (error) {
      const err = error as Error;
      console.log(
        `Nagka problema sa pag kuha ng impormasyon ng mag sasaka ${err}`
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

const userFarmerProfileInfo = async (
  userId: string
): Promise<SuccessGetMyProfileInfoReturnType> => {
  const [farmerInfo, cropInfo, orgInfo] = await Promise.all([
    GetFarmerProfilePersonalInfoQuery(userId),
    GetFarmerProfileCropInfoQuery(userId),
    GetFarmerProfileOrgInfoQuery(userId),
  ]);

  return {
    success: true,
    farmerInfo: farmerInfo,
    cropInfo: cropInfo,
    orgInfo: orgInfo,
  };
};

/**
 * updates the user profile
 * @returns if the updates is a success or not together with a notifMessage that can be consumed by the notification context
 * if the value that was pass is invalid(by zod) it will throw additional formError object that contains all the error
 */
export const UpdateUserProfileInfo = async (
  userProfileInfo: GetFarmerProfilePersonalInfoQueryReturnType
): Promise<UpdateUserProfileInfoReturnType> => {
  try {
    const userId = await ProtectedAction("update:user");

    const headersList: Headers = await headers();
    const referer = headersList.get("referer") || "";
    const routeUserId = referer.match(/\/profile\/([^\/?\#]+)/)?.[1];

    console.log("header");
    console.log(headersList);
    console.log("referer");
    console.log(referer);
    console.log("userId");
    console.log(routeUserId);

    // const validateVal = ZodValidateForm(
    //   userProfileInfo,
    //   farmerFirstDetailFormSchema
    // );
    // if (!validateVal.valid)
    //   return {
    //     success: false,
    //     formError: validateVal.formError,
    //     notifMessage: [
    //       {
    //         message: "May mga mali sa iyong binago, itama muna ito",
    //         type: "warning",
    //       },
    //     ],
    //   };

    // await UpdateUserProfileInfoQuery(userId, userProfileInfo);

    return {
      success: true,
      notifMessage: [
        {
          message: "Matagumpay ang pag babago mo ng iyong impormasyon",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Nagka problema sa pag uupdate ng profile mo: ${err}`);
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

/**
 * server action for getting all the validated farmer user
 * @returns list of validated user
 */
export const ViewAllValidatedFarmerUser =
  async (): Promise<ViewAllValidatedFarmerUserReturnType> => {
    try {
      await ProtectedAction("read:farmer:user");

      return {
        success: true,
        validatedFarmer: await ViewAllVerifiedFarmerUserQuery(),
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `Nagka problema sa pag kuha ng mga farmer na validated: ${err}`
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

export const ViewAllUnvalidatedFarmer =
  async (): Promise<ViewAllUnvalidatedFarmerReturnType> => {
    try {
      await ProtectedAction("read:farmer:user");

      return {
        success: true,
        notValidatedFarmer: await ViewAllUnvalidatedFarmerQuery(),
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `Nagka problema sa pag kuha ng mga farmer na hindi pa validated: ${err}`
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
