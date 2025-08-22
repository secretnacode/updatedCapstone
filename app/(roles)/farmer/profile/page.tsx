import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { FarmerUserProfile } from "@/component/server_component/componentForAllUser";
import { GetMyProfileInfo } from "@/lib/server_action/farmerUser";
import { GetMyProfileInfoType } from "@/types";

export default async function Page() {
  let userInfo: GetMyProfileInfoType;
  console.log(`Profile main component`);

  try {
    userInfo = await GetMyProfileInfo();
  } catch (error) {
    const err = error as Error;
    userInfo = {
      success: false,
      notifError: [{ message: err.message, type: "error" }],
    };
  }

  console.log(userInfo);

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
