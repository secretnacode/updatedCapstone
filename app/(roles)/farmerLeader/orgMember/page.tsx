import {
  RedirectManager,
  RenderNotification,
} from "@/component/client_component/fallbackComponent";
import { FarmerOrgMemberAction } from "@/component/server_component/componentForAllUser";
import { TableComponent } from "@/component/server_component/customComponent";
import { GetFarmerOrgMember } from "@/lib/server_action/farmerUser";
import { GetFarmerOrgMemberReturnType, NotificationBaseType } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  console.log(`farmer org member main component`);
  let farmerMember: GetFarmerOrgMemberReturnType;
  const { error } = await searchParams;
  const message: NotificationBaseType[] | undefined = error
    ? JSON.parse(error)
    : undefined;

  try {
    farmerMember = await GetFarmerOrgMember();
  } catch (error) {
    farmerMember = {
      success: false,
      notifError: [
        {
          message: (error as Error).message,
          type: "error",
        },
      ],
    };
  }

  return (
    <>
      {!farmerMember.success ? (
        <RenderNotification notif={farmerMember.notifError} />
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
    </>
  );
}
