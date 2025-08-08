"use server";

import {
  ApprovedOrgFarmerAccQuery,
  GetFarmerOrgMemberQuery,
} from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import { GetFarmerOrgMemberReturnType, NotificationBaseType } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
            message: `Nagka problema sa pagkuha ng detalye sa mga miyembro mo: ${err}`,
            type: "error",
          },
        ],
      };
    }
  };

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
    if (isRedirectError(error)) throw error;

    const err = error as Error;
    console.log(`Nagka problema sa pag aapruba ng account ${err}`);
    return {
      notifMessage: [
        {
          message: `Nagka problema sa pag aapruba ng account ${err}`,
          type: "error",
        },
      ],
    };
  }
};
