import {
  RemoveSearchParamsVal,
  RenderNotification,
} from "@/component/client_component/fallbackComponent";
import {
  AddReportComponent,
  ViewUserReportButton,
} from "@/component/client_component/reportComponent";
import {
  TableComponent,
  TableComponentLoading,
} from "@/component/server_component/customComponent";
import { GetFarmerReport } from "@/lib/server_action/report";
import { GetFarmerReportReturnType, reportTypeStateType } from "@/types";
import {
  capitalizeFirstLetter,
  DateToYYMMDD,
} from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ addReport?: boolean }>;
}) {
  const isAddingReport = (await searchParams).addReport;

  let report: GetFarmerReportReturnType;

  try {
    report = await GetFarmerReport();
  } catch (error) {
    report = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  const handleReportStatus = (type: reportTypeStateType) => {
    const colorScheme = () => {
      switch (type) {
        case "damage":
          return "bg-red-100 text-red-800";

        case "harvesting":
          return "bg-amber-100 text-amber-800";

        case "planting":
          return "bg-green-100 text-green-800";

        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span
        className={`px-3 py-1 rounded-2xl very-small-text ${colorScheme()}`}
      >
        {capitalizeFirstLetter(type)}
      </span>
    );
  };

  return (
    <div className="component">
      <div className="max-w-7xl mx-auto space-y-6">
        {!report.success ? (
          <>
            <RenderNotification notif={report.notifError} />
            <TableComponentLoading />
          </>
        ) : (
          <>
            {isAddingReport && <RemoveSearchParamsVal name={"addReport"} />}

            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Aking mga ulat
              </h1>

              <AddReportComponent openModal={isAddingReport} />
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
                          {DateToYYMMDD(new Date(report.dayReported))}
                        </td>

                        <td className="text-gray-500">
                          {DateToYYMMDD(new Date(report.dayHappen))}
                        </td>

                        <td scope="col">
                          {handleReportStatus(report.reportType)}
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
