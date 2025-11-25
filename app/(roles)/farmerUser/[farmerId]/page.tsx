import { FarmerUserProfile } from "@/component/server_component/componentForAllUser";
import { GetViewingFarmerUserProfileInfo } from "@/lib/server_action/farmerUser";
import { GetFarmerUserProfileInfoReturnType } from "@/types";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { FC } from "react";
import { BackButton } from "@/component/client_component/componentForAllUser";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ farmerId: string }>;
  searchParams: Promise<{ isEng?: boolean }>;
}) {
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

  const eng = (await searchParams).isEng;

  const isEnglish: boolean = eng ? eng : false;

  const bannerColor = () => {
    if (!farmerData.success) return `from-green-700 to-green-500`;

    switch (farmerData.farmerInfo.status) {
      case "active":
        return `from-green-700 to-green-500`;
      case "block":
        return `from-amber-700 to-amber-500`;
      case "delete":
        return `from-red-700 to-red-500`;
    }
  };

  return farmerData.success ? (
    <div className="max-w-7xl mx-auto space-y-6">
      <BackButton label={isEnglish ? "Go back" : "Bumalik"} />

      <div className="h-full space-y-5">
        <div
          className={`bg-gradient-to-r ${bannerColor()} text-white p-6 rounded-lg shadow-sm`}
        >
          <h1 className="text-2xl font-semibold">
            <span>
              {isEnglish
                ? "Personal information of "
                : "Personal na impormasyon ni "}
            </span>

            <span className="font-bold">
              {farmerData.farmerInfo.farmerFirstName +
                " " +
                farmerData.farmerInfo.farmerLastName}
            </span>
          </h1>
        </div>

        <FarmerUserProfile
          userFarmerInfo={{
            farmerInfo: farmerData.farmerInfo,
            cropInfo: farmerData.cropInfo,
            orgInfo: farmerData.orgInfo,
          }}
          isViewing={true}
        />
      </div>
    </div>
  ) : (
    <>
      <NovalProfile isEnglish={isEnglish ?? false} />

      <RenderRedirectNotification notif={farmerData.notifError} />
    </>
  );
}

const NovalProfile: FC<{ isEnglish: boolean }> = ({ isEnglish }) => (
  <div className="h-full space-y-5">
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold">
        <span>{isEnglish ? "No user found" : "Hindi makita ang farmer"}</span>
      </h1>
    </div>

    <FarmerUserProfile
      userFarmerInfo={{
        farmerInfo: {
          farmerId: "",
          farmerFirstName: "",
          farmerAlias: "",
          mobileNumber: "",
          barangay: "",
          birthdate: new Date(),
          verified: false,
          farmerLastName: "",
          farmerMiddleName: "",
          farmerExtensionName: "",
          familyMemberCount: "",
          status: "delete",
        },
        cropInfo: [],
      }}
      isViewing={true}
    />
  </div>
);
