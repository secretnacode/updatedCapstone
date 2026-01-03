import { AgriculturistFarmerReporTable } from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { GetAllFarmerReport } from "@/lib/server_action/report";
import { GetAllFarmerReportReturnType } from "@/types";
import { UnexpectedErrorMessageEnglish } from "@/util/helper_function/reusableFunction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroFarm",
  description:
    "Reprot page where it will show all the passed report of the farmers",
  robots: { index: false, follow: false },
};

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

  return farmerReport.success ? (
    <AgriculturistFarmerReporTable report={farmerReport.validatedReport} />
  ) : (
    <>
      <AgriculturistFarmerReporTable report={[]} />

      <RenderRedirectNotification notif={farmerReport.notifError} />
    </>
  );
}
