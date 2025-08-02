"use server";

import { AddNewFarmerReport, GetUserReport } from "@/util/queries/report";
import { ProtectedAction } from "../protectedActions";
import {
  AddReportActionFormType,
  AddReportValType,
  GetFarmerReportReturnType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import { addFarmerReportSchema } from "@/util/helper_function/validation/validationSchema";
import { redirect } from "next/navigation";
import {
  CreateUUID,
  NotifToUriComponent,
} from "@/util/helper_function/reusableFunction";
import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * server action to get the farmer report
 * @returns the necesarry info about the reports of the current user
 */
export const GetFarmerReport = async (): Promise<GetFarmerReportReturnType> => {
  try {
    const userId = await ProtectedAction("read:report");

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
    reportPicture: formData.getAll("file") as File[],
  };

  const returnVal = {
    success: null,
    notifError: null,
    formError: null,
  };

  try {
    const userId = await ProtectedAction("create:report");

    const validateVal = ZodValidateForm(reportVal, addFarmerReportSchema);
    if (!validateVal.valid)
      return {
        ...returnVal,
        success: false,
        formError: validateVal.formError,
      };

    await AddNewFarmerReport({
      reportId: CreateUUID(),
      farmerId: userId,
      reportTitle: reportVal.reportTitle,
      reportDescription: reportVal.reportDescription,
      dayHappen: reportVal.dateHappen,
      dayReported: new Date(),
      verificationStatus: false,
    });

    // return redirect(
    //   `/farmer/report?success=${NotifToUriComponent([
    //     { message: "Matagumpay ang pag papasa mo ng ulat", type: "success" },
    //   ])}`
    // );

    return returnVal;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const err = error as Error;
    console.log(`Error in getting the farmer reports: ${err}`);
    return {
      ...returnVal,
      success: false,
      notifError: [{ message: err.message, type: "error" }],
    };
  }
};
