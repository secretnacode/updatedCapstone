import { AgriFarmerReportAction } from "@/component/client_component/agriReportComponent";
import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { TableComponent } from "@/component/server_component/customComponent";
import { GetAllFarmerReport } from "@/lib/server_action/report";
import { GetAllFarmerReportReturnType } from "@/types";
import { DateToYYMMDD } from "@/util/helper_function/reusableFunction";

export default async function Page() {
  let farmerReport: GetAllFarmerReportReturnType;

  try {
    farmerReport = await GetAllFarmerReport();
  } catch (error) {
    farmerReport = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  return (
    <>
      {!farmerReport.success ? (
        <RenderNotification notif={farmerReport.notifError} />
      ) : (
        <TableComponent
          noContentMessage="There's no farmer report that's been passed yet!!!"
          listCount={farmerReport.validatedReport.length}
          tableTitle="Farmer Reports"
          tableHeaderCell={
            <>
              <th scope="col">#</th>
              <th scope="col">Farmer Name</th>
              <th scope="col">Crop location</th>
              <th scope="col">Verified</th>
              <th scope="col">Organization Name</th>
              <th scope="col">Araw na ipinasa</th>
              <th scope="col">Araw na naganap</th>
              <th scope="col">Aksyon</th>
            </>
          }
          tableCell={
            <>
              {farmerReport.validatedReport.map((report, index) => (
                <tr key={report.reportId}>
                  <td className="text-gray-500">{index + 1}</td>

                  <td className=" text-gray-900 font-medium">
                    {report.farmerName}
                  </td>

                  <td className="text-gray-500">{report.cropIdReported}</td>

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
                    {report.orgName ? report.orgName : "Not in a Organization"}
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
            </>
          }
        />
      )}
    </>
  );
}
