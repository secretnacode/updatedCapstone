"use server";

import {
  CheckMyMemberquery,
  DelteUserAccountQuery,
  farmerIsExist,
} from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import { GetSession } from "../session";
import {
  checkFarmerRoleReturnType,
  newUserValNeedInfoReturnType,
  NotificationBaseType,
} from "@/types";
import { GetAvailableOrgQuery } from "@/util/queries/org";
import {
  getCountMadeReportToday,
  getCountReportToday,
  getCountUnvalidatedReport,
} from "@/util/queries/report";

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
      const userId = (await ProtectedAction("create:user")).userId;

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

export const checkFarmerRole = async (): Promise<checkFarmerRoleReturnType> => {
  try {
    const work = (await ProtectedAction("read:user")).work;

    return { success: true, role: work };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May Hindi inaasahang pag kakamali habang chinecheck and farmer user: ${err.message}`
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

export const getFarmerLeadDashboardData = async () => {
  try {
    const userId = (await ProtectedAction("read:all:farmer:org:member:user"))
      .userId;

    const [countReportToday, countUnvalidatedReport, countMadeReportToday] =
      await Promise.all([
        getCountReportToday(userId),
        getCountUnvalidatedReport(userId),
        getCountMadeReportToday(userId),
      ]);

    // console.log(await )

    return {
      success: true,
      cardValue: {
        orgMemberTotalReportToday: countReportToday,
        totalUnvalidatedReport: countUnvalidatedReport,
        totalReportMake: countMadeReportToday,
      },
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May Hindi inaasahang pag kakamali habang kinukuha ang impormasyon para sa farmer leader: ${err.message}`
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
