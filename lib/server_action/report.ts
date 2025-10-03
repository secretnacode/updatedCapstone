"use server";

import {
  AddNewFarmerReport,
  ApprovedOrgMemberQuery,
  GetAllFarmerReportQuery,
  GetFarmerReportDetailQuery,
  GetOrgMemberReportQuery,
  GetUserReport,
} from "@/util/queries/report";
import { ProtectedAction } from "../protectedActions";
import {
  AddReportActionFormType,
  AddReportValType,
  ApprovedOrgMemberReturnType,
  GetAllFarmerReportReturnType,
  GetFarmerReportDetailReturnType,
  GetFarmerReportReturnType,
  GetOrgMemberReportReturnType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import { addFarmerReportSchema } from "@/util/helper_function/validation/validationSchema";
import { redirect } from "next/navigation";
import {
  CreateUUID,
  NotifToUriComponent,
} from "@/util/helper_function/reusableFunction";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cloudinary } from "@/util/configuration";
import { UploadApiResponse } from "cloudinary";
import { AddNewFarmerReportImage } from "@/util/queries/image";
import { GetUserOrgId } from "@/util/queries/org";
import { revalidatePath } from "next/cache";

/**
 * server action to get the farmer report
 * @returns the necesarry info about the reports of the current user
 */
export const GetFarmerReport = async (): Promise<GetFarmerReportReturnType> => {
  try {
    const userId = (await ProtectedAction("read:report")).userId;

    return {
      success: true,
      userReport: await GetUserReport(userId),
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May Hindi inaasahang pag kakamali habang kinukuha ang impormasyon ng iyong mga ulat: ${err}`
    );
    return {
      success: false,
      notifError: [
        {
          message: `May Hindi inaasahang pag kakamali habang kinukuha ang impormasyon ng iyong mga ulat`,
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
    cropId: formData.get("cropId") as string,
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
    const userId = (await ProtectedAction("create:report")).userId;

    const validateVal = ZodValidateForm(reportVal, addFarmerReportSchema);
    if (!validateVal.valid)
      return {
        ...returnVal,
        success: false,
        formError: validateVal.formError,
      };

    const reportId = CreateUUID();

    await AddNewFarmerReport({
      reportId: reportId,
      cropId: reportVal.cropId,
      orgId: (await GetUserOrgId(userId)).orgId,
      farmerId: userId,
      reportTitle: reportVal.reportTitle,
      reportDescription: reportVal.reportDescription,
      dayHappen: reportVal.dateHappen,
      dayReported: new Date(),
      verificationStatus: false,
    });

    reportVal.reportPicture.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResult: UploadApiResponse | undefined = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({}, (error, result) => {
              if (error) reject(error);

              resolve(result);
            })
            .end(buffer);
        }
      );

      if (uploadResult)
        await AddNewFarmerReportImage({
          picId: CreateUUID(),
          reportId: reportId,
          pictureUrl: uploadResult.secure_url,
        });
    });

    revalidatePath(`/farmer/report`);

    return {
      ...returnVal,
      success: true,
      notifError: [
        { message: "Matagumpay ang pag papasa mo ng ulat", type: "success" },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Error in adding farmer report: ${err}`);
    return {
      formError: null,
      success: false,
      notifError: [{ message: err.message, type: "error" }],
    };
  }
};

/**
 * server action for geting the detail if the farmer report
 * @param reportId id of the report you want to see
 * @returns the details of the report
 */
export const GetFarmerReportDetail = async (
  reportId: string
): Promise<GetFarmerReportDetailReturnType> => {
  try {
    await ProtectedAction("read:report");

    const reportDetail = await GetFarmerReportDetailQuery(reportId);
    console.log(reportDetail);
    return {
      success: true,
      reportDetail: {
        ...reportDetail,
        pictures: reportDetail.pictures.split(","),
      },
    };
  } catch (error) {
    const err = error as Error;
    console.log(`Error in getting the farmer reports: ${err}`);
    return {
      success: false,
      notifError: [{ message: err.message, type: "error" }],
    };
  }
};

/**
 * Fetch all the report of the member within the organization
 * @returns all the report within the organization
 */
export const GetOrgMemberReport =
  async (): Promise<GetOrgMemberReportReturnType> => {
    try {
      const farmerId = (await ProtectedAction("read:farmer:member:report"))
        .userId;

      return {
        success: true,
        memberReport: await GetOrgMemberReportQuery(
          (
            await GetUserOrgId(farmerId)
          ).orgId
        ),
      };
    } catch (error) {
      const err = error as Error;
      console.log(`Error in getting the farmer member reports: ${err}`);
      return {
        success: false,
        notifError: [{ message: err.message, type: "error" }],
      };
    }
  };

/**
 * for approving/validating the farmer report
 * @param reportId id of the report you want to approved
 * @returns
 */
export const ApprovedOrgMember = async (
  reportId: string
): Promise<ApprovedOrgMemberReturnType> => {
  try {
    await ProtectedAction("read:farmer:member:report");

    await ApprovedOrgMemberQuery(reportId);

    redirect(
      `/farmerLeader/validateReport/?success=${NotifToUriComponent([
        {
          message: "Matagumpay ang iyong pag aapruba ng ulat",
          type: "success",
        },
      ])}`
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;
    console.log(`Error in server action approving farmer report: ${err}`);
    return {
      success: false,
      notifError: [{ message: err.message, type: "error" }],
    };
  }
};

export const GetAllFarmerReport =
  async (): Promise<GetAllFarmerReportReturnType> => {
    try {
      await ProtectedAction("read:farmer:report:list");

      return {
        success: true,
        validatedReport: await GetAllFarmerReportQuery(),
      };
    } catch (error) {
      const err = error as Error;
      console.log(`Error in getting the farmer member reports: ${err}`);
      return {
        success: false,
        notifError: [{ message: err.message, type: "error" }],
      };
    }
  };
