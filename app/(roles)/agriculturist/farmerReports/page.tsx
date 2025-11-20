import { AgriculturistFarmerReporTable } from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { GetAllFarmerReport } from "@/lib/server_action/report";
import { GetAllFarmerReportReturnType } from "@/types";
import { UnexpectedErrorMessageEnglish } from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

export default async function Page() {
  let farmerReport: GetAllFarmerReportReturnType;

  try {
    farmerReport = await GetAllFarmerReport();
  } catch (error) {
    console.error((error as Error).message);

    farmerReport = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessageEnglish(), type: "error" }],
    };
  }

  return !farmerReport.success ? (
    <RenderRedirectNotification notif={farmerReport.notifError} />
  ) : (
    <AgriculturistFarmerReporTable report={farmerReport.validatedReport} />
  );
}
