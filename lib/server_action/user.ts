"use server";

import {
  CheckMyMemberquery,
  GetAgriRole,
  GetFarmerRole,
  blockUnblockUser,
  deletUser,
  getAgriEmail,
  getAgriName,
  getCountNotVerifiedFarmer,
  getFarmerDataForResetingPass,
  getFarmerEmail,
  getFarmerIdByAuthId,
  getFarmerName,
  getPassword,
  getUserLocation,
  isAdminAgri,
  isAgriculturist,
  isFarmer,
  isFarmerLeader,
  isFarmerVerified,
  updatePassword,
} from "@/util/queries/user";
import { ProtectedAction } from "../protectedActions";
import {
  allUserRoleType,
  changeFarmerPassReturnType,
  changePasswordType,
  checkFarmerRoleReturnType,
  checkUserAlreadyLoginReturnType,
  getAgriculturistDashboardDataReturnType,
  getAllFarmerForResetPassReturnType,
  getFamerLeaderDashboardDataReturnType,
  getFarmerDashboardDataReturnType,
  getUserNameReturnType,
  newUserValNeedInfoReturnType,
  pathToRevalidateAfterAgriDeleteFarmer,
  reportSequenceAndUserLocReturnType,
  ServerActionFailBaseType,
  serverActionNormalReturnType,
  serverActionOptionalNotifMessage,
  SessionValueType,
  userWorkReturnType,
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
import {
  agriValidationForImportantAction,
  farmerLeaderValidationForImportantAction,
} from "./farmerUser";
import { revalidatePath } from "next/cache";
import { ComparePassword, Hash } from "../reusableFunctions";
import {
  missingFormValNotif,
  NotifToUriComponent,
} from "@/util/helper_function/reusableFunction";
import { ZodValidateForm } from "../validation/authValidation";
import { changePasswordSchema } from "@/util/helper_function/validation/validationSchema";
import { DeleteSession, GetSession, UpdateSessionRole } from "../session";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
/**
 * server action when the farmer leader want to delete a farmer account
 * @param farmerId id that you want to delete
 * @returns notifMessage that will be consumed by the notification provider
 */
export const DeleteMyOrgMember = async (
  farmerId: string
): Promise<serverActionNormalReturnType> => {
  try {
    const { userId, work } = await ProtectedAction(
      "delete:farmer:org:member:user"
    );

    const checkAuthorization = await farmerLeaderValidationForImportantAction(
      farmerId,
      userId
    );
    if (!checkAuthorization.success)
      return { success: false, notifMessage: checkAuthorization.notifError };

    if (!(await CheckMyMemberquery(farmerId, userId)))
      return {
        success: false,
        notifMessage: [
          {
            message: "Ang user na tatanggalin mo ay hindi mo kamiyembro!!!",
            type: "warning",
          },
        ],
      };

    await deletUser(farmerId, work);

    revalidatePath(`/farmerLeader/orgMember`);

    return {
      success: true,
      notifMessage: [
        {
          message: "Matagumpay na natanggal ang account ng farmer",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May hindi inaasahang pag kakamali habang tinatanggal ang farmer: ${err}`
    );
    return {
      success: false,
      notifMessage: [{ message: err.message, type: "error" }],
    };
  }
};

/**
 * server action when the agriculturist want to delete a farmer account
 * @param farmerId id that you want to delete
 * @returns notifMessage that will be consumed by the notification provider
 */
export const DeleteFarmerUser = async (
  farmerId: string,
  path: pathToRevalidateAfterAgriDeleteFarmer
): Promise<serverActionNormalReturnType> => {
  try {
    const { work } = await ProtectedAction("delete:farmer:user");

    const checkAuthorization = await agriValidationForImportantAction(farmerId);

    if (!checkAuthorization.success)
      return { success: false, notifMessage: checkAuthorization.notifError };

    await deletUser(farmerId, work);

    revalidatePath(path);

    return {
      success: true,
      notifMessage: [
        {
          message: "Successfully deleted the farmer account",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;

    console.log(`Unexpected error occured while deleting the farmer: ${err}`);

    return {
      success: false,
      notifMessage: [{ message: err.message, type: "error" }],
    };
  }
};

/**
 * server action for blocking the org member of the leader
 * @param farmerId id of the member
 * @returns
 */
export const blockMyOrgMember = async (
  farmerId: string
): Promise<serverActionNormalReturnType> => {
  try {
    const { userId, work } = await ProtectedAction(
      "update:farmer:org:member:user"
    );

    const checkAuthorization = await farmerLeaderValidationForImportantAction(
      farmerId,
      userId
    );
    if (!checkAuthorization.success)
      return { success: false, notifMessage: checkAuthorization.notifError };

    if (!(await CheckMyMemberquery(farmerId, userId)))
      return {
        success: false,
        notifMessage: [
          {
            message: "Ang user na ibo-block mo ay hindi mo kamiyembro!!!",
            type: "warning",
          },
        ],
      };

    await blockUnblockUser(farmerId, work, true);

    revalidatePath(`/farmerLeader/orgMember`);

    return {
      success: true,
      notifMessage: [
        {
          message: "Matagumpay ang pag b-block ng account ng farmer",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May hindi inaasahang pag kakamali habang bino-block ang farmer account: ${err}`
    );
    return {
      success: false,
      notifMessage: [{ message: err.message, type: "error" }],
    };
  }
};

/**
 * agriculturist action for blocking the user
 * @param farmerId id of the farmer to be block
 * @returns
 */
export const blockFarmerUser = async (
  farmerId: string
): Promise<serverActionNormalReturnType> => {
  try {
    const { work } = await ProtectedAction("update:farmer:user");

    const checkAuthorization = await agriValidationForImportantAction(farmerId);

    if (!checkAuthorization.success)
      return { success: false, notifMessage: checkAuthorization.notifError };

    await blockUnblockUser(farmerId, work, true);

    revalidatePath(`/agriculturist/farmerUsers`);

    console.log("blocking farmer by admin");

    return {
      success: true,
      notifMessage: [
        {
          message: "Successfully blocked the farmer account",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;

    console.log(`Unexpected error occured while blocking the farmer: ${err}`);

    return {
      success: false,
      notifMessage: [{ message: err.message, type: "error" }],
    };
  }
};

/**
 * server action for unblocking the org member of the leader
 * @param farmerId id of the member
 * @returns
 */
export const unblockMyOrgMember = async (
  farmerId: string
): Promise<serverActionNormalReturnType> => {
  try {
    const { userId, work } = await ProtectedAction(
      "update:farmer:org:member:user"
    );

    const checkAuthorization = await farmerLeaderValidationForImportantAction(
      farmerId,
      userId
    );
    if (!checkAuthorization.success)
      return { success: false, notifMessage: checkAuthorization.notifError };

    if (!(await CheckMyMemberquery(farmerId, userId)))
      return {
        success: false,
        notifMessage: [
          {
            message: "Ang user na iu-unblock mo ay hindi mo kamiyembro!!!",
            type: "warning",
          },
        ],
      };

    await blockUnblockUser(farmerId, work, false);

    revalidatePath(`/farmerLeader/orgMember`);

    return {
      success: true,
      notifMessage: [
        {
          message: "Matagumpay ang pag u-unblock ng account ng farmer",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May hindi inaasahang pag kakamali habang inu-unblock ang farmer account: ${err}`
    );
    return {
      success: false,
      notifMessage: [{ message: err.message, type: "error" }],
    };
  }
};

/**
 * agriculturist action for unblocking the user
 * @param farmerId id of the farmer to be block
 * @returns
 */
export const unblockFarmerUser = async (
  farmerId: string
): Promise<serverActionNormalReturnType> => {
  try {
    const { work } = await ProtectedAction("update:farmer:user");

    const checkAuthorization = await agriValidationForImportantAction(farmerId);

    if (!checkAuthorization.success)
      return { success: false, notifMessage: checkAuthorization.notifError };

    await blockUnblockUser(farmerId, work, false);

    revalidatePath(`/agriculturist/farmerUsers`);

    return {
      success: true,
      notifMessage: [
        {
          message: "Successfully blocked the farmer account",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;

    console.log(`Unexpected error occured while blocking the farmer: ${err}`);

    return {
      success: false,
      notifMessage: [{ message: err.message, type: "error" }],
    };
  }
};

/**
 * server action that checks if the new use already fill up the first part of the sign up
 */
export const newUserValNeedInfo =
  async (): Promise<newUserValNeedInfoReturnType> => {
    try {
      await ProtectedAction("create:user");

      return {
        success: true,
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

/**
 * server action for getting all the link value that will be used for password reset
 * @returns
 */
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

/**
 * WAS SEPERATED BECAUSE THE FARMER LEADER CAN ALSO USE THIS AUTHORIZATION
 *
 *  server action for validating the farmer user such us, role, validated acc, and if existing
 * @param farmerId
 * @param role
 * @returns
 */
const farmerAndFarmerLeaderAuthorization = async (
  farmerId: string,
  role: allUserRoleType
): Promise<serverActionOptionalNotifMessage> => {
  try {
    if (!["farmer", "leader"].includes(role))
      return {
        success: false,
        notifError: [
          {
            message: "Farmer lang ang pede maka access nito!!",
            type: "warning",
          },
        ],
      };

    if (!(await isFarmer(farmerId)))
      return {
        success: false,
        notifError: [
          {
            message: "Farmer lang ang pede maka access nito!!",
            type: "warning",
          },
        ],
      };

    if (!(await isFarmerVerified(farmerId)))
      return {
        success: false,
        notifError: [
          {
            message: "Hindi pa beripikado ang iyong account!!",
            type: "warning",
          },
        ],
      };

    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May Hindi inaasahang pag kakamali habang chinecheck and farmer: ${err.message}`
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
 * server action for farmer authorization
 * @returns
 */
export const farmerAuthorization =
  async (): Promise<serverActionOptionalNotifMessage> => {
    try {
      const { work, userId } = await ProtectedAction("authorization:farmer");

      const auth = await farmerAndFarmerLeaderAuthorization(userId, work);

      if (!auth.success) return { success: false, notifError: auth.notifError };

      return { success: true };
    } catch (error) {
      const err = error as Error;
      console.log(
        `May Hindi inaasahang pag kakamali habang chinecheck and farmer: ${err.message}`
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
 * server action for farmer leader authorization
 * @returns
 */
export const farmerLeaderAuthorization =
  async (): Promise<serverActionOptionalNotifMessage> => {
    try {
      const { work, userId } = await ProtectedAction(
        "authorization:farmer:leader"
      );

      const auth = await farmerAndFarmerLeaderAuthorization(userId, work);
      if (!auth.success) return { success: false, notifError: auth.notifError };

      if (await isFarmerLeader(userId))
        return {
          success: false,
          notifError: [
            {
              message: "Farmer leader lang ang pede maka access nito!!!",
              type: "warning",
            },
          ],
        };

      return { success: true };
    } catch (error) {
      const err = error as Error;
      console.log(
        `May Hindi inaasahang pag kakamali habang chinecheck and farmer: ${err.message}`
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
 * server action for agriculturist authorization
 * @returns
 */
export const agriculturistAuthorization =
  async (): Promise<serverActionOptionalNotifMessage> => {
    try {
      const { work, userId } = await ProtectedAction("authorization:agri");

      if (!["admin", "agriculturist"].includes(work))
        return {
          success: false,
          notifError: [
            {
              message: "Only agriculturist can access this!!",
              type: "warning",
            },
          ],
        };

      if (!(await isAgriculturist(userId)))
        return {
          success: false,
          notifError: [
            {
              message: "Only agriculturist can access this!!",
              type: "warning",
            },
          ],
        };

      return { success: true };
    } catch (error) {
      const err = error as Error;
      console.log(
        `Error occured while checking if the user is authorized: ${err.message}`
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

export const adminAgriAuthorization =
  async (): Promise<serverActionOptionalNotifMessage> => {
    try {
      const { userId } = await ProtectedAction("authorization:agri:admin");

      if (!(await isAdminAgri(userId)))
        return {
          success: false,
          notifError: [
            {
              message: "Only admin user can access this page",
              type: "warning",
            },
          ],
        };

      return { success: true };
    } catch (error) {
      const err = error as Error;
      console.log(
        `Error occured while checking if the user is authorized: ${err.message}`
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

export const changeFarmerPass = async ({
  currentPass,
  newPass,
  confirmNewPass,
}: changePasswordType): Promise<changeFarmerPassReturnType> => {
  try {
    const { userId, work } = await ProtectedAction("update:user");

    if (work !== "farmer" && work !== "leader")
      return {
        success: false,
        notifMessage: [
          {
            message: "Only farmer can change their password",
            type: "warning",
          },
        ],
      };

    const { valid, formError } = ZodValidateForm(
      { currentPass, newPass, confirmNewPass },
      changePasswordSchema
    );
    if (!valid)
      return { success: false, formError, notifMessage: missingFormValNotif() };

    // the password that pass and the password that is in the db is not matching
    if (
      !(await ComparePassword(
        currentPass,
        (
          await getPassword(userId)
        ).password
      ))
    )
      return {
        success: false,
        formError: { currentPass: ["Mali ang nailagay mong password"] },
        notifMessage: missingFormValNotif(),
      };

    await updatePassword(userId, await Hash(newPass));

    return {
      success: true,
      notifMessage: [
        {
          message: "Matagumpay na nabago ang iyong password!!!",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `Error occured while checking if the user is authorized: ${err.message}`
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

export const farmerLogout = async (): Promise<ServerActionFailBaseType> => {
  try {
    await DeleteSession();

    redirect(
      `/?notif=${NotifToUriComponent([
        { message: "Matagumpay ang iyong pag lologout", type: "success" },
      ])}`
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;

    console.log(`Error occured while logging out: ${err.message}`);

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

export const agriLogout =
  async (): Promise<serverActionOptionalNotifMessage> => {
    try {
      await DeleteSession();

      return { success: true };
    } catch (error) {
      const err = error as Error;

      console.log(`Error occured while logging out: ${err.message}`);

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

export const userWork = async (): Promise<userWorkReturnType> => {
  try {
    const { work } = await ProtectedAction("all:user:action");

    return { success: true, work };
  } catch (error) {
    const err = error as Error;

    console.log(`Error occured while logging out: ${err.message}`);

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

export const checkUserAlreadyLogin =
  async (): Promise<checkUserAlreadyLoginReturnType> => {
    try {
      let session: SessionValueType | null = null;

      try {
        session = await GetSession();
      } catch (error) {
        console.error((error as Error).message);

        return { success: true, hasSession: false };
      }

      if (!session) return { success: true, hasSession: false };

      if (session.work === "admin" || session.work === "agriculturist")
        redirect("/agriAuth/fallback");

      const farmerId = await getFarmerIdByAuthId(session.userId);

      // this means the user already sign up but didnt insert its personal information(no farmerId was crerated) so the user will be redirected in the farmerDetails instead to finish that
      if (!farmerId) {
        await UpdateSessionRole("newUser");

        redirect("/farmerDetails");
      }

      redirect(
        `/farmer/?notif=${NotifToUriComponent([
          { message: "Matagumpay ang iyong pag lologin", type: "success" },
        ])}`
      );
    } catch (error) {
      if (isRedirectError(error)) throw error;

      const err = error as Error;

      console.log(`Error occured while logging out: ${err.message}`);

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

export const getUserName = async (): Promise<getUserNameReturnType> => {
  try {
    const { userId, work } = await ProtectedAction("read:user");

    if (work === "leader" || work === "farmer") {
      const [{ farmerFirstName, farmerLastName }, { orgRole }, email] =
        await Promise.all([
          getFarmerName(userId),
          GetFarmerRole(userId),
          getFarmerEmail(userId),
        ]);

      return {
        success: true,
        username: `${farmerFirstName} ${farmerLastName}`,
        role: orgRole,
        email,
      };
    }

    const [agriName, { agriRole }, email] = await Promise.all([
      getAgriName(userId),
      GetAgriRole(userId),
      getAgriEmail(userId),
    ]);

    return {
      success: true,
      username: agriName,
      role: agriRole,
      email,
    };
  } catch (error) {
    const err = error as Error;

    console.log(`Error occured in the header: ${err.message}`);

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
