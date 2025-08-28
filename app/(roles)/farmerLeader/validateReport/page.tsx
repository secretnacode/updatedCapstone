import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { ViewMemberReport } from "@/component/client_component/farmerLeaderComponent";
import { TableComponent } from "@/component/server_component/customComponent";
import { GetOrgMemberReport } from "@/lib/server_action/report";
import { GetOrgMemberReportReturnType } from "@/types";
import { DateToYYMMDD } from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

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
        <TableComponent
          noContentMessage="Ang mga miyembro ng iyong organisasyon ay wala pang pinapasang ulat"
          listCount={orgReport.memberReport.length}
          tableHeaderCell={
            <>
              <th scope="col">#</th>
              <th scope="col">Unang pangalan</th>
              <th scope="col">Apelyido</th>
              <th scope="col">Alyas</th>
              <th scope="col">Pamagat ng ulat</th>
              <th scope="col">Araw Ipinasa</th>
              <th scope="col">Estado ng ulat</th>
              <th scope="col">Aksyon</th>
            </>
          }
          tableCell={
            <>
              {orgReport.success &&
                orgReport.memberReport.map((report, index) => (
                  <tr key={report.reportId}>
                    <td className="text-gray-500">{index + 1}</td>

                    <td className=" text-gray-900 font-medium">
                      {report.farmerFirstName}
                    </td>

                    <td className="text-gray-500">{report.farmerLastName}</td>

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
            </>
          }
        />
      )}
    </>
  );
}
