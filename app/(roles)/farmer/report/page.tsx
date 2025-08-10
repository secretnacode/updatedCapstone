import { RenderNotification } from "@/component/client_component/fallbackComponent";
import {
  AddReportComponent,
  ViewUserReportTableData,
} from "@/component/client_component/reportComponent";
import { GetFarmerReport } from "@/lib/server_action/report";
import { GetFarmerReportReturnType } from "@/types";
import { DateToYYMMDD } from "@/util/helper_function/reusableFunction";
import { ClipboardX } from "lucide-react";

export default async function Page() {
  console.log("Report main component");

  let report: GetFarmerReportReturnType;

  try {
    report = await GetFarmerReport();
  } catch (error) {
    const err = error as Error;
    report = {
      success: false,
      notifError: [{ message: err.message, type: "error" }],
    };
  }

  return (
    <div className="p-8">
      {!report.success && <RenderNotification notif={report.notifError} />}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Aking mga ulat</h1>
          <AddReportComponent />
        </div>

        {report.success && report.userReport.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="space-y-3">
              <ClipboardX className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-500">
                Wala ka pang naisusumiteng ulat. Magdagdag ng bagong ulat upang
                masimulan.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 farmerReportTable">
                <caption className="sr-only">Ang iyong mga report</caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Pamagat ng ulat</th>
                    <th scope="col">Pangalan ng pananim</th>
                    <th scope="col">Estado ng ulat</th>
                    <th scope="col">Araw na ipinasa</th>
                    <th scope="col">Araw na naganap</th>
                    <th scope="col">Aksyon</th>
                  </tr>
                </thead>
                <tbody>
                  {report.success &&
                    report.userReport.map((report, index) => (
                      <tr key={report.reportId}>
                        <td className="text-gray-500">{index + 1}</td>

                        <td className=" text-gray-900 font-medium">
                          {report.title}
                        </td>

                        <td className="text-gray-500">
                          {report.cropIdReported}
                        </td>

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
                          <ViewUserReportTableData reportId={report.reportId} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
