import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { ViewMemberReport } from "@/component/client_component/farmerLeaderComponent";
import { TableComponent } from "@/component/server_component/customComponent";
import { GetOrgMemberReport } from "@/lib/server_action/report";
import { GetOrgMemberReportReturnType } from "@/types";
import { DateToYYMMDD } from "@/util/helper_function/reusableFunction";
import { ClipboardX } from "lucide-react";

export default async function Page() {
  console.log("validate reoport main component");
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
    <>
      {!orgReport.success ? (
        <RenderNotification notif={orgReport.notifError} />
      ) : (
        <>
          {message && <RedirectManager data={message} paramName="error" />}
          <TableComponent
            noContentMessage="Wala ka pang miyembro sa iyong organisasyon"
            listCount={farmerMember.farmerMember.length}
            tableHeaderCell={
              <>
                <th scope="col">#</th>
                <th scope="col">Pangalan ng magsasaka</th>
                <th scope="col">Alyas ng magsasaka</th>
                <th scope="col">Numero ng telepono</th>
                <th scope="col">Baranggay na tinitirhan</th>
                <th scope="col">Estado account</th>
                <th scope="col">Bilang ng pananim</th>
                <th scope="col">Aksyon</th>
              </>
            }
            tableCell={
              <>
                {farmerMember.farmerMember.map((farmer, index) => (
                  <tr key={farmer.farmerId}>
                    <td className="text-gray-500">{index + 1}</td>

                    <td className=" text-gray-900 font-medium">
                      {farmer.farmerName}
                    </td>

                    <td className="text-gray-500">{farmer.farmerAlias}</td>

                    <td className=" text-gray-900 font-medium">
                      {farmer.mobileNumber}
                    </td>

                    <td className="text-gray-500">{farmer.barangay}</td>

                    <td>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          !farmer.verified
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {!farmer.verified ? "Kumpirmahin" : "Kumpirmado"}
                      </span>
                    </td>

                    <td className="text-gray-500">{farmer.cropNum}</td>

                    <td className="text-center">
                      <FarmerOrgMemberAction
                        farmerId={farmer.farmerId}
                        verificationStatus={farmer.verified}
                        farmerName={farmer.farmerName}
                      />
                    </td>
                  </tr>
                ))}
              </>
            }
          />
        </>
      )}
      {!orgReport.success && (
        <RenderNotification notif={orgReport.notifError} />
      )}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Ulat ng mga Miyembro
          </h1>
        </div>

        {orgReport.success && orgReport.memberReport.length === 0 ? (
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
                {!orgReport.success && (
                  <RenderNotification notif={orgReport.notifError} />
                )}
                <caption className="sr-only">Ang iyong mga report</caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Unang pangalan</th>
                    <th scope="col">Apelyido</th>
                    <th scope="col">Alyas</th>
                    <th scope="col">Pamagat ng ulat</th>
                    <th scope="col">Araw Ipinasa</th>
                    <th scope="col">Estado ng ulat</th>
                    <th scope="col">Aksyon</th>
                  </tr>
                </thead>
                <tbody>
                  {orgReport.success &&
                    orgReport.memberReport.map((report, index) => (
                      <tr key={report.reportId}>
                        <td className="text-gray-500">{index + 1}</td>

                        <td className=" text-gray-900 font-medium">
                          {report.farmerFirstName}
                        </td>

                        <td className="text-gray-500">
                          {report.farmerLastName}
                        </td>

                        <td className="text-gray-500">{report.farmerAlias}</td>

                        <td className="text-gray-500">{report.title}</td>

                        <td className="text-gray-500">
                          {DateToYYMMDD(new Date(report.dayReported))}
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
                              ? "kumpirmahin"
                              : "Naipasa"}
                          </span>
                        </td>

                        <td>
                          <ViewMemberReport reportId={report.reportId} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
