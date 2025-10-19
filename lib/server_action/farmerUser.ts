"use server";

import {
  ApprovedOrgMemberAccQuery,
  CheckMyMemberquery,
  farmerIsExist,
  GetFarmerOrgMemberQuery,
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
  serverActionNormalReturnType,
  serverActionOptionalNotifMessage,
  SuccessGetMyProfileInfoReturnType,
  UpdateUserProfileInfoReturnType,
  ViewAllUnvalidatedFarmerReturnType,
  ViewAllValidatedFarmerUserReturnType,
} from "@/types";
import { GetSession } from "../session";
import { userProfileInfoUpdateSchema } from "@/util/helper_function/validation/validationSchema";
import { ZodValidateForm } from "../validation/authValidation";
import { getFarmerCropNameQuery } from "@/util/queries/crop";
import { revalidatePath } from "next/cache";
import { agriculturistAuthorization, farmerLeaderAuthorization } from "./user";
import { NotAMemberErrorMessage } from "@/util/helper_function/reusableFunction";

/**
 * fetch the farmer member within the organization to gether with its information
 * @returns success object that if a falsey value will return with a notifError that can be consumed by notification context, but if a truthy value it will come with farmerMember object that contains the farmer member information
 */
export const GetFarmerOrgMember =
  async (): Promise<GetFarmerOrgMemberReturnType> => {
    try {
      const farmerId = (
        await ProtectedAction("read:all:farmer:org:member:user")
      ).userId;

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
 * server action for validating the farmer leader when the farmer leader do some important action such as deleting a user or validating a farmer
 * @param farmerId id of the farmer that was targeted by the important action
 * @param leaderId id of the leader
 * @returns
 */
export const farmerLeaderValidationForImportantAction = async (
  farmerId: string,
  leaderId: string
): Promise<serverActionOptionalNotifMessage> => {
  try {
    if (!(await farmerIsExist(farmerId)))
      return {
        success: false,
        notifError: [
          { message: "Hindi nag eexist ang account", type: "warning" },
        ],
      };

    const leadAuth = await farmerLeaderAuthorization();
    if (!leadAuth.success)
      return { success: false, notifError: leadAuth.notifError };

    if (!(await CheckMyMemberquery(farmerId, leaderId)))
      return {
        success: false,
        notifError: [{ message: NotAMemberErrorMessage(), type: "warning" }],
      };

    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.log(`Nagka problema habang chine-check and leader ${err}`);
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
export const ApprovedOrgMemberAcc = async (
  farmerId: string
): Promise<serverActionNormalReturnType> => {
  try {
    const { userId } = await ProtectedAction("update:farmer:org:member:user");

    const checkAuthorization = await farmerLeaderValidationForImportantAction(
      farmerId,
      userId
    );
    if (!checkAuthorization.success)
      return { success: false, notifMessage: checkAuthorization.notifError };

    await ApprovedOrgMemberAccQuery(farmerId);

    revalidatePath(`/farmerLeader/orgMember`);

    return {
      success: true,
      notifMessage: [
        { message: `Matagumpay ang iyong pag aapruba!!!`, type: "success" },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Nagka problema sa pag aapruba ng account ${err}`);
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
 * server action for validating the agriculturist/admin when the agriculturist/admin do some important action such as deleting a user or validating a farmer
 * @param farmerId id of the farmer that was targeted by the important action
 * @param leaderId id of the leader
 * @returns
 */
export const agriValidationForImportantAction = async (
  farmerId: string
): Promise<serverActionOptionalNotifMessage> => {
  try {
    if (!(await farmerIsExist(farmerId)))
      return {
        success: false,
        notifError: [
          { message: "Hindi nag eexist ang account", type: "warning" },
        ],
      };

    const agriAuth = await agriculturistAuthorization();
    if (!agriAuth.success)
      return { success: false, notifError: agriAuth.notifError };

    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.log(`Nagka problema habang chine-check and leader ${err}`);
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
export const ApprovedFarmerAcc = async (
  farmerId: string
): Promise<serverActionNormalReturnType> => {
  try {
    await ProtectedAction("update:farmer:user");

    const checkAuthorization = await agriValidationForImportantAction(farmerId);
    if (!checkAuthorization.success)
      return { success: false, notifMessage: checkAuthorization.notifError };

    await ApprovedOrgMemberAccQuery(farmerId);

    revalidatePath(`/agriculturist/validateFarmer`);

    return {
      success: true,
      notifMessage: [
        { message: `Matagumpay ang iyong pag aapruba!!!`, type: "success" },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Nagka problema sa pag aapruba ng account ${err}`);
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
 * server action for VIEWING(with security applied) farmer profile picture
 * @param farmerId id of the farmer you want to view
 * @returns farmer user profile info
 */
export const GetViewingFarmerUserProfileInfo = async (
  farmerId: string
): Promise<GetFarmerUserProfileInfoReturnType> => {
  try {
    const { work, userId } = await ProtectedAction("read:farmer:profile");

    if (!(await farmerIsExist(farmerId)))
      return { success: false, isExist: false };

    if (work === "leader") {
      const leadAuth = await checkFarmerLeader(farmerId, userId);
      if (!leadAuth.success)
        return {
          success: false,
          isNotValid: true,
          notifError: leadAuth.notifError,
        };
    } else {
      const agriAuth = await checkAgri();

      if (!agriAuth.success)
        return {
          success: false,
          isNotValid: true,
          notifError: agriAuth.notifError,
        };
    }

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

const checkFarmerLeader = async (
  farmerId: string,
  farmerLeadId: string
): Promise<serverActionOptionalNotifMessage> => {
  try {
    const auth = await farmerLeaderAuthorization();
    if (!auth.success) return { success: false, notifError: auth.notifError };

    const myMember = await CheckMyMemberquery(farmerId, farmerLeadId);
    if (!myMember)
      return {
        success: false,
        notifError: [
          { message: "Hindi mo kagrupo and user na ito", type: "warning" },
        ],
      };

    return { success: true };
  } catch (error) {
    const err = error as Error;

    console.log(`Problem occured in viewing the farmer user profile ${err}`);
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

const checkAgri = async (): Promise<serverActionOptionalNotifMessage> => {
  try {
    const auth = await agriculturistAuthorization();
    if (!auth.success) return { success: false, notifError: auth.notifError };

    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.log(
      `Error occured while checking if the user is authorized: ${err}`
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
    getFarmerCropNameQuery(userId),
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
    const userId = (await ProtectedAction("update:user")).userId;

    const validateVal = ZodValidateForm(
      userProfileInfo,
      userProfileInfoUpdateSchema
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

    await UpdateUserProfileInfoQuery(userId, userProfileInfo);

    revalidatePath(`/farmer/profile`);

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
