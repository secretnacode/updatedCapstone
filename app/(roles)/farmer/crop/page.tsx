import { FarmerCropPage } from "@/component/client_component/cropComponent";
import {
  RedirectManager,
  RemoveSearchParamsVal,
  RenderNotification,
} from "@/component/client_component/fallbackComponent";
import {
  LatestReport,
  ReportCountPerCrop,
} from "@/component/server_component/componentForAllUser";
import { LoadingCard } from "@/component/server_component/customComponent";
import { GetMyCropInfo } from "@/lib/server_action/crop";
import { GetMyCropInfoReturnType, NotificationBaseType } from "@/types";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ addCrop?: boolean; notif?: string }>;
}) {
  const { notif } = await searchParams;
  let message: NotificationBaseType[] | null = null;
  if (notif) message = JSON.parse(notif);

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

          <div className="side-bar-wrapper [&_div.no-val]:flex [&_div.no-val]:flex-col [&_div.no-val]:items-center [&_div.no-val]:justify-center [&_div.no-val]:p-8 [&_div.no-val]:text-center [&_div.no-val]:border-2 [&_div.no-val]:border-dashed [&_div.no-val]:border-gray-300 [&_div.no-val]:rounded-lg [&_div.no-val]:bg-gray-50 [&_div.no-val]:max-w-sm [&_div.no-val]:mx-auto">
            <Suspense fallback={<LoadingCard />}>
              <ReportCountPerCrop />

              <LatestReport />
            </Suspense>
          </div>
        </div>
      )}

      {message && <RedirectManager data={message} />}
    </div>
  );
}
