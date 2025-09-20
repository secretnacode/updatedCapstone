import { FarmerCropPage } from "@/component/client_component/cropComponent";
import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { GetMyCropInfo } from "@/lib/server_action/crop";
import { GetMyCropInfoReturnType } from "@/types";

export default async function Page() {
  let cropInfo: GetMyCropInfoReturnType;

  try {
    cropInfo = await GetMyCropInfo();
  } catch (error) {
    cropInfo = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  return (
    <>
      {!cropInfo.success ? (
        <RenderNotification notif={cropInfo.notifError} />
      ) : (
        <FarmerCropPage cropInfo={cropInfo.myCropInfoList} />
      )}
    </>
  );
}
