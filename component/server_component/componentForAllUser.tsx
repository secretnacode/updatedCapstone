import {
  AvailableOrgReturnType,
  GetFarmerUserProfileInfoQueryReturnType,
  DynamicLinkPropType,
} from "@/types";
import { MapPinHouse } from "lucide-react";
import { FC } from "react";
import { ViewCropModalButton } from "../client_component/cropComponent";
import {
  ApprovedButton,
  DeleteUser,
  UserProFileComponent,
} from "../client_component/componentForAllUser";
import { AvailableOrg } from "@/lib/server_action/org";
import { RenderNotification } from "../client_component/fallbackComponent";
import Link from "next/link";

export const FarmerUserProfile: FC<{
  userFarmerInfo: GetFarmerUserProfileInfoQueryReturnType;
  isViewing: boolean;
}> = async ({ userFarmerInfo, isViewing }) => {
  let AvailOrg: AvailableOrgReturnType;

  console.log(`Profile info component`);

  try {
    AvailOrg = await AvailableOrg();
  } catch (error) {
    AvailOrg = {
      success: false,
      errors: [{ message: (error as Error).message, type: "error" }],
    };
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Left Column - Profile Info */}
      {!AvailOrg.success && <RenderNotification notif={AvailOrg.errors} />}
      <div>
        {/* Profile Picture */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 min-h-fit">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <span className="text-4xl text-green-700 font-bold">
                {userFarmerInfo.farmerFirstName.charAt(0)}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {userFarmerInfo.farmerFirstName} {userFarmerInfo.farmerLastName}
              </h2>
              {userFarmerInfo.farmerAlias && (
                <p className="text-gray-500 text-sm">
                  &quot;{userFarmerInfo.farmerAlias}&quot;
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 text-gray-600">
              <MapPinHouse className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>Laguna, Calauan, {userFarmerInfo.barangay}</p>
            </div>

            {/* Verification Badge */}
            <div
              className={`rounded-lg p-3 text-center text-sm font-medium ${
                userFarmerInfo.verified
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {userFarmerInfo.verified
                ? "✓ Verified Account"
                : "⚠ Pending Verification"}
            </div>
          </div>

          {/* Crops Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Mga Pananim</h3>
            <div className="grid gap-2">
              <ViewCropModalButton
                cropId={userFarmerInfo.cropId}
                isViewing={isViewing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Detailed Info */}
      <div className="md:col-span-3 bg-white rounded-lg shadow-sm p-6">
        {AvailOrg.success && (
          <UserProFileComponent
            userFarmerInfo={{
              farmerFirstName: userFarmerInfo.farmerFirstName,
              farmerLastName: userFarmerInfo.farmerLastName,
              farmerAlias: userFarmerInfo.farmerAlias,
              mobileNumber: userFarmerInfo.mobileNumber,
              barangay: userFarmerInfo.barangay,
              birthdate: userFarmerInfo.birthdate,
              orgId: userFarmerInfo.orgId,
              orgRole: userFarmerInfo.orgRole,
              leaderName: userFarmerInfo.leaderName,
            }}
            isViewing={isViewing}
            orgList={AvailOrg.data}
          />
        )}
      </div>
    </div>
  );
};

export const FarmerOrgMemberAction: FC<{
  farmerId: string;
  verificationStatus: boolean;
  farmerName: string;
}> = ({ farmerId, verificationStatus, farmerName }) => {
  return (
    <div>
      <DynamicLink baseLink="farmerUser" dynamicId={farmerId} />

      <ApprovedButton
        farmerId={farmerId}
        verificationStatus={verificationStatus}
      />

      <DeleteUser farmerId={farmerId} farmerName={farmerName} />
    </div>
  );
};

export const DynamicLink: FC<DynamicLinkPropType> = ({
  baseLink,
  dynamicId,
  label = "Tingnan",
  className = "",
}) => {
  return (
    <Link
      className={`profile-link ${className}`}
      href={`/${baseLink}/${dynamicId}`}
    >
      {label}
    </Link>
  );
};
