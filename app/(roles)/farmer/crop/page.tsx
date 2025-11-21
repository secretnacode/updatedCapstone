import { FarmerCropPage } from "@/component/client_component/cropComponent";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import {
  LatestReport,
  LatestReportLoading,
  ReportCountPerCrop,
  ReportCountPerCropLoading,
} from "@/component/server_component/componentForAllUser";
import { GetMyCropInfo } from "@/lib/server_action/crop";
import { GetMyCropInfoReturnType, NotificationBaseType } from "@/types";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ notif?: string; addCrop?: string }>;
}) {
  const { notif, addCrop } = await searchParams;

  let message: NotificationBaseType[] | null = null;

  if (notif) message = JSON.parse(notif);

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
      {message && <RenderRedirectNotification notif={message} />}

      <div className="grid grid-cols-4 gap-4 h-full">
        <div className="col-span-3 h-full">
          {cropInfo.success ? (
            <FarmerCropPage
              myCropInfoList={cropInfo.myCropInfoList}
              addCrop={addCrop === "true"}
            />
          ) : (
            <>
              <RenderRedirectNotification notif={cropInfo.notifError} />
              <FarmerCropPage
                myCropInfoList={[]}
                addCrop={addCrop === "true"}
              />
            </>
          )}
        </div>

        <div className="side-bar-wrapper ">
          <Suspense fallback={<ReportCountPerCropLoading />}>
            <ReportCountPerCrop />
          </Suspense>

          <Suspense fallback={<LatestReportLoading />}>
            <LatestReport />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
