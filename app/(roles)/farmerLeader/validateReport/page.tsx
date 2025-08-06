import {
  RedirectManager,
  RenderNotification,
} from "@/component/client_component/fallbackComponent";
import { ViewMemberReport } from "@/component/client_component/validateReportComponent";
import { GetOrgMemberReport } from "@/lib/server_action/report";
import { NotificationBaseType } from "@/types";
import { DateToYYMMDD } from "@/util/helper_function/reusableFunction";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  let message: NotificationBaseType[] | null = null;
  if (success) message = JSON.parse(success);

  console.log("validate reoport main component");
  const orgReport = await GetOrgMemberReport();

  const Notif = !orgReport.success ? (
    <RenderNotification notif={orgReport.notifError} />
  ) : null;

  return (
    <table className="w-full divide-y divide-gray-200 farmerReportTable">
      {message && <RedirectManager data={message} paramName="success" />}
      {Notif}
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
      </tbody>
    </table>
  );
}
