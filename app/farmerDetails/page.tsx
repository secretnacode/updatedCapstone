import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { FarmerDetailForm } from "@/component/client_component/farmerDetailsComponent";
import { AvailableOrg } from "@/lib/server_action/org";
import { AvailableOrgReturnType } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let availbaleOrg: AvailableOrgReturnType;

  try {
    availbaleOrg = await AvailableOrg();
  } catch (error) {
    console.log((error as Error).message);
    availbaleOrg = {
      success: false,
      notifError: [
        {
          message:
            "May nang yaring hindi inaasahan habang kinukuha ang listahan ng organisasyon",
          type: "error",
        },
      ],
    };
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-6 lg:p-8">
      {!availbaleOrg.success && (
        <RenderNotification notif={availbaleOrg.notifError} />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Impormasyon ng Magsasaka
          </h1>
        </div>

        <div>
          <FarmerDetailForm
            orgList={availbaleOrg.success ? availbaleOrg.orgList : []}
          />
        </div>
      </div>
    </div>
  );
}
