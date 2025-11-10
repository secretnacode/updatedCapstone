import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { ViewUserReportButton } from "@/component/client_component/reportComponent";
import {
  ReportStatus,
  ReportType,
  TableComponent,
  TableComponentLoading,
} from "@/component/server_component/customComponent";
import { GetOrgMemberReport } from "@/lib/server_action/report";
import { GetOrgMemberReportReturnType } from "@/types";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

export default async function Page() {
  let orgReport: GetOrgMemberReportReturnType;

  try {
    orgReport = await GetOrgMemberReport();
  } catch (error) {
    const err = error as Error;
    orgReport = {
      success: false,
      notifError: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }

  return (
    <div className="component space-y-6">
      {!orgReport.success ? (
        <>
          <RenderRedirectNotification notif={orgReport.notifError} />

          <TableComponentLoading />
        </>
      ) : (
        <>
          <div>
            <div className="flex justify-start items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Mga ulat ng ka-miyembro
              </h1>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div>
              <input type="text" />
            </div>
          </div>

          <TableComponent
            noContentMessage="Ang mga miyembro ng iyong organisasyon ay wala pang pinapasang ulat"
            listCount={orgReport.memberReport.length}
            tableHeaderCell={
              <>
                <th scope="col">Unang pangalan</th>
                <th scope="col">Apelyido</th>
                <th scope="col">Alyas</th>
                <th scope="col">Pamagat ng ulat</th>
                <th scope="col">Araw Ipinasa</th>
                <th scope="col">Uri ng ulat</th>
                <th scope="col">Estado ng ulat</th>
                <th scope="col">Aksyon</th>
              </>
            }
            tableCell={
              <>
                {orgReport.success &&
                  orgReport.memberReport.map((report) => (
                    <tr key={report.reportId}>
                      <td className=" text-gray-900 font-medium">
                        {report.farmerFirstName}
                      </td>

                      <td className="text-gray-500">{report.farmerLastName}</td>

                      <td className="text-gray-500">{report.farmerAlias}</td>

                      <td className="text-gray-500">{report.title}</td>

                      <td className="text-gray-500">
                        {ReadableDateFomat(new Date(report.dayReported))}
                      </td>

                      <td>
                        <ReportType type={report.reportType} />
                      </td>

                      <td>
                        <ReportStatus
                          verificationStatus={report.verificationStatus}
                        />
                      </td>

                      <td>
                        <ViewUserReportButton
                          reportId={report.reportId}
                          farmerName={
                            report.farmerFirstName + " " + report.farmerLastName
                          }
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
  );
}
