import {
  MyReportTable,
  TableComponentLoading,
} from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import {
  AddReportComponent,
  AutoOpenMyReport,
} from "@/component/client_component/reportComponent";
import { GetFarmerReport } from "@/lib/server_action/report";
import { GetFarmerReportReturnType } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ addReport?: string; viewReport?: string }>;
}) {
  const isAddingReport = (await searchParams).addReport;
  const reportToView = (await searchParams).viewReport;

  let report: GetFarmerReportReturnType;

  try {
    report = await GetFarmerReport();
  } catch (error) {
    report = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  return (
    <div className="component">
      {/* max-w-7xl mx-auto (style below)*/}
      <div className="space-y-6">
        {!report.success ? (
          <>
            <RenderRedirectNotification notif={report.notifError} />
            <TableComponentLoading />
          </>
        ) : (
          <>
            <div>
              <div className="flex justify-between items-center">
                <h1 className="table-title">Aking mga ulat</h1>

                <AddReportComponent openModal={isAddingReport === "true"} />
              </div>

              {reportToView && <AutoOpenMyReport reportId={reportToView} />}
            </div>

            <MyReportTable report={report.userReport} work={report.work} />
          </>
        )}
      </div>
    </div>
  );
}
