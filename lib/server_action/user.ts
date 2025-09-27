"use server";

import {
  CheckMyMemberquery,
  DelteUserAccountQuery,
  farmerIsExist,
} from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import { GetSession } from "../session";
import { newUserValNeedInfoReturnType, NotificationBaseType } from "@/types";
import { GetAvailableOrgQuery } from "@/util/queries/org";

/**
 * server action for deleting a user account
 * @param farmerId id that you want to delete
 * @returns notifMessage that will be consumed by the notification provider
 */
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

/**
 *
 * @param dynamicPath base path of the dynamic route where you will use this
 * @param dynamicVal value of the dynamic page you want to check
 * @returns boolean
 */
// export const isDynamicValueExist = async (
//   dynamicPath: "agriculturist/organizations" | "farmer/farmerUser",
//   dynamicVal: string
// ): Promise<boolean> => {
//   try {
//     if (dynamicPath === "agriculturist/organizations")
//       return organizationIsExist(dynamicVal);
//     else if (dynamicPath === "farmer/farmerUser")
//       return farmerIsExist(dynamicVal);

//     return false;
//   } catch (error) {
//     console.log((error as Error).message);
//     return false;
//   }
// };

export const newUserValNeedInfo =
  async (): Promise<newUserValNeedInfoReturnType> => {
    try {
      const userId = await ProtectedAction("create:user");

      if (await farmerIsExist(userId))
        return {
          success: true,
          isExist: true,
          orgList: await GetAvailableOrgQuery(),
        };

      return {
        success: true,
        isExist: false,
        orgList: await GetAvailableOrgQuery(),
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `May Hindi inaasahang pag kakamali habang kinukuha ang mga organisasyon: ${err.message}`
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
