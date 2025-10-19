import {
  AvailableOrgReturnType,
  DynamicLinkPropType,
  GetAllOrgMemberListQueryReturnType,
  FarmerUserProfilePropType,
  UserProFilePropType,
  ViewUserProfileFormPropType,
  UserOrganizationInfoFormPropType,
  WeatherComponentPropType,
  getWeatherTodayReturnType,
} from "@/types";
import { ClipboardPlus, LucideIcon, MapPinHouse, Wheat } from "lucide-react";
import { FC } from "react";
import { ViewCropModalButton } from "../client_component/cropComponent";
import {
  MyProfileForm,
  DeleteMyOrgMemberButton,
  MyOrganizationForm,
  ApprovedOrgMemberButton,
} from "../client_component/componentForAllUser";
import { AvailableOrg } from "@/lib/server_action/org";
import { RenderNotification } from "../client_component/fallbackComponent";
import Link from "next/link";
import { FormDivLabelInput, TableComponent } from "./customComponent";
import {
  capitalizeFirstLetter,
  converTimeToAMPM,
  DateToYYMMDD,
  makeWeatherIcon,
  ReadableDateFomat,
  translateWeatherConditionToTagalog,
  UnexpectedErrorMessage,
} from "@/util/helper_function/reusableFunction";
import { getWeatherToday } from "@/lib/server_action/weather";
import Image from "next/image";

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
          <UserProFile
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
    <div className="flex flex-row justify-center items-center gap-2">
      <DynamicLink baseLink="farmerUser" dynamicId={farmerId} />

      <ApprovedOrgMemberButton
        farmerId={farmerId}
        verificationStatus={verificationStatus}
      />

      <DeleteMyOrgMemberButton farmerId={farmerId} farmerName={farmerName} />
    </div>
  );
};

/**
 * dynamic button component for farmer leader and agriculturist only
 * this button can take the user to profile of the farmer(agriculturist and leader) and agriculturist/organization/[orgId](agriculturist only)
 * @param param0
 * @returns
 */
