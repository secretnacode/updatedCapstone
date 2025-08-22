import { AgriFarmerReportAction } from "@/component/client_component/agriReportComponent";
import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { Logo } from "@/component/server_component/elementComponent";
import { GetAllFarmerReport } from "@/lib/server_action/report";
import { DateToYYMMDD } from "@/util/helper_function/reusableFunction";
import { ClipboardX } from "lucide-react";

export default async function Page() {
  const farmerReport = await GetAllFarmerReport();

  return (
    <div className="p-8">
      {!farmerReport.success && (
        <RenderNotification notif={farmerReport.notifError} />
      )}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Farmer&apos;s Report
          </h1>
        </div>

        {farmerReport.success && farmerReport.validatedReport.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="space-y-3">
              <Logo logo={ClipboardX} className="table_no_content" />
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
                    <th scope="col">Farmer Name</th>
                    <th scope="col">Crop location</th>
                    <th scope="col">Verified</th>
                    <th scope="col">Organization Name</th>
                    <th scope="col">Araw na ipinasa</th>
                    <th scope="col">Araw na naganap</th>
                    <th scope="col">Aksyon</th>
                  </tr>
                </thead>
                <tbody>
                  {farmerReport.success &&
                    farmerReport.validatedReport.map((report, index) => (
                      <tr key={report.reportId}>
                        <td className="text-gray-500">{index + 1}</td>

                        <td className=" text-gray-900 font-medium">
                          {report.farmerName}
                        </td>

                        <td className="text-gray-500">
                          {report.cropIdReported}
                        </td>

                        <td>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-center ${
                              report.verificationStatus === "pending"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {report.verificationStatus === "pending"
                              ? "Verified"
                              : "Not verified"}
                          </span>
                        </td>

                        <td className="text-gray-500">
                          {report.orgName
                            ? report.orgName
                            : "Not in a Organization"}
                        </td>

                        <td className="text-gray-500">
                          {DateToYYMMDD(new Date(report.dayReported))}
                        </td>

                        <td className="text-gray-500">
                          {DateToYYMMDD(new Date(report.dayHappen))}
                        </td>

                        <td className="text-center">
                          <AgriFarmerReportAction reportId={report.reportId} />
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
