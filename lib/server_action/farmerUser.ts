"use server";

import {
  ApprovedOrgFarmerAccQuery,
  CheckMyMemberquery,
  GetFarmerOrgMemberQuery,
  GetFarmerUserProfileInfoQuery,
} from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import {
  GetFarmerOrgMemberReturnType,
  GetFarmerUserProfileInfoReturnType,
  NotificationBaseType,
} from "@/types";
import { GetSession } from "../session";

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

export const GetFarmerUserProfileInfo = async (
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
