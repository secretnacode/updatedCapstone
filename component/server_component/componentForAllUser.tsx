import { GetFarmerUserProfileInfoQueryReturnType } from "@/types";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";
import { MapPinHouse } from "lucide-react";
import { FC } from "react";
import { ViewCropModalButton } from "../client_component/cropComponent";

export const FarmerUserProfile: FC<{
  userFarmerInfo: GetFarmerUserProfileInfoQueryReturnType;
  isViewing: boolean;
}> = ({ userFarmerInfo, isViewing }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Left Column - Profile Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Profile Picture */}
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
                &QueryAvailableOrgReturnType;{userFarmerInfo.farmerAlias}&quot;
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
          <div className="grid grid-cols-2 gap-2">
            {userFarmerInfo.cropid.split(", ").map((crop) => (
              <ViewCropModalButton
                key={crop}
                cropId={crop}
                isViewing={isViewing}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Detailed Info */}
      <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <div className="grid gap-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <InputGroup
              label="Unang Pangalan"
              value={userFarmerInfo.farmerFirstName}
              disabled={isViewing}
            />
            <InputGroup
              label="Apelyido"
              value={userFarmerInfo.farmerLastName}
              disabled={isViewing}
            />
            <InputGroup
              label="Numero ng Telepono"
              value={userFarmerInfo.mobileNumber}
              disabled={isViewing}
            />
            <InputGroup
              label="Kapanganakan"
              value={ReadableDateFomat(userFarmerInfo.birthdate)}
              disabled={isViewing}
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Impormasyon ng Organisasyon
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <InputGroup
                label="Pangalan ng Organisasyon"
                value={userFarmerInfo.orgName}
                disabled={isViewing}
              />
              <InputGroup
                label="Leader ng Organisasyon"
                value={userFarmerInfo.leaderName}
                disabled={isViewing}
              />
              <InputGroup
                label="Posisyon"
                value={userFarmerInfo.orgRole}
                disabled={isViewing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup: FC<{
  label: string;
  value: string;
  disabled: boolean;
}> = ({ label, value, disabled }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      disabled={disabled}
      value={value}
      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 disabled:text-gray-500"
    />
  </div>
);
