"use server";

import { GetUserReport } from "@/util/queries/report";
import { ProtectedAction } from "../protectedActions";
import {
  AddReportActionFormType,
  AddReportFormType,
  AddReportValType,
  GetFarmerReportReturnType,
} from "@/types";

/**
 * server action to get the farmer report
 * @returns the necesarry info about the reports of the current user
 */
export const GetFarmerReport = async (): Promise<GetFarmerReportReturnType> => {
  try {
    const userId = await ProtectedAction("read:user");

    return {
      success: true,
      userReport: await GetUserReport(userId),
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Error in getting the farmer reports: ${err}`);
    return {
      success: false,
      notifError: [
        {
          message: `Error in getting the farmer reports: ${err}`,
          type: "error",
        },
      ],
    };
  }
};

export const PostFarmerReport = async (
  prevState: AddReportActionFormType,
  formData: FormData
): Promise<AddReportActionFormType> => {
  const reportVal: AddReportValType = {
    reportTitle: formData.get("reportTitle") as string,
    reportDescription: formData.get("reportDescription") as string,
    dateHappen: new Date(formData.get("dateHappen") as string),
    reportPicture: formData.get("reportPicture") as File[],
  };

  const returnVal = {
    success: null,
    notifError: null,
    formError: null,
    fieldValues: {
      reportTitle: "",
      reportDescription: "",
      dateHappen: new Date(),
      reportPicture: [],
    },
  };
  try {
    return returnVal;
  } catch (error) {
    const err = error as Error;
    console.log(`Error in getting the farmer reports: ${err}`);
    return returnVal;
  }
};
