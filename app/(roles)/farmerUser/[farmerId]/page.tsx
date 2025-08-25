import { FarmerUserProfile } from "@/component/server_component/componentForAllUser";
import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { GetViewingFarmerUserProfileInfo } from "@/lib/server_action/farmerUser";
import { NotifToUriComponent } from "@/util/helper_function/reusableFunction";
import { redirect } from "next/navigation";
import { GetFarmerUserProfileInfoReturnType } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ farmerId: string }>;
}) {
  console.log(`farmer user profile`);
  let farmerData: GetFarmerUserProfileInfoReturnType;

  try {
    farmerData = await GetViewingFarmerUserProfileInfo((await params).farmerId);
  } catch (error) {
    const err = error as Error;
    farmerData = {
      success: false,
      notifError: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }

  if (!farmerData.success && farmerData.notMember)
    redirect(
      `/farmerLeader/orgMember?error=${NotifToUriComponent([
        {
          message: "Hindi mo miyembro and user",
          type: "error",
        },
        {
          message: "Hindi mo pedeng makita ang impormasyon",
          type: "error",
        },
      ])}`
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {!farmerData.success && farmerData.notifError && (
        <RenderNotification notif={farmerData.notifError} />
      )}
      {farmerData.success && (
        <div className="h-full space-y-5">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold">
              Personal na impormasyon ni:{" "}
              <span className="font-bold">
                {farmerData.farmerUserInfo.farmerFirstName}{" "}
                {farmerData.farmerUserInfo.farmerLastName}
              </span>
            </h1>
          </div>

          <FarmerUserProfile
            userFarmerInfo={farmerData.farmerUserInfo}
            isViewing={true}
          />
        </div>
      )}
    </div>
  );
}
