import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { FarmerUserProfile } from "@/component/server_component/componentForAllUser";
import { GetMyProfileInfo } from "@/lib/server_action/farmerUser";
import { GetMyProfileInfoReturnType } from "@/types";
import { UnexpectedErrorMessage } from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

export default async function Page() {
  let userInfo: GetMyProfileInfoReturnType;

  try {
    userInfo = await GetMyProfileInfo();
  } catch (error) {
    console.log((error as Error).message);
    userInfo = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  return (
    <div>
      {userInfo.success ? (
        <div className="h-full space-y-5">
          <FarmerUserProfile
            userFarmerInfo={{
              farmerInfo: userInfo.farmerInfo,
              cropInfo: userInfo.cropInfo,
              orgInfo: userInfo.orgInfo,
            }}
            isViewing={false}
          />
        </div>
      ) : (
        <RenderRedirectNotification notif={userInfo.notifError} />
      )}
    </div>
  );
}