export const DynamicLink: FC<DynamicLinkPropType> = ({
  baseLink,
  dynamicId,
  label = "Tingnan",
  className = "",
}) => {
  const style = baseLink === "farmerUser" ? "profile-link-button-design" : "";
  return (
    <Link
      className={`button slimer-button ${style} ${className}`}
      href={`/${baseLink}/${dynamicId}`}
    >
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
export const UserProFile: FC<UserProFilePropType> = ({
  userFarmerInfo,
  orgInfo,
  orgList,
  isViewing,
}) => {
  return (
    <div className="div">
      <div className="div grid gap-6">
        <div>
          <h1 className="title form-title">Personal na impormasyon</h1>

          <div className="user-profile-form">
            {isViewing ? (
              <ViewUserProfileInfo userInfo={userFarmerInfo} />
            ) : (
              <MyProfileForm userInfo={userFarmerInfo} />
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h1 className="title text-lg font-semibold text-gray-900 mb-4">
            Organisasyon na kasali
          </h1>

          <div className="form-div grid sm:grid-cols-2 gap-4">
            {isViewing ? (
              <ViewUserOrganizationInfo userOrgInfo={orgInfo} />
            ) : (
              <MyOrganizationForm
                availOrgList={orgList}
                userOrgInfo={orgInfo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ViewUserProfileInfo: FC<ViewUserProfileFormPropType> = ({
  userInfo,
}) => {
  console.log(userInfo);
  return (
    <>
      <FormDivLabelInput
        labelMessage={"Unang Pangalan"}
        inputName={"farmerFirstName"}
        inputPlaceholder={"Hal. Jose"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerFirstName}
      />

      <FormDivLabelInput
        labelMessage={"Gitnang Pangalan"}
        inputName={"farmerMiddleName"}
        inputPlaceholder={"Hal. Luzviminda"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerMiddleName}
      />

      <FormDivLabelInput
        labelMessage={"Apelyido"}
        inputName={"farmerLastName"}
        inputPlaceholder={"Hal. Juan Delacruz"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerLastName}
      />

      <FormDivLabelInput
        labelMessage={"Palayaw na pagdugtong"}
        inputName={"farmerExtensionName"}
        inputPlaceholder={"Hal. Jr"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerExtensionName}
      />

      <FormDivLabelInput
        labelMessage={"Alyas"}
        inputName={"farmerAlias"}
        inputPlaceholder={"Hal. Mang Kanor"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerAlias}
      />

      {/* WALA PA NITO SA DATABASE */}
      <FormDivLabelInput
        labelMessage="Kasarian"
        inputDisable={true}
        inputName={"farmerSex"}
        inputDefaultValue={`wala pang nakalagay sa database`}
        inputPlaceholder="Hal. lalaki"
      />

      <FormDivLabelInput
        labelMessage={"Baranggay na tinitirhan"}
        inputName={"barangay"}
        inputPlaceholder={"Hal. Silangan"}
        inputDisable={true}
        inputDefaultValue={capitalizeFirstLetter(userInfo.barangay)}
      />

      <FormDivLabelInput
        labelMessage={"Numero ng Telepono"}
        inputName={"mobileNumber"}
        inputPlaceholder={"Hal. 09** *** ****"}
        inputDisable={true}
        inputDefaultValue={userInfo.mobileNumber}
      />

      <FormDivLabelInput
        labelMessage={"Kapanganakan"}
        inputName={"birthdate"}
        inputDisable={true}
        inputDefaultValue={
          userInfo.birthdate instanceof Date
            ? DateToYYMMDD(userInfo.birthdate)
            : String(userInfo.birthdate)
        }
      />
    </>
  );
};

export const ViewUserOrganizationInfo: FC<UserOrganizationInfoFormPropType> = ({
  userOrgInfo,
}) => {
  return (
    <>
      <FormDivLabelInput
        labelMessage="Pangalan ng Organisasyon"
        inputDisable={true}
        inputName={"orgId"}
        inputDefaultValue={userOrgInfo.orgName}
        inputPlaceholder="Pangalan ng organisasyon"
      />

      <FormDivLabelInput
        labelMessage="Leader ng Organisasyon"
        inputDisable={true}
        inputName={"leaderName"}
        inputDefaultValue={userOrgInfo.farmerLeader}
        inputPlaceholder="Miyembro"
      />

      <FormDivLabelInput
        labelMessage="Posisyon"
        inputDisable={true}
        inputName={"orgRole"}
        inputDefaultValue={userOrgInfo.orgRole}
        inputPlaceholder="Miyembro"
      />
    </>
  );
};

export const WeatherComponent: FC<WeatherComponentPropType> = async ({
  userLocation,
  user,
}) => {
  let currentWeather: getWeatherTodayReturnType;

  try {
    currentWeather = await getWeatherToday(userLocation);
  } catch (error) {
    console.log(error as Error);
    currentWeather = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  const isEnglish = user === "admin" || user === "agriculturist";

  let WeatherIcon: LucideIcon | undefined = undefined;

  if (currentWeather.success)
    WeatherIcon = makeWeatherIcon({
      code: currentWeather.weatherData.condition.code,
      isDay: currentWeather.weatherData.is_day,
    });

  return (
    <>
      {currentWeather.success ? (
        <div className=" bg-gray-500">
          <div className="card-title-wrapper flex justify-start items-center gap-2">
            {WeatherIcon && <WeatherIcon />}
            <p>{isEnglish ? "Weather Today" : "Panahon ngayon"}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="card-value">
                {currentWeather.weatherData.temp_c}°C
              </p>
              <p className="card-label">
                {translateWeatherConditionToTagalog(
                  currentWeather.weatherData.condition.text,
                  isEnglish
                )}
              </p>
            </div>

            <Image
              src={`https:${currentWeather.weatherData.condition.icon}`}
              alt="weather image"
              width={50}
              height={50}
              className="[image-rendering:crisp-edges]"
            />
          </div>

          <div className="mt-4 very-small-text text-gray-600 flex justify-between items-center">
            <p>
              <span className="">{isEnglish ? "Now" : "Ngayong"}: </span>
              {ReadableDateFomat(
                new Date(currentWeather.weatherData.last_updated.split(" ")[0])
              )}
            </p>

            <p>
              {converTimeToAMPM(
                currentWeather.weatherData.last_updated.split(" ")[1]
              )}
            </p>
          </div>
        </div>
      ) : (
        <RenderNotification notif={currentWeather.notifError} />
      )}
    </>
  );
};

export const FarmerQuickActionComponent: FC = () => {
  return (
    <div>
      <div className="card-title-wrapper">
        <p>Mabilisang Pag gawa</p>
      </div>

      <div className="flex flex-col space-y-4 [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:border [&>a]:border-gray-300 [&>a]:hover:bg-gray-100 [&>a]:rounded-md [&>a]:p-2">
        <Link href={`/farmer/report`}>
          <ClipboardPlus className="logo !size-5" />
          <span>Mag gawa ng ulat</span>
        </Link>

        <Link href={"/farmer/crop"}>
          <Wheat className="logo !size-5" />
          <span>Mag dagdag ng pananim</span>
        </Link>
      </div>
    </div>
  );
};
