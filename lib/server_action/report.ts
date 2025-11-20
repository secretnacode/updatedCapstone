"use server";

import {
  addNewReport,
  ApprovedOrgMemberQuery,
  changeTheReportDescription,
  checkIfMyReport,
  GetAllFarmerReportQuery,
  getFarmerIdOfReport,
  GetFarmerReportDetailQuery,
  getLatestReportQuery,
  getMyRecentReportQuery,
  GetOrgMemberReportQuery,
  getReportCountPerCropQuery,
  getReportCountThisAndPrevMonth,
  getReportCountThisWeek,
  getReportCountThisYear,
  getToBeDownloadReportQuery,
  GetUserReport,
  updateReportType,
} from "@/util/queries/report";
import { ProtectedAction } from "../protectedActions";
import {
  AddReportActionFormType,
  AddReportValType,
  allUserRoleType,
  changeApproveOrJustApproveReportParamType,
  changeApproveOrJustApproveReportReturnType,
  GetAllFarmerReportReturnType,
  GetFarmerReportDetailReturnType,
  GetFarmerReportReturnType,
  getLatestReportReturnType,
  GetOrgMemberReportReturnType,
  getReportCountPerCropReturnType,
  reportPerDayWeekAndMonthReturnType,
  uploadHarvestingReportType,
  uploadHarvestingReportFormType,
  uploadPlantingReportFormType,
  uploadPlantingReportType,
  reportTypeStateType,
  getMyRecentReportReturnType,
  reportDownloadType,
  keyOfReportToDowload,
  getToBeDownloadReportReturnType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import {
  addFarmerReportSchema,
  addHarvestingReportSchema,
  addPlantingReportSchema,
} from "@/util/helper_function/validation/validationSchema";
import {
  CreateUUID,
  missingFormValNotif,
} from "@/util/helper_function/reusableFunction";
import { cloudinary } from "@/util/configuration";
import { UploadApiResponse } from "cloudinary";
import { AddNewFarmerReportImage } from "@/util/queries/image";
import { GetUserOrgId } from "@/util/queries/org";
import { revalidatePath } from "next/cache";
import { CheckMyMemberquery } from "@/util/queries/user";
import {
  getCropStatus,
  getCropStatusAndExpectedHarvest,
  getCropStatusAndPlantedDate,
  updateCropIntoHarvestedStatus,
  updateCropIntoPlantedStatus,
} from "@/util/queries/crop";
import {
  addHarvestedCrop,
  addPlantedCrop,
} from "@/util/queries/plantedHarvested";

/**
 * server action to get the farmer report
 * @returns the necesarry info about the reports of the current user
 */
export const GetFarmerReport = async (): Promise<GetFarmerReportReturnType> => {
  try {
    const { userId, work } = await ProtectedAction("read:report");

    return {
      success: true,
      userReport: await GetUserReport(userId),
      work,
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

/**
 * server action for passing a damage report
 * @param prevState value of the form before the submission
 * @param formData
 * @returns
 */
export const uploadDamageReport = async (
  prevState: AddReportActionFormType,
  formData: FormData
): Promise<AddReportActionFormType> => {
  try {
    const reportVal: AddReportValType = {
      cropId: formData.get("cropId") as string,
      reportTitle: formData.get("reportTitle") as string,
      reportDescription: formData.get("reportDescription") as string,
      dateHappen: new Date(formData.get("dateHappen") as string),
      reportPicture: formData.getAll("file") as File[],
      reportType: formData.get("reportType") as reportTypeStateType,
    };

    const returnVal = {
      success: null,
      notifError: null,
      formError: null,
    };

    const { userId, work } = await ProtectedAction("create:report");

    const validateVal = ZodValidateForm(reportVal, addFarmerReportSchema);
    if (!validateVal.valid)
      return {
        ...returnVal,
        success: false,
        formError: validateVal.formError,
        notifError: missingFormValNotif(),
      };

    if (reportVal.reportType !== "damage")
      return {
        ...returnVal,
        success: true,
        notifError: [
          {
            message:
              "Ang pwede mo lamang ipasa sa ulat na ito ay patungkol sa pagkasira ng iyong pananim",
            type: "warning",
          },
        ],
      };

    const crop = await getCropStatusAndPlantedDate(reportVal.cropId);

    // the user can only passed a damage report if the crop status is planted,
    // means in the paddy field theres a crop that was destroyed to be reported
    if (crop.cropStatus !== "planted")
      return {
        ...returnVal,
        success: true,
        notifError: [
          {
            message:
              "Mag pasa muna ng ulat tungkol sa pag tatanim bago mag pasa ng ulat tungkol sa pagkasira",
            type: "warning",
          },
        ],
      };

    if (crop.dateHarvested >= reportVal.dateHappen)
      return {
        ...returnVal,
        success: true,
        formError: {
          dateHappen: [
            "Mas maaga ang nailagay na petsa kesa sa araw na ikaw ay nagtanim",
          ],
        },
        notifError: [
          {
            message:
              "Mas nauna ang petsa ng pagkasira sa iyong ulat kaysa sa petsa ng pagtatanim na iyong isinasaad",
            type: "warning",
          },
        ],
      };

    const reportId = CreateUUID();

    await addNewReport({
      reportId: reportId,
      cropId: reportVal.cropId,
      orgId: (await GetUserOrgId(userId)).orgId,
      farmerId: userId,
      reportTitle: reportVal.reportTitle,
      reportDescription: reportVal.reportDescription,
      dayHappen: reportVal.dateHappen,
      dayReported: new Date().toISOString(),
      verificationStatus: work === "leader" ? true : false,
    });

    // did this because the 3 report types uses the same query and their only difference is the reportType,
    // so after the insertion of new report, this is needed to be executed
    await updateReportType("damage", reportId);

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
    console.log(
      `May Hindi inaasahang pag kakamali habang nag papasa ng ulat: ${err}`
    );
    return {
      formError: null,
      success: false,
      notifError: [{ message: err.message, type: "error" }],
    };
  }
};

/**
 * server action for passing a planting report
 * @param prevState value of the form before the submission
 * @param formData
 * @returns
 */
export const uploadPlantingReport = async (
  prevState: uploadPlantingReportFormType,
  formData: FormData
): Promise<uploadPlantingReportFormType> => {
  try {
    const reportVal: uploadPlantingReportType = {
      cropId: formData.get("cropId") as string,
      reportTitle: formData.get("reportTitle") as string,
      reportDescription: formData.get("reportDescription") as string,
      dateHappen: new Date(formData.get("dateHappen") as string),
      reportPicture: formData.getAll("file") as File[],
      totalCropPlanted: Number(formData.get("totalCropPlanted")),
      reportType: formData.get("reportType") as reportTypeStateType,
    };

    const returnVal = {
      success: null,
      notifError: null,
      formError: null,
    };

    const { userId, work } = await ProtectedAction("create:report");

    const validateVal = ZodValidateForm(reportVal, addPlantingReportSchema);
    if (!validateVal.valid)
      return {
        ...returnVal,
        success: false,
        formError: validateVal.formError,
        notifError: missingFormValNotif(),
      };

    if (reportVal.reportType !== "planting")
      return {
        ...returnVal,
        success: true,
        notifError: [
          {
            message:
              "Ang pwede mo lamang ipasa sa ulat na ito ay patungkol iyong sa pag tatanim",
            type: "warning",
          },
        ],
      };

    // if the cropStatus is equasl to planted, it means the user already passed a report type planted
    // you can only passed a planted type report if the user last report is about harvest
    if ((await getCropStatus(reportVal.cropId)).cropStatus === "planted")
      return {
        ...returnVal,
        success: true,
        notifError: [
          {
            message:
              "Mag pasa muna ng ulat tungkol sa pag aani bago mag pasa ng ulat tungkol sa pag tatanim",
            type: "warning",
          },
        ],
      };

    const reportId = CreateUUID();

    await addNewReport({
      reportId: reportId,
      cropId: reportVal.cropId,
      orgId: (await GetUserOrgId(userId)).orgId,
      farmerId: userId,
      reportTitle: reportVal.reportTitle,
      reportDescription: reportVal.reportDescription,
      dayHappen: reportVal.dateHappen,
      dayReported: new Date().toISOString(),
      verificationStatus: work === "leader" ? true : false,
    });

    await Promise.all([
      // did this because the 3 report types uses the same query and their only difference is the reportType,
      // so after the insertion of new report, this is needed to be executed
      updateReportType("planting", reportId),
      updateCropIntoPlantedStatus({
        datePlanted: reportVal.dateHappen,
        cropId: reportVal.cropId,
      }),
      addPlantedCrop({
        plantedId: CreateUUID(),
        reportId: reportId,
        cropId: reportVal.cropId,
        cropKgPlanted: reportVal.totalCropPlanted,
        datePlanted: reportVal.dateHappen,
        farmerId: userId,
      }),
    ]);

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
 * server action for passing a planting report
 * @param prevState value of the form before the submission
 * @param formData
 * @returns
 */
export const uploadHarvestingReport = async (
  prevState: uploadHarvestingReportFormType,
  formData: FormData
): Promise<uploadHarvestingReportFormType> => {
  try {
    const reportVal: uploadHarvestingReportType = {
      cropId: formData.get("cropId") as string,
      reportTitle: formData.get("reportTitle") as string,
      reportDescription: formData.get("reportDescription") as string,
      dateHappen: new Date(formData.get("dateHappen") as string),
      reportPicture: formData.getAll("file") as File[],
      totalHarvest: Number(formData.get("totalHarvest")),
      reportType: formData.get("reportType") as reportTypeStateType,
    };

    const returnVal = {
      success: null,
      notifError: null,
      formError: null,
    };

    const userId = (await ProtectedAction("create:report")).userId;

    const validateVal = ZodValidateForm(reportVal, addHarvestingReportSchema);
    if (!validateVal.valid)
      return {
        ...returnVal,
        success: false,
        formError: validateVal.formError,
        notifError: missingFormValNotif(),
      };

    if (reportVal.reportType !== "harvesting")
      return {
        ...returnVal,
        success: true,
        notifError: [
          {
            message:
              "Ang pwede mo lamang ipasa sa ulat na ito ay patungkol sa pagaani ng iyong pananim",
            type: "warning",
          },
        ],
      };

    const crop = await getCropStatusAndExpectedHarvest(reportVal.cropId);

    // if the cropStatus is equasl to planted, it means the user already passed a report type planted
    // you can only passed a planted type report if the user last report is about harvest
    if (crop.cropStatus !== "planted")
      return {
        ...returnVal,
        success: true,
        notifError: [
          {
            message:
              "Mag pasa muna ng ulat tungkol sa pag tatanim bago mag pasa ng ulat tungkol sa pag aani",
            type: "warning",
          },
        ],
      };

    // the date today should be more than the expected date of the harvest to ensure the user cant make a harvest report to early
    if (new Date() >= crop.expectedHarvest)
      return {
        ...returnVal,
        success: true,
        notifError: [
          {
            message:
              "Masyado pang maaga para mag pasa ng ulat patungkol sa pagaani",
            type: "warning",
          },
        ],
      };

    const reportId = CreateUUID();

    await addNewReport({
      reportId: reportId,
      cropId: reportVal.cropId,
      orgId: (await GetUserOrgId(userId)).orgId,
      farmerId: userId,
      reportTitle: reportVal.reportTitle,
      reportDescription: reportVal.reportDescription,
      dayHappen: reportVal.dateHappen,
      dayReported: new Date().toISOString(),
      verificationStatus: false,
    });

    await Promise.all([
      // did this because the 3 report types uses the same query and their only difference is the reportType,
      // so after the insertion of new report, this is needed to be executed to
      // make the report about the harvest because by default its damage report
      updateReportType("harvesting", reportId),
      updateCropIntoHarvestedStatus({
        datePlanted: reportVal.dateHappen,
        cropId: reportVal.cropId,
      }),
      addHarvestedCrop({
        harvestId: CreateUUID(),
        reportId: reportId,
        cropId: reportVal.cropId,
        totalKgHarvested: reportVal.totalHarvest,
        dateHarvested: reportVal.dateHappen,
        farmerId: userId,
      }),
    ]);

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
    const { work, userId } = await ProtectedAction("read:report");

    // nested if for so it wouldnt fetch unnecessarry
    if (work === "leader")
      if (await checkIfMyReport(userId, reportId))
        if (
          !(await CheckMyMemberquery(
            await getFarmerIdOfReport(reportId),
            userId
          ))
        )
          return {
            success: false,
            notifError: [
              {
                message:
                  "Ikinansela sapagkat hindi mo kamiyembro and nag pasa nito!!!",
                type: "warning",
              },
            ],
          };

    const reportDetail = await GetFarmerReportDetailQuery(reportId);

    if (!reportDetail.isExist) {
      const message = (): string => {
        if (work === "admin" || work === "agriculturist")
          return "The report doesnt exist";

        return "Hindi makita ang ulat";
      };

      return {
        success: false,
        notifError: [{ message: message(), type: "warning" }],
      };
    }

    return {
      success: true,
      work,
      reportDetail: {
        ...reportDetail.reportInfo,
        pictures: reportDetail.reportInfo.pictures.split(","),
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

/**
 * server action for getting the report base on the sequence(per day in a week, per week in 2 months, per month in a year)
 *
 * IF THIS WILL USE BY THE AGRI OR THE ADMIN, JUST PASS ANY RANDOM IN THE USERID JUST FOR IT TO WORK
 *
 * @param userId farmerId that wants to get it
 * @param work role of the farmer
 * @returns
 */
export const reportPerDayWeekAndMonth = async (
  userId: string,
  work: allUserRoleType
): Promise<reportPerDayWeekAndMonthReturnType> => {
  try {
    const [
      reportCountThisWeek,
      reportCountThisAndPrevMonth,
      reportCountThisYear,
    ] = await Promise.all([
      getReportCountThisWeek(userId, work),
      getReportCountThisAndPrevMonth(userId, work),
      getReportCountThisYear(userId, work),
    ]);

    return {
      success: true,
      reportCountThisWeek,
      reportCountThisAndPrevMonth,
      reportCountThisYear,
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May Hindi inaasahang pag kakamali habang kinukuha ang mga bilang ng ulat: ${err.message}`
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
 * server action for approving the farmer report and changing the content of the report if changed
 * @param reportId id of the report that will be approved or validated
 * @param param1 {isChange, newDesc} is change is boolean type if the description was changed or not,
 * newDesc is the value of the new description
 * @returns notifmessage if successful or not
 */
export const changeApproveOrJustApproveReport = async ({
  reportId,
  isChange,
  newDesc,
}: changeApproveOrJustApproveReportParamType): Promise<changeApproveOrJustApproveReportReturnType> => {
  try {
    const { userId } = await ProtectedAction("update:farmer:member:report");

    // if returns false it means the user that will approved is not the leader of the farmer who passed the report
    if (
      !(await CheckMyMemberquery(await getFarmerIdOfReport(reportId), userId))
    )
      return {
        notifMessage: [
          {
            message:
              "Ikinansela sapagkat hindi mo kamiyembro and nag pasa nito!!!",
            type: "warning",
          },
        ],
      };

    if (isChange) console.log("description changed");

    await Promise.all([
      ApprovedOrgMemberQuery(reportId),
      isChange ? changeTheReportDescription(newDesc, reportId) : undefined,
    ]);

    revalidatePath(`/farmerLeader/validateReport`);

    return {
      notifMessage: [
        {
          message: isChange
            ? "Matagumpay and pag babago at pag aapruba ng ulat!!!"
            : "Matagumpay and pag aapruba ng ulat!!!",
          type: "success",
        },
      ],
    };
  } catch (error) {
    const err = error as Error;
    console.log(
      `${
        isChange
          ? "May Hindi inaasahang pag kakamali habang binabago at inaaprubahan ang ulat"
          : "May Hindi inaasahang pag kakamali habang inaaprubahan ang ulat"
      }: ${err}`
    );
    return {
      notifMessage: [{ message: err.message, type: "error" }],
    };
  }
};

export const getReportCountPerCrop =
  async (): Promise<getReportCountPerCropReturnType> => {
    try {
      const { userId } = await ProtectedAction("read:crop");

      return {
        success: true,
        reportCountVal: await getReportCountPerCropQuery(userId),
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `May pagkakamali sa pag kuha ng bilang ng ulat ng iyong pananim: ${err.message}`
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

export const getLatestReport = async (): Promise<getLatestReportReturnType> => {
  try {
    const { userId } = await ProtectedAction("read:report");

    return { success: true, reportVal: await getLatestReportQuery(userId) };
  } catch (error) {
    const err = error as Error;
    console.log(
      `May pagkakamali sa pag kuha ng mga ginawang ulat: ${err.message}`
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

export const getMyRecentReport =
  async (): Promise<getMyRecentReportReturnType> => {
    try {
      const { userId } = await ProtectedAction("read:report");

      return {
        success: true,
        recentReport: await getMyRecentReportQuery(userId),
      };
    } catch (error) {
      const err = error as Error;
      console.log(
        `May pagkakamali sa pag kuha ng mga ginawang ulat: ${err.message}`
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

export const getToBeDownloadReport = async (
  type: reportDownloadType
): Promise<getToBeDownloadReportReturnType> => {
  try {
    await ProtectedAction("read:farmer:report:list");

    const reports = await getToBeDownloadReportQuery(type);

    const toCsvType = () => {
      if (!reports || reports.length === 0) return "";

      const header = Object.keys(reports[0]) as keyOfReportToDowload;

      const headRow = header.join(",");

      const dataRow = reports.map((row) =>
        header.map((header) => {
          const val = row[header];

          if (
            typeof val === "string" &&
            (val.includes(",") || val.includes('"'))
          ) {
            return `"${val.replace(/"/g, '""')}"`;
          }

          return val;
        })
      );

      return [headRow, ...dataRow].join(`\n`);
    };

    return { success: true, csvType: toCsvType() };
  } catch (error) {
    const err = error as Error;
    console.log(
      `Unexpected error while downloading the reports: ${err.message}`
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
