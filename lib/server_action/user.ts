"use server";

import {
  CheckMyMemberquery,
  DelteUserAccountQuery,
  farmerIsExist,
  getCountNotVerifiedFarmer,
  getFarmerDataForResetingPass,
  getUserLocation,
} from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import { GetSession } from "../session";
import {
  allUserRoleType,
  checkFarmerRoleReturnType,
  getAgriculturistDashboardDataReturnType,
  getAllFarmerForResetPassReturnType,
  getFamerLeaderDashboardDataReturnType,
  getFarmerDashboardDataReturnType,
  newUserValNeedInfoReturnType,
  NotificationBaseType,
  reportSequenceAndUserLocReturnType,
} from "@/types";
import { GetAvailableOrgQuery } from "@/util/queries/org";
import {
  getCountMadeReportToday,
  getCountPendingReport,
  getCountFarmerMemReportToday,
  getCountUnvalidatedReport,
  getRecentReport,
  getCountTotalReportMade,
  getTotalFarmerReport,
  getTotalNewFarmerReportToday,
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
 * server action for ONLY getting the farmer loc and report sequence that will be use for the line chart,
 * was seperated because farmer and leader uses this query
 * @param userId id of the current user
 * @param work (e.g. leader / farmer)
 * @returns
 */
const reportSequenceAndUserLoc = async (
  userId: string,
  work: allUserRoleType
): Promise<reportSequenceAndUserLocReturnType> => {
  try {
    const [reportSequence, userLocation] = await Promise.all([
      reportPerDayWeekAndMonth(userId, work),
      getUserLocation(userId),
    ]);

    if (!reportSequence.success)
      return { success: false, notifError: reportSequence.notifError };

    return {
      success: true,
      reportSequence: {
        week: reportSequence.reportCountThisWeek,
        month: reportSequence.reportCountThisAndPrevMonth,
        year: reportSequence.reportCountThisYear,
      },
      userLocation,
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May Hindi inaasahang pag kakamali habang kinukuha ang impormasyon ng mga ulat: ${err.message}`
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
 * server action for getting the farmer lead dashboard data
 * @returns
 */
export const getFamerLeaderDashboardData =
  async (): Promise<getFamerLeaderDashboardDataReturnType> => {
    try {
      const { userId, work } = await ProtectedAction(
        "read:farmer:member:report"
      );

      const [
        countFarmerMemReportToday,
        countUnvalidatedReport,
        countNotVerifiedFarmer,
        recentReport,
        reportAndLoc,
      ] = await Promise.all([
        getCountFarmerMemReportToday(userId),
        getCountUnvalidatedReport(userId),
        getCountNotVerifiedFarmer({ userRole: "leader", leaderId: userId }),
        getRecentReport({ userRole: "leader", leaderId: userId }),
        reportSequenceAndUserLoc(userId, work),
      ]);

      if (!reportAndLoc.success)
        return { success: false, notifError: reportAndLoc.notifError };

      return {
        success: true,
        cardValue: {
          orgMemberTotalReportToday: countFarmerMemReportToday,
          totalUnvalidatedReport: countUnvalidatedReport,
          totalUnverfiedUser: countNotVerifiedFarmer,
        },
        recentReport: recentReport,
        reportSequence: reportAndLoc.reportSequence,
        userLocation: reportAndLoc.userLocation,
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `May Hindi inaasahang pag kakamali habang kinukuha ang impormasyon ng mga ulat: ${err.message}`
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
 * server action for getting the farmer dashboard data
 * @returns
 */
export const getFarmerDashboardData =
  async (): Promise<getFarmerDashboardDataReturnType> => {
    try {
      const { userId, work } = await ProtectedAction("read:report");

      const [
        countMadeReportToday,
        countTotalReportMade,
        countPendingReport,
        reportAndLoc,
      ] = await Promise.all([
        getCountMadeReportToday(userId),
        getCountTotalReportMade(userId),
        getCountPendingReport(userId),
        reportSequenceAndUserLoc(userId, work),
      ]);

      if (!reportAndLoc.success)
        return { success: false, notifError: reportAndLoc.notifError };

      return {
        success: true,
        cardValue: {
          countMadeReportToday: countMadeReportToday,
          countTotalReportMade: countTotalReportMade,
          countPendingReport: countPendingReport,
        },
        reportSequence: reportAndLoc.reportSequence,
        userLocation: reportAndLoc.userLocation,
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `May Hindi inaasahang pag kakamali habang kinukuha ang impormasyon ng iyong mga ulat: ${err.message}`
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
 * server action for getting all the necesarr data for the dashboard of agriculturist
 * @returns
 */
export const getAgriculturistDashboardData =
  async (): Promise<getAgriculturistDashboardDataReturnType> => {
    try {
      ProtectedAction("read:farmer:report");

      const [
        totalFarmerReport,
        toalNewFarmerReportToday,
        totalNotVerifiedFarmer,
        sequenceReport,
        recentReport,
      ] = await Promise.all([
        getTotalFarmerReport(),
        getTotalNewFarmerReportToday(),
        getCountNotVerifiedFarmer({ userRole: "agriculturist" }),
        reportPerDayWeekAndMonth("", "agriculturist"),
        getRecentReport({ userRole: "agriculturist" }),
      ]);

      if (!sequenceReport.success)
        return { success: false, notifError: sequenceReport.notifError };

      return {
        success: true,
        cardValue: {
          totalFarmerReport,
          toalNewFarmerReportToday,
          totalNotVerifiedFarmer,
        },
        reportSequence: {
          week: sequenceReport.reportCountThisWeek,
          month: sequenceReport.reportCountThisAndPrevMonth,
          year: sequenceReport.reportCountThisYear,
        },
        recentReport,
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

export const getAllFarmerForResetPass =
  async (): Promise<getAllFarmerForResetPassReturnType> => {
    try {
      await ProtectedAction("read:farmer:user");

      return {
        success: true,
        farmerData: await getFarmerDataForResetingPass(),
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `Error occured while fetching all the farmer's data for resetting password: ${err.message}`
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
