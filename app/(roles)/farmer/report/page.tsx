import { RenderNotification } from "@/component/client_component/fallbackComponent";
import {
  AddReportComponent,
  ViewUserReportButton,
} from "@/component/client_component/reportComponent";
import { TableComponent } from "@/component/server_component/customComponent";
import { GetFarmerReport } from "@/lib/server_action/report";
import { GetFarmerReportReturnType } from "@/types";
import { DateToYYMMDD } from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

export default async function Page() {
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
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {!report.success ? (
          <RenderNotification notif={report.notifError} />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Aking mga ulat
              </h1>
              <AddReportComponent />
            </div>
            <TableComponent
              noContentMessage="Wala ka pang naisusumiteng ulat. Mag sagawa ng panibagong ulat."
              listCount={report.userReport.length}
              tableHeaderCell={
                <>
                  <th scope="col">#</th>
                  <th scope="col">Pamagat ng ulat</th>
                  <th scope="col">Pangalan ng pananim</th>
                  <th scope="col">Estado ng ulat</th>
                  <th scope="col">Araw na ipinasa</th>
                  <th scope="col">Araw na naganap</th>
                  <th scope="col">Aksyon</th>
                </>
              }
              tableCell={
                <>
                  {report.success &&
                    report.userReport.map((report, index) => (
                      <tr key={report.reportId}>
                        <td className="text-gray-500">{index + 1}</td>

                        <td className=" text-gray-900 font-medium">
                          {report.title}
                        </td>

                        <td className="text-gray-500">{report.cropName}</td>

                        <td>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              report.verificationStatus === "false"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {report.verificationStatus === "false"
                              ? "kinukumpirma"
                              : "Naipasa"}
                          </span>
                        </td>

                        <td className="text-gray-500">
                          {DateToYYMMDD(new Date(report.dayReported))}
                        </td>

                        <td className="text-gray-500">
                          {DateToYYMMDD(new Date(report.dayHappen))}
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
    </>
  );
}
