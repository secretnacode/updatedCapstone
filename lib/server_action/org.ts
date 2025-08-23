"use server";

import {
  AvailableOrgReturnType,
  OrgInfoType,
  UpdateUserProfileOrgReturnType,
} from "@/types";
import {
  CreateNewOrg,
  GetAvailableOrgQuery,
  UpdateUserOrg,
} from "@/util/queries/org";
import { ProtectedAction } from "../protectedActions";
import { ZodValidateForm } from "../validation/authValidation";
import { userProfileOrgUpdateSchema } from "@/util/helper_function/validation/validationSchema";
import { revalidatePath } from "next/cache";

/**
 * gets all the available organizations with their orgId and orgName
 * @returns a {success: boolean} object with data if successful or errors
 * if not errors object that will be consumed by the notification context
 */
export const AvailableOrg = async (): Promise<AvailableOrgReturnType> => {
  try {
    await ProtectedAction("read:org");

    return {
      success: true,
      data: await GetAvailableOrgQuery(),
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Error getting the avaliable organization: ${err}`);
    return {
      success: false,
      errors: [
        {
          message: `Error getting the avaliable organization: ${err}`,
          type: "error",
        },
      ],
    };
  }
};

export const UpdateUserProfileOrg = async (
  orgInfo: OrgInfoType
): Promise<UpdateUserProfileOrgReturnType> => {
  try {
    const userId = await ProtectedAction("update:org");

    const validate = ZodValidateForm(orgInfo, userProfileOrgUpdateSchema);
    if (!validate.valid)
      return {
        success: false,
        formError: validate.formError,
        notifMessage: [
          {
            message: "May mga mali sa iyong binago, itama muna ito",
            type: "warning",
          },
        ],
      };

    const newOrgName =
      orgInfo.orgId === "other" && orgInfo.otherOrgName
        ? (await CreateNewOrg(orgInfo.otherOrgName, userId)).orgId
        : null;

    await UpdateUserOrg({
      orgId: newOrgName ? newOrgName : orgInfo.orgId,
      orgRole: newOrgName ? "leader" : "member",
      farmerId: userId,
    });

    revalidatePath("/farmer/profile");

    return {
      success: true,
      newOrgIdVal: newOrgName ? newOrgName : orgInfo.orgId,
      notifMessage: [
        {
          message: "Matagumpay ang pag babago mo nang iyong organisasyon!!!",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May hindi inaasahang pag kakamali ang nangyari habang nag uupdate ng organisasyon ng user: ${err}`
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

export const GetAllOrganization = async () => {
  try {
    await ProtectedAction("read:org:list");
    return {
      success: true,
      orgList: await GetAllOrganizationQuery(),
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May hindi inaasahang pag kakamali sa pagkuha ng mga impormasyon ng mga organisasyon: ${err}`
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
