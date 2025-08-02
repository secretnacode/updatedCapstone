import { RedirectManager } from "@/component/client_component/fallbackComponent";
import { AddReportComponent } from "@/component/client_component/reportComponent";
import { GetFarmerCrop } from "@/lib/server_action/crop";
import { GetFarmerReport } from "@/lib/server_action/report";
import { NotificationBaseType } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ success: string }>;
}) {
  const { success } = await searchParams;
  let message: NotificationBaseType[] | undefined = undefined;

  if (success) message = JSON.parse(success);

  console.log("Report main component");
  // const report = await GetFarmerReport();
  // const crop = await GetFarmerCrop();
  return (
    <main className="bg-gray-400">
      <AddReportComponent />
      {message && <RedirectManager data={message} paramName="success" />}
      <table>
        <caption>Ang iyong mga report</caption>
        <thead>
          <tr>
            <th>reportId</th>
            <th>Pamagat ng ulat</th>
            <th>Pangalan ng pananim</th>
            <th></th>
            <th>Araw na ipinasa</th>
            <th>Araw na naganap</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
