import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import {
  AddReportComponent,
  AutoOpenMyReport,
  ViewUserReportButton,
} from "@/component/client_component/reportComponent";
import {
  ReportType,
  TableComponent,
  TableComponentLoading,
} from "@/component/server_component/customComponent";
import { GetFarmerReport } from "@/lib/server_action/report";
import { GetFarmerReportReturnType } from "@/types";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";

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
                <h1 className="text-2xl font-bold text-gray-900">
                  Aking mga ulat
                </h1>

                <AddReportComponent openModal={isAddingReport === "true"} />
              </div>

              {reportToView && <AutoOpenMyReport reportId={reportToView} />}
            </div>

            <TableComponent
              noContentMessage="Wala ka pang naisusumiteng ulat. Mag sagawa ng panibagong ulat."
              listCount={report.userReport.length}
              tableHeaderCell={
                <>
                  <th scope="col">Pamagat ng ulat</th>
                  <th scope="col">Pangalan ng pananim</th>
                  <th scope="col">Estado ng ulat</th>
                  <th scope="col">Araw na ipinasa</th>
                  <th scope="col">Araw na naganap</th>
                  <th scope="col">Uri ng ulat</th>
                  <th scope="col">Aksyon</th>
                </>
              }
              tableCell={
                <>
                  {report.success &&
                    report.userReport.map((report) => (
                      <tr key={report.reportId}>
                        <td className=" text-gray-900 font-medium">
                          {report.title}
                        </td>

                        <td className="text-gray-500">{report.cropName}</td>

                        <td>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              report.verificationStatus
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {report.verificationStatus
                              ? "Naipasa"
                              : "kinukumpirma"}
                          </span>
                        </td>

                        <td className="text-gray-500">
                          {ReadableDateFomat(new Date(report.dayReported))}
                        </td>

                        <td className="text-gray-500">
                          {ReadableDateFomat(new Date(report.dayHappen))}
                        </td>

                        <td scope="col">
                          <ReportType type={report.reportType} />
                        </td>

                        <td className="text-center">
                          <ViewUserReportButton
                            reportId={report.reportId}
                            myReport={true}
                          />
                        </td>
                      </tr>
                    ))}
                </>
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
