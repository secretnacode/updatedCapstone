import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { FarmerUserProfile } from "@/component/server_component/componentForAllUser";
import { GetMyProfileInfo } from "@/lib/server_action/farmerUser";
import { GetMyProfileInfoType } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let userInfo: GetMyProfileInfoType;

  try {
    userInfo = await GetMyProfileInfo();
  } catch (error) {
    userInfo = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  return (
    <div>
      {userInfo.success ? (
        <div className="h-full space-y-5">
          <FarmerUserProfile
            userFarmerInfo={userInfo.farmerInfo}
            isViewing={false}
          />
        </div>
      ) : (
        <RenderNotification notif={userInfo.notifError} />
      )}
    </div>
  );
}
