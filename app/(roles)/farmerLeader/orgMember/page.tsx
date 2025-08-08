import {
  RedirectManager,
  RenderNotification,
} from "@/component/client_component/fallbackComponent";
import { FarmerOrgMemberAction } from "@/component/client_component/farmerLeaderComponent";
import { GetFarmerOrgMember } from "@/lib/server_action/farmerUser";
import { NotificationBaseType } from "@/types";
import { ClipboardX } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  console.log(`farmer org member main component`);
  const farmerMember = await GetFarmerOrgMember();
  const { success } = await searchParams;
  const message: NotificationBaseType[] | undefined = success
    ? JSON.parse(success)
    : undefined;

  return (
    <div className="p-8">
      {message && <RedirectManager data={message} paramName="success" />}
      {!farmerMember.success && (
        <RenderNotification notif={farmerMember.notifError} />
      )}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Miyembro sa iyong organisasyon
          </h1>
        </div>

        {farmerMember.success && farmerMember.farmerMember.length === 0 ? (
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
                    <th scope="col">Pangalan ng magsasaka</th>
                    <th scope="col">Alyas ng magsasaka</th>
                    <th scope="col">Numero ng telepono</th>
                    <th scope="col">Baranggay na tinitirhan</th>
                    <th scope="col">Estado account</th>
                    <th scope="col">Bilang ng pananim</th>
                    <th scope="col">Aksyon</th>
                  </tr>
                </thead>
                <tbody>
                  {farmerMember.success &&
                    farmerMember.farmerMember.map((farmer, index) => (
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
                          <FarmerOrgMemberAction farmerId={farmer.farmerId} />
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
