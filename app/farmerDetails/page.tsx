import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { FarmerDetailForm } from "@/component/client_component/farmerDetailsComponent";
import { newUserValNeedInfo } from "@/lib/server_action/user";
import { newUserValNeedInfoReturnType } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let newUserNeedInfo: newUserValNeedInfoReturnType;

  try {
    newUserNeedInfo = await newUserValNeedInfo();
  } catch (error) {
    console.log((error as Error).message);
    newUserNeedInfo = {
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
      {!newUserNeedInfo.success ? (
        <RenderNotification notif={newUserNeedInfo.notifError} />
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Impormasyon ng Magsasaka
            </h1>
          </div>

          <div>
            <FarmerDetailForm
              orgList={newUserNeedInfo.success ? newUserNeedInfo.orgList : []}
            />
          </div>
        </div>
      )}
    </div>
  );
}
