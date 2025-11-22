import { AllFarmerCrop } from "@/component/client_component/cropComponent";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import {
  CropCountPerBrgy,
  CropStatusCount,
  ReportCountPerCropLoading,
} from "@/component/server_component/componentForAllUser";
import { GetAllCropInfo } from "@/lib/server_action/crop";
import { GetAllCropInfoReturnType } from "@/types";
import { UnexpectedErrorMessageEnglish } from "@/util/helper_function/reusableFunction";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page() {
  let cropVal: GetAllCropInfoReturnType;

  try {
    cropVal = await GetAllCropInfo();
  } catch (error) {
    console.log((error as Error).message);

    cropVal = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessageEnglish(), type: "error" }],
    };
  }

  return (
    <div>
      {!cropVal.success ? (
        <RenderRedirectNotification notif={cropVal.notifError} />
      ) : (
        <div className="grid grid-cols-4 gap-5">
          <div className="col-span-3">
            <AllFarmerCrop cropInfo={cropVal.allCropInfo} />
          </div>

          <div className="side-bar-wrapper ">
            <Suspense fallback={<ReportCountPerCropLoading />}>
              <CropCountPerBrgy />
            </Suspense>

            <Suspense fallback={<ReportCountPerCropLoading />}>
              <CropStatusCount />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
