"use server";

import { CheckMyMemberquery, DelteUserAccountQuery } from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import { GetSession } from "../session";
import { NotificationBaseType } from "@/types";
import { organizationIsExist } from "@/util/queries/org";

export const DelteUserAccount = async (
  farmerId: string
): Promise<{ notifMessage: NotificationBaseType[] }> => {
  try {
    const session = await GetSession();

    if (session) {
      if (session.work === "leader") {
        await ProtectedAction("delete:farmer:org:member:user");

        if (!(await CheckMyMemberquery(farmerId, session.userId)))
          return {
            notifMessage: [
              {
                message: "Ang user na tatanggalin mo ay hindi mo kamiyembro!!!",
                type: "warning",
              },
            ],
          };
      } else await ProtectedAction("delete:farmer:user");
    }

    await DelteUserAccountQuery(farmerId);

    return {
      notifMessage: [
        {
          message: "Matagumpay na natanggal ang account ng farmer",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Error in getting the farmer reports: ${err}`);
    return {
      notifMessage: [{ message: err.message, type: "error" }],
    };
  }
};

export const CheckDynamicVal = (
  dynamicPath: "agriculturist/organizations",
  dynamicVal: string
) => {
  try {
    if (dynamicPath === "agriculturist/organizations")
      return organizationIsExist(dynamicVal);
  } catch (error) {
    const err = error as Error;
    console.log(`Error in getting the farmer reports: ${err}`);
    return {
      notifMessage: [{ message: err.message, type: "error" }],
    };
  }
};
