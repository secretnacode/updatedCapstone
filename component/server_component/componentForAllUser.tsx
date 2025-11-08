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
  getReportCountPerCropReturnType,
  getLatestReportReturnType,
  reportTypeStateType,
} from "@/types";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  ClipboardX,
  CloudOff,
  FileText,
  LucideIcon,
  MapPinHouse,
  Package,
  Pencil,
  Sprout,
  Wheat,
  WheatOff,
} from "lucide-react";
import { FC } from "react";
import { ViewCropModalButton } from "../client_component/cropComponent";
import {
  MyProfileForm,
  DeleteMyOrgMemberButton,
  MyOrganizationForm,
  ApprovedOrgMemberButton,
  PieChartCard,
} from "../client_component/componentForAllUser";
import { AvailableOrg } from "@/lib/server_action/org";
import Link from "next/link";
import {
  FormDivLabelInput,
  SeeAllValButton,
  TableComponent,
} from "./customComponent";
import {
  capitalizeFirstLetter,
  converTimeToAMPM,
  DateToYYMMDD,
  getInitials,
  makeWeatherIcon,
  ReadableDateFomat,
  translateWeatherConditionToTagalog,
  UnexpectedErrorMessage,
  viewFarmerReportPath,
} from "@/util/helper_function/reusableFunction";
import { getWeatherToday } from "@/lib/server_action/weather";
import Image from "next/image";
import {
  getLatestReport,
  getReportCountPerCrop,
} from "@/lib/server_action/report";
import { RenderRedirectNotification } from "../client_component/provider/notificationProvider";

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
      {!AvailOrg.success && (
        <RenderRedirectNotification notif={AvailOrg.notifError} />
      )}
      <div>
        {/* Profile Picture */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 min-h-fit">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <span className="text-4xl text-green-700 font-bold">
                {getInitials(
                  userFarmerInfo.farmerInfo.farmerFirstName,
                  userFarmerInfo.farmerInfo.farmerLastName
                )}
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
        <div className="component">
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
        <>
          <RenderRedirectNotification notif={currentWeather.notifError} />

          <div className="component">
            <div className="card-title-wrapper flex justify-start items-center gap-2">
              <CloudOff className="logo text-gray-500" />
              <p>{isEnglish ? "Weather Today" : "Panahon ngayon"}</p>
            </div>

            <div className="flex justify-between items-center py-4 text-center">
              <div className="w-full space-y-2">
                <AlertCircle className="h-8 w-8 mx-auto text-yellow-400" />

                <p className="text-lg font-bold">
                  {isEnglish ? "Data Unavailable" : "Walang Nakuhang Datos"}
                </p>

                <p className="text-sm text-gray-500">
                  {isEnglish
                    ? "Could not load current weather information."
                    : "Hindi makuha ang kasalukuyang impormasyon ng panahon."}
                </p>
              </div>
            </div>

            <div className="mt-4 very-small-text text-gray-500 flex justify-between items-center border-t border-gray-400 pt-2">
              <p>
                <span className="">
                  {isEnglish ? "Last check" : "Huling suri"}:{" "}
                </span>
                {isEnglish ? "N/A" : "Wala"}
              </p>
              <p>--:--</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const FarmerQuickActionComponent: FC = () => {
  return (
    <div className="component !p-0">
      <div className="card-title-wrapper">
        <p>Mabilisang Pag gawa</p>
      </div>

      <div className="flex flex-col space-y-4 [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:border [&>a]:rounded-md [&>a]:p-2">
        <Link
          href={`/farmer/report?addReport=true`}
          className="text-blue-700 border-blue-500 hover:bg-blue-50 hover:border-blue-800"
        >
          <FileText className="logo !size-5 " />
          <span>Mag gawa ng ulat</span>
        </Link>

        <Link
          href={"/farmer/crop?addCrop=true"}
          className="text-green-700 border-green-500 hover:bg-green-50 hover:border-green-800"
        >
          <Wheat className="logo !size-5  " />
          <span>Mag dagdag ng pananim</span>
        </Link>
      </div>
    </div>
  );
};

export const ReportCountPerCrop: FC = async () => {
  let reportCount: getReportCountPerCropReturnType;

  try {
    reportCount = await getReportCountPerCrop();
  } catch (error) {
    console.error((error as Error).message);
    reportCount = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  const NoValueInPieChart: FC<{ hasCrop?: boolean }> = ({
    hasCrop = false,
  }) => (
    <div className="no-val">
      {hasCrop ? (
        <ClipboardX className="!size-10 text-gray-400 mb-4" />
      ) : (
        <WheatOff className="!size-10 text-gray-400 mb-4" />
      )}

      <p className="text-xl font-semibold text-gray-700 mb-1">
        {hasCrop ? "Wala ka pang Ulat" : "Wala ka pang pananim"}
      </p>
    </div>
  );

  return (
    <div className="component ">
      <div className=" space-y-4">
        <div className="font-semibold">
          <p>Bilang ng ulat kada pananim</p>
        </div>

        {reportCount.success ? (
          reportCount.reportCountVal.length > 0 ? (
            <PieChartCard
              data={reportCount.reportCountVal.map((val) => ({
                id: val.cropId,
                value: val.reportCount,
                label: val.cropName,
              }))}
            />
          ) : (
            <NoValueInPieChart hasCrop={true} />
          )
        ) : (
          <>
            <RenderRedirectNotification notif={reportCount.notifError} />
            <NoValueInPieChart hasCrop={false} />
          </>
        )}
      </div>
    </div>
  );
};

export const ReportCountPerCropLoading = () => {
  return (
    <div className="space-y-4 component">
      <div className="font-semibold">
        <div className="h-4 w-48 div-loading" />
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 p-4 rounded-xl animate-pulse">
        <div className="h-40 w-40 div-loading" />

        <div className="flex flex-col space-y-2 w-full max-w-xs children-div-loading">
          <div className="h-3 w-full "></div>
          <div className="h-3 w-5/6 "></div>
        </div>
      </div>
    </div>
  );
};

export const LatestReport = async () => {
  let report: getLatestReportReturnType;

  try {
    report = await getLatestReport();
  } catch (error) {
    console.error((error as Error).message);
    report = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  const NoVal: FC = () => (
    <div className="no-val">
      <p className="text-gray-500">Wala ka pang ulat</p>

      <Link
        href={`/farmer/report?addCrop=true`}
        className="mt-4 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-150 flex justify-center items-center gap-3"
      >
        <Pencil className="logo" />

        <span>Mag ulat</span>
      </Link>
    </div>
  );

  const reportTypeIcon = (type: reportTypeStateType) => {
    switch (type) {
      case "damage":
        return <AlertTriangle className="logo" />;

      case "planting":
        return <Sprout className="logo" />;

      case "harvesting":
        return <Package className="logo" />;

      default:
        return <FileText className="logo" />;
    }
  };

  const reportTypeColor = (type: reportTypeStateType) => {
    switch (type) {
      case "damage":
        return "bg-red-100 text-red-700";

      case "planting":
        return "bg-green-100 text-green-700";

      case "harvesting":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4 component">
      <div className="font-semibold">
        <p>Huling ulat na naipasa</p>
      </div>

      <div>
        {report.success ? (
          report.reportVal.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {report.reportVal.map((val) => (
                <div
                  key={val.reportId}
                  className="hover:bg-gray-50 transition-all duration-200 group py-2"
                >
                  <div className="flex items-center justify-evenly gap-2">
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg ${reportTypeColor(
                        val.reportType
                      )} flex items-center justify-center`}
                    >
                      {reportTypeIcon(val.reportType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className="font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors leading-snug">
                          {val.title}
                        </h4>
                      </div>

                      <div className="flex justify-start items-center text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        <span>{ReadableDateFomat(val.dayReported)}</span>
                      </div>
                    </div>

                    <Link
                      href={viewFarmerReportPath(val.reportId)}
                      className="button submit-button slimer-button flex-shrink-0 ml-3 very-small"
                    >
                      Tingnan
                    </Link>
                  </div>
                </div>
              ))}

              <SeeAllValButton link="/farmer/report" />
            </div>
          ) : (
            <NoVal />
          )
        ) : (
          <>
            <RenderRedirectNotification notif={report.notifError} />
            <NoVal />
          </>
        )}
      </div>
    </div>
  );
};

export const LatestReportLoading = () => {
  const items = Array.from({ length: 3 });

  return (
    <div className="component space-y-4">
      <div className="font-semibold ">
        <div className="h-4 w-48 div-loading" />
      </div>

      <div>
        {items.map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex justify-between items-center py-2">
              <div className="flex flex-col justify-center items-start leading-4 w-1/2 space-y-1 children-div-loading">
                <div className="h-4 w-full" />

                <div className="h-3 w-3/4" />
              </div>

              <div className="h-6 w-16 div-loading" />
            </div>

            {index < items.length - 1 && (
              <div className="border-b border-gray-100 h-px bg-gray-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
