"use server";

import {
  CheckMyMemberquery,
  DelteUserAccountQuery,
  farmerIsExist,
  getCountNotVerifiedFarmer,
  getUserLocation,
} from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import { GetSession } from "../session";
import {
  checkFarmerRoleReturnType,
  getFarmerDashboardDataReturnType,
  getFarmerLeadDashboardDataReturnType,
  newUserValNeedInfoReturnType,
  NotificationBaseType,
} from "@/types";
import { GetAvailableOrgQuery } from "@/util/queries/org";
import {
  getCountMadeReportToday,
  getCountPendingReport,
  getCountFarmerMemReportToday,
  getCountUnvalidatedReport,
  getRecentReport,
  getCountTotalReportMade,
} from "@/util/queries/report";
import { reportPerDayWeekAndMonth } from "./report";

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

/**
 * server action that checks if the new use already fill up the first part of the sign up
 */
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

/**
 * server action that checks the role of the farmerUser (e.g. "farmer" / "leader")
 * @returns role of the farmer
 */
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

/**
 * sersver action for geting the data for the dashboard base on the user role
 * @returns
 */
export const getFarmerDashboardData =
  async (): Promise<getFarmerDashboardDataReturnType> => {
    try {
      const { userId, work } = await ProtectedAction("read:user");

      const [reportSequence, userLocation] = await Promise.all([
        reportPerDayWeekAndMonth(userId, work),
        getUserLocation(userId),
      ]);

      if (!reportSequence.success)
        return { success: false, notifError: reportSequence.notifError };

      // if a farmer leader, it will return this instead
      if (work === "leader") {
        const [
          countFarmerMemReportToday,
          countUnvalidatedReport,
          countNotVerifiedFarmer,
          recentReport,
        ] = await Promise.all([
          getCountFarmerMemReportToday(userId),
          getCountUnvalidatedReport(userId),
          getCountNotVerifiedFarmer(userId),
          getRecentReport(userId),
        ]);

        return {
          success: true,
          work,
          cardValue: {
            orgMemberTotalReportToday: countFarmerMemReportToday,
            totalUnvalidatedReport: countUnvalidatedReport,
            totalUnverfiedUser: countNotVerifiedFarmer,
          },
          lineChartValue: {
            week: reportSequence.reportCountThisWeek,
            month: reportSequence.reportCountThisAndPrevMonth,
            year: reportSequence.reportCountThisYear,
          },
          recentReport: recentReport,
          userLocation: userLocation,
        };
      }

      const [countMadeReportToday, countTotalReportMade, countPendingReport] =
        await Promise.all([
          getCountMadeReportToday(userId),
          getCountTotalReportMade(userId),
          getCountPendingReport(userId),
        ]);

      return {
        success: true,
        work,
        cardValue: {
          countMadeReportToday: countMadeReportToday,
          countTotalReportMade: countTotalReportMade,
          countPendingReport: countPendingReport,
        },
        lineChartValue: {
          week: reportSequence.reportCountThisWeek,
          month: reportSequence.reportCountThisAndPrevMonth,
          year: reportSequence.reportCountThisYear,
        },
        userLocation: userLocation,
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `May Hindi inaasahang pag kakamali habang kinukuha ang impormasyon: ${err.message}`
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
