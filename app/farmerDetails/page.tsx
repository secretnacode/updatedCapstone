import { FarmerDetailForm } from "@/component/client_component/farmerDetailsComponent";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { newUserValNeedInfo } from "@/lib/server_action/user";
import { newUserValNeedInfoReturnType } from "@/types";
import { User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroFarm",
  description:
    "Page for new user where the user will add their personal information",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  let newUserNeedInfo: newUserValNeedInfoReturnType;

  try {
    newUserNeedInfo = await newUserValNeedInfo();
  } catch (error) {
    console.log((error as Error).message);
    newUserNeedInfo = {
      success: false,
      notifError: [
        {
          message:
            "May nang yaring hindi inaasahan habang kinukuha ang listahan ng organisasyon",
          type: "error",
        },
      ],
    };
  }
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-800/10 mb-4">
            <User className="w-8 h-8 text-green-800" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">
            Impormasyon ng Magsasaka
          </h1>

          <p className="text-gray-700 mt-2">
            Punan ang mga impormasyon sa ibaba upang makumpleto ang iyong
            rehistrasyon
          </p>
        </div>

        {!newUserNeedInfo.success ? (
          <>
            <RenderRedirectNotification notif={newUserNeedInfo.notifError} />
            <FarmerDetailForm orgList={[]} />
          </>
        ) : (
          <FarmerDetailForm orgList={newUserNeedInfo.orgList} />
        )}
      </div>
    </div>
  );
}
