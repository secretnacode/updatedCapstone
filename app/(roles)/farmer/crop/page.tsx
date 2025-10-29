import { FarmerCropPage } from "@/component/client_component/cropComponent";
import {
  RemoveSearchParamsVal,
  RenderNotification,
} from "@/component/client_component/fallbackComponent";
import {
  LatestReport,
  ReportCountPerCrop,
} from "@/component/server_component/componentForAllUser";
import { LoadingCard } from "@/component/server_component/customComponent";
import { GetMyCropInfo } from "@/lib/server_action/crop";
import { GetMyCropInfoReturnType } from "@/types";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ addCrop?: boolean }>;
}) {
  const isAddingCrop = (await searchParams).addCrop;

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
    <div>
      {!cropInfo.success ? (
        <RenderNotification notif={cropInfo.notifError} />
      ) : (
        <div className="grid grid-cols-4 gap-4 h-full">
          {isAddingCrop && <RemoveSearchParamsVal name={"addCrop"} />}
          <div className="col-span-3 h-full">
            <FarmerCropPage
              myCropInfoList={cropInfo.myCropInfoList}
              addCrop={isAddingCrop}
            />
          </div>

          <div className="side-bar-wrapper">
            <Suspense fallback={<LoadingCard />}>
              <ReportCountPerCrop />

              <LatestReport />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
