import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { FarmerUserProfile } from "@/component/server_component/componentForAllUser";
import { GetMyProfileInfo } from "@/lib/server_action/farmerUser";
import { GetMyProfileInfoReturnType } from "@/types";
import { UnexpectedErrorMessage } from "@/util/helper_function/reusableFunction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroFarm",
  description:
    "Profile page of the farmer where it will show all the personal data of the user, the user can also edit it",
  robots: { index: false, follow: false },
};

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
        <FarmerUserProfile
          userFarmerInfo={{
            farmerInfo: userInfo.farmerInfo,
            cropInfo: userInfo.cropInfo,
            orgInfo: userInfo.orgInfo,
          }}
          isViewing={false}
        />
      ) : (
        <RenderRedirectNotification notif={userInfo.notifError} />
      )}
    </div>
  );
}
