import {
  AvailableOrgReturnType,
  DynamicLinkPropType,
  GetAllOrgMemberListQueryReturnType,
  FarmerUserProfilePropType,
  UserProFileComponentPropType,
  UserProfileFormPropType,
  InputComponentPropType,
  UserOrganizationInfoFormPropType,
} from "@/types";
import { MapPinHouse } from "lucide-react";
import { FC } from "react";
import { ViewCropModalButton } from "../client_component/cropComponent";
import {
  ApprovedButton,
  ClientUserOrganizationInfoForm,
  ClientUserProfileForm,
  DeleteUser,
} from "../client_component/componentForAllUser";
import { AvailableOrg } from "@/lib/server_action/org";
import { RenderNotification } from "../client_component/fallbackComponent";
import Link from "next/link";
import {
  FormDivLabelInput,
  FormDivLabelSelect,
  TableComponent,
} from "./customComponent";
import {
  baranggayList,
  DateToYYMMDD,
} from "@/util/helper_function/reusableFunction";

export const FarmerUserProfile: FC<FarmerUserProfilePropType> = async ({
  userFarmerInfo,
  isViewing,
}) => {
  let AvailOrg: AvailableOrgReturnType;

  try {
    AvailOrg = await AvailableOrg();
  } catch (error) {
    AvailOrg = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Left Column - Profile Info */}
      {!AvailOrg.success && <RenderNotification notif={AvailOrg.notifError} />}
      <div>
        {/* Profile Picture */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 min-h-fit">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <span className="text-4xl text-green-700 font-bold">
                {userFarmerInfo.farmerInfo.farmerFirstName.charAt(0)}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {userFarmerInfo.farmerInfo.farmerFirstName}{" "}
                {userFarmerInfo.farmerInfo.farmerLastName}
              </h2>
              {userFarmerInfo.farmerInfo.farmerAlias && (
                <p className="text-gray-500 text-sm">
                  &quot;{userFarmerInfo.farmerInfo.farmerAlias}&quot;
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 text-gray-600">
              <MapPinHouse className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>Laguna, Calauan, {userFarmerInfo.farmerInfo.barangay}</p>
            </div>

            {/* Verification Badge */}
            <div
              className={`rounded-lg p-3 text-center text-sm font-medium ${
                userFarmerInfo.farmerInfo.verified
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {userFarmerInfo.farmerInfo.verified
                ? "✓ Verified Account"
                : "⚠ Pending Verification"}
            </div>
          </div>

          {/* Crops Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Mga Pananim</h3>
            <div className="grid gap-2">
              <ViewCropModalButton
                cropInfo={userFarmerInfo.cropInfo}
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
            userFarmerInfo={userFarmerInfo.farmerInfo}
            orgInfo={userFarmerInfo.orgInfo}
            orgList={AvailOrg.orgList}
            isViewing={isViewing}
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
      <DynamicLink
        baseLink="farmerUser"
        dynamicId={farmerId}
        className="profile-link-button-design"
      />

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
    <Link className={`button ${className}`} href={`/${baseLink}/${dynamicId}`}>
      {label}
    </Link>
  );
};

export const OrganizationMemberList: FC<{
  memberList: GetAllOrgMemberListQueryReturnType[];
}> = ({ memberList }) => {
  return (
    <TableComponent
      noContentMessage="There's no organization that was listed yet"
      listCount={memberList.length}
      tableTitle="Member of the organization"
      tableHeaderCell={
        <>
          <th>#</th>
          <th>Farmer Name</th>
          <th>Farmer Alias</th>
          <th>Barangay</th>
          <th>Organization Role</th>
          <th>Verifieed</th>
          <th>Actions</th>
        </>
      }
      tableCell={
        <>
          {memberList.map((member, index) => (
            <tr key={member.farmerId}>
              <td>{index + 1}</td>
              <td>{member.farmerName}</td>
              <td>{member.farmerAlias}</td>
              <td>{member.barangay}</td>
              <td>{member.orgRole}</td>
              <td>
                <span
                  className={`table-verify-cell ${
                    member.verified ? "table-verified" : "table-unverified"
                  }`}
                >
                  {member.verified ? "Verified" : "Unverified"}
                </span>
              </td>
              <td>
                <div className="table-action">
                  <DynamicLink
                    baseLink="farmerUser"
                    dynamicId={member.farmerId}
                    label="View Profile"
                    className="profile-link-button-design"
                  />
                </div>
              </td>
            </tr>
          ))}
        </>
      }
    />
  );
};

//FIX: add sexual of the user
export const UserProFileComponent: FC<UserProFileComponentPropType> = ({
  userFarmerInfo,
  orgInfo,
  orgList,
  isViewing,
}) => {
  return (
    <div className="div">
      <div className="div grid gap-6">
        {isViewing ? (
          <>
            <UserProfileForm
              isViewing={isViewing}
              userFarmerInfo={userFarmerInfo}
            />

            <UserOrganizationInfoForm
              isViewing={isViewing}
              userOrgInfo={orgInfo}
            />
          </>
        ) : (
          <>
            <ClientUserProfileForm
              isViewing={isViewing}
              userFarmerInfo={userFarmerInfo}
            />

            <ClientUserOrganizationInfoForm
              isViewing={isViewing}
              availOrgList={orgList}
              userOrgInfo={orgInfo}
            />
          </>
        )}
      </div>
    </div>
  );
};

export const UserProfileForm: FC<UserProfileFormPropType> = (
  profileFormProp
) => {
  const InputComponent: FC<InputComponentPropType> = ({
    inputType = "text",
    labelMessage,
    inputName,
    inputPlaceholder,
  }) =>
    profileFormProp.isViewing ? (
      <FormDivLabelInput
        labelMessage={labelMessage}
        inputName={inputName}
        inputType={inputType}
        inputPlaceholder={inputPlaceholder}
        inputDisable={profileFormProp.isViewing}
        inputDefaultValue={String(profileFormProp.userFarmerInfo?.[inputName])}
      />
    ) : (
      <FormDivLabelInput
        labelMessage={labelMessage}
        inputName={inputName}
        inputType={inputType}
        inputPlaceholder={inputPlaceholder}
        inputDisable={profileFormProp.isViewing}
        inputValue={
          inputName !== "birthdate"
            ? String(profileFormProp.userInfoState?.[inputName])
            : profileFormProp.userInfoState?.[inputName] instanceof Date &&
              profileFormProp.userInfoState?.[inputName]
            ? DateToYYMMDD(profileFormProp.userInfoState?.[inputName])
            : String(profileFormProp.userInfoState?.[inputName])
        }
        formError={profileFormProp.formError?.[inputName]}
        onChange={profileFormProp.handleChangeState}
      />
    );

  const SelectComponent: FC = () =>
    profileFormProp.isViewing ? (
      <FormDivLabelSelect
        labelMessage="Baranggay na tinitirhan"
        selectName={"barangay"}
        childrenOption={<></>}
        selectDisable={profileFormProp.isViewing}
        selectDefaultValue={profileFormProp.userFarmerInfo?.barangay}
      />
    ) : (
      <FormDivLabelSelect
        labelMessage="Baranggay na tinitirhan"
        selectName={"barangay"}
        childrenOption={baranggayList.map((brgy) => (
          <option key={brgy} value={brgy}>
            {brgy.charAt(0).toUpperCase() + brgy.slice(1)}
          </option>
        ))}
        selectValue={profileFormProp.userInfoState?.barangay}
        formError={profileFormProp.formError?.barangay}
        onChange={profileFormProp.handleChangeState}
      />
    );

  return (
    <>
      <h1 className="title form-title">Pangalan</h1>

      <div className="form-div grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <InputComponent
          labelMessage="Unang Pangalan"
          inputName={"farmerFirstName"}
          inputPlaceholder="e.g. Jose"
        />

        <InputComponent
          labelMessage="Gitnang Pangalan"
          inputName={"farmerMiddleName"}
          inputPlaceholder="e.g. Luzviminda"
        />

        <InputComponent
          inputName={"farmerLastName"}
          inputPlaceholder="e.g. Juan Delacruz"
          labelMessage="Apelyido"
        />

        <InputComponent
          labelMessage="Palayaw na pagdugtong"
          inputName={"farmerExtensionName"}
          inputPlaceholder="e.g. Jr."
        />

        <InputComponent
          labelMessage="Alyas"
          inputName={"farmerAlias"}
          inputPlaceholder="e.g. Mang Kanor"
        />

        {/* WALA PA NITO SA DATABASE */}
        <FormDivLabelInput
          labelMessage="Kasarian"
          inputDisable={profileFormProp.isViewing}
          inputName={"farmerSex"}
          inputDefaultValue={`wala pang nakalagay sa database`}
          inputPlaceholder="e.g. lalaki"
        />

        <SelectComponent />

        <InputComponent
          labelMessage="Numero ng Telepono"
          inputName={"mobileNumber"}
          inputPlaceholder="09** *** ****"
        />

        <InputComponent
          labelMessage="Kapanganakan"
          inputType="date"
          inputName={"birthdate"}
        />
      </div>
    </>
  );
};

export const UserOrganizationInfoForm: FC<UserOrganizationInfoFormPropType> = (
  orgFormProp
) => {
  const SelectComponent: FC = () =>
    orgFormProp.isViewing ? (
      <FormDivLabelSelect
        labelMessage={"Pangalan ng Organisasyon"}
        selectName={"orgId"}
        selectDisable={orgFormProp.isViewing}
        selectDefaultValue={orgFormProp.userOrgInfo.orgId}
        childrenOption={<></>}
      />
    ) : (
      <FormDivLabelSelect
        labelMessage={"Pangalan ng Organisasyon"}
        selectName={"orgId"}
        selectOrganization={true}
        selectValue={orgFormProp.orgInfo.orgId ?? ""}
        onChange={orgFormProp.handleUserOrgChange}
        selectDisable={orgFormProp.isViewing}
        childrenOption={orgFormProp.availOrgList.map((org) => (
          <option key={org.orgId} value={org.orgId}>
            {org.orgName.charAt(0).toUpperCase() + org.orgName.slice(1)}
          </option>
        ))}
        formError={orgFormProp.formError?.orgId}
      />
    );

  return (
    <>
      <h1 className="title text-lg font-semibold text-gray-900 mb-4">
        Organisasyon na kasali
      </h1>
      <div className="form-div grid sm:grid-cols-2 gap-4">
        <SelectComponent />

        {!orgFormProp.isViewing && orgFormProp.otherOrg && (
          <FormDivLabelInput
            labelMessage="Mag lagay ng panibagong organisasyon"
            inputName={"otherOrgName"}
            inputValue={orgFormProp.orgInfo.otherOrgName ?? ""}
            inputPlaceholder="e.g. Kataniman"
            onChange={orgFormProp.handleUserOrgChange}
            formError={orgFormProp.formError?.otherOrgName}
          />
        )}

        <FormDivLabelInput
          labelMessage="Leader ng Organisasyon"
          inputDisable={true}
          inputName={"leaderName"}
          inputDefaultValue={orgFormProp.userOrgInfo.farmerLeader}
          inputPlaceholder="Miyembro"
        />

        <FormDivLabelInput
          labelMessage="Posisyon"
          inputDisable={true}
          inputName={"orgRole"}
          inputDefaultValue={orgFormProp.userOrgInfo.orgRole}
          inputPlaceholder="Miyembro"
        />
      </div>
    </>
  );
};
