"use server";

import {
  ApprovedOrgFarmerAccQuery,
  CheckMyMemberquery,
  GetFarmerOrgMemberQuery,
  GetFarmerUserProfileInfoQuery,
  UpdateUserProfileInfoQuery,
} from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import {
  FarmerPersonalInfoType,
  GetFarmerOrgMemberReturnType,
  GetFarmerUserProfileInfoReturnType,
  GetMyProfileInfoType,
  NotificationBaseType,
  UpdateUserProfileInfoType,
} from "@/types";
import { GetSession } from "../session";
import { ZodValidateForm } from "../validation/authValidation";
import { farmerFirstDetailFormSchema } from "@/util/helper_function/validation/validationSchema";

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

      if (!myMember) return { success: false, notMember: true };
    } else await ProtectedAction("read:farmer:user");

    return {
      success: true,
      farmerUserInfo: await GetFarmerUserProfileInfoQuery(farmerId),
    };
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
export const GetMyProfileInfo = async (): Promise<GetMyProfileInfoType> => {
  try {
    await ProtectedAction("read:user");

    const session = await GetSession();

    if (session)
      return {
        success: true,
        farmerInfo: await GetFarmerUserProfileInfoQuery(session.userId),
      };
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

/**
 * updates the user
 * @returns
 */
export const UpdateUserProfileInfo = async (
  newUserProfileInfo: FarmerPersonalInfoType
): Promise<UpdateUserProfileInfoType> => {
  try {
    await ProtectedAction("update:user");
    console.log(newUserProfileInfo);

    const validateVal = ZodValidateForm(
      newUserProfileInfo,
      farmerFirstDetailFormSchema
    );
    if (!validateVal.valid)
      return {
        success: false,
        formError: validateVal.formError,
        notifMessage: [
          {
            message: "May mga mali sa iyong binago, itama muna ito",
            type: "warning",
          },
        ],
      };

    const session = await GetSession();

    if (session) {
      await UpdateUserProfileInfoQuery(session.userId, newUserProfileInfo);
      return {
        success: true,
        notifMessage: [
          {
            message: "Matagumpay ang pag babago mo ng iyong impormasyon",
            type: "success",
          },
        ],
      };
    } else
      throw new Error("Nag expire na ang iyong pag lologin, mag log in ulit");
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
