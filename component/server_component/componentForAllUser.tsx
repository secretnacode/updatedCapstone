import {
  AvailableOrgReturnType,
  DynamicLinkPropType,
  FarmerUserProfilePropType,
  UserProFilePropType,
  ViewUserProfileFormPropType,
  UserOrganizationInfoFormPropType,
  WeatherComponentPropType,
  getWeatherTodayReturnType,
  getReportCountPerCropReturnType,
  getLatestReportReturnType,
  reportTypeStateType,
  getCropCountPerBrgyReturnType,
  getCropStatusCountReturnType,
  cropStatusType,
  viewUserCropInfoPropType,
  farmerOrgMemberActionPropType,
} from "@/types";
import {
  AlertCircle,
  AlertTriangle,
  Building,
  Calendar,
  CalendarDays,
  CircleCheck,
  CircleX,
  CloudOff,
  FileText,
  KeyRound,
  LucideIcon,
  MapPinHouse,
  MapPinIcon,
  Package,
  Pencil,
  Phone,
  Ruler,
  Sprout,
  TriangleAlert,
  User,
  UserX,
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
  ChangeMyPassword,
  BackButton,
  BlockMyOrgMemberButton,
  UnblockMyOrgMemberButton,
} from "../client_component/componentForAllUser";
import { AvailableOrg } from "@/lib/server_action/org";
import Link from "next/link";
import { FormDivLabelInput, SeeAllValButton } from "./customComponent";
import {
  accountStatusStyle,
  capitalizeFirstLetter,
  converTimeToAMPM,
  DateToYYMMDD,
  determineCropStatus,
  getInitials,
  makeWeatherIcon,
  pathCropAddingCrop,
  ReadableDateFormat,
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
import {
  getCropCountPerBrgy,
  getCropStatusCount,
} from "@/lib/server_action/crop";

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

  const isEnglish: boolean = AvailOrg.success
    ? AvailOrg.work === "admin" || AvailOrg.work === "agriculturist"
    : false;

  const logoColor = () => {
    switch (userFarmerInfo.farmerInfo.status) {
      case "active":
        return `from-green-200 to-green-400 text-green-700`;
      case "block":
        return `from-amber-200 to-amber-400 text-amber-700`;
      case "delete":
        return `from-red-200 to-red-400 text-red-700`;
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-4 gap-6">
        <div>
          <div className="sticky top-[105px] space-y-5">
            {!isViewing && (
              <BackButton label={isEnglish ? "Go back" : "Bumalik"} />
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 min-h-fit">
              <div className="flex flex-col items-center">
                <div
                  className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${logoColor()} flex items-center justify-center`}
                >
                  <span className="text-4xl font-bold">
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

                <div className="flex justify-center items-center [&_svg]:size-5">
                  {userFarmerInfo.farmerInfo.status === "active" ? (
                    <>
                      <p
                        className={`rounded-lg px-2 py-2 flex justify-center items-center gap-2 text-sm border font-medium ${
                          userFarmerInfo.farmerInfo.verified
                            ? "bg-green-50 text-green-700 border-green-500"
                            : "bg-yellow-50 text-yellow-700 border-yellow-900"
                        }`}
                      >
                        {userFarmerInfo.farmerInfo.verified ? (
                          <>
                            <CircleCheck />
                            {isEnglish
                              ? "Verified Account"
                              : "Beripikado ang Account"}
                          </>
                        ) : (
                          <>
                            <TriangleAlert />
                            {isEnglish
                              ? "Pending Verification"
                              : "Hindi pa Beripikado"}
                          </>
                        )}
                      </p>
                    </>
                  ) : (
                    <p
                      className={`rounded-lg px-2 py-2 flex justify-center items-center gap-2 text-sm border font-medium ${accountStatusStyle(
                        userFarmerInfo.farmerInfo.status
                      )}`}
                    >
                      {userFarmerInfo.farmerInfo.status === "block" ? (
                        <UserX />
                      ) : (
                        <CircleX />
                      )}

                      {isEnglish
                        ? `The user is ${userFarmerInfo.farmerInfo.status}`
                        : `Ang accout ay naka ${userFarmerInfo.farmerInfo.status}`}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="font-semibold text-gray-900">
                  {isEnglish ? "Shortcut:" : "Tingnan:"}
                </h3>

                <ViewCropModalButton
                  isViewing={isViewing}
                  isEnglish={isEnglish}
                  authStatus={userFarmerInfo.farmerInfo.status}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3  mt-[57px]">
          {AvailOrg.success ? (
            <UserProFile
              userFarmerInfo={userFarmerInfo.farmerInfo}
              orgInfo={userFarmerInfo.orgInfo}
              orgList={AvailOrg.orgList}
              isViewing={isViewing}
              work={AvailOrg.work}
            />
          ) : (
            <RenderRedirectNotification notif={AvailOrg.notifError} />
          )}
        </div>
      </div>
    </>
  );
};

export const FarmerOrgMemberAction: FC<farmerOrgMemberActionPropType> = ({
  farmerId,
  verificationStatus,
  farmerName,
  status,
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <DynamicLink
        baseLink="farmerUser"
        dynamicId={farmerId}
        className={
          verificationStatus ? "!bg-green-500 hover:!bg-green-600" : ""
        }
      />

      {status !== "delete" && (
        <>
          {verificationStatus ? (
            status === "block" ? (
              <UnblockMyOrgMemberButton farmerId={farmerId} />
            ) : (
              <BlockMyOrgMemberButton farmerId={farmerId} />
            )
          ) : (
            <ApprovedOrgMemberButton
              farmerId={farmerId}
              verificationStatus={verificationStatus}
            />
          )}

          <DeleteMyOrgMemberButton
            farmerId={farmerId}
            farmerName={farmerName}
          />
        </>
      )}
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

export const UserProFile: FC<UserProFilePropType> = async ({
  userFarmerInfo,
  orgInfo,
  orgList,
  isViewing,
  work,
}) => {
  const isEnglish = work === "admin" || work === "agriculturist";

  return (
    <div className="profile-component">
      <div className="component" id="profile-user-info">
        <div>
          <User />
          <h1>
            {isEnglish ? "Personal Information" : "Personal na Impormasyon"}
          </h1>
        </div>

        <div className="personal-info-component">
          {isViewing ? (
            <ViewUserProfileInfo
              userInfo={userFarmerInfo}
              isEnglish={isEnglish}
            />
          ) : (
            <MyProfileForm userInfo={userFarmerInfo} />
          )}
        </div>
      </div>

      <div className="component" id="profile-org-info">
        <div>
          <Building />
          <h1>
            {isEnglish ? "User Organization" : "Organisasyon na Kinabibilangan"}
          </h1>
        </div>

        <div className="default-style-info">
          {isViewing ? (
            <ViewUserOrganizationInfo
              userOrgInfo={orgInfo}
              isEnglish={isEnglish}
            />
          ) : (
            <MyOrganizationForm availOrgList={orgList} userOrgInfo={orgInfo} />
          )}
        </div>
      </div>

      {!isViewing && (
        <div className="component" id="profile-change-pass">
          <div>
            <KeyRound />
            <h1>Magpalit ng Password</h1>
          </div>

          <div>
            <ChangeMyPassword />
          </div>
        </div>
      )}
    </div>
  );
};

export const ViewUserProfileInfo: FC<ViewUserProfileFormPropType> = ({
  userInfo,
  isEnglish,
}) => {
  return (
    <>
      <FormDivLabelInput
        labelMessage={isEnglish ? "First name:" : "Unang Pangalan:"}
        inputName={"farmerFirstName"}
        inputPlaceholder={isEnglish ? "e.g. " : "Hal. " + "Jose"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerFirstName}
      />

      <FormDivLabelInput
        labelMessage={isEnglish ? "Middle name:" : "Gitnang Pangalan:"}
        inputName={"farmerMiddleName"}
        inputPlaceholder={isEnglish ? "e.g. " : "Hal. " + "Luzviminda"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerMiddleName}
      />

      <FormDivLabelInput
        labelMessage={isEnglish ? "Last name:" : "Apelyido:"}
        inputName={"farmerLastName"}
        inputPlaceholder={isEnglish ? "e.g. " : "Hal. " + "Juan Delacruz"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerLastName}
      />

      <FormDivLabelInput
        labelMessage={
          isEnglish
            ? "Extension name:"
            : "Ekstensyon ng Pangalan (Hal. Sr. ,Jr. , III)"
        }
        inputName={"farmerExtensionName"}
        inputPlaceholder={isEnglish ? "e.g. " : "Hal. " + "Jr"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerExtensionName}
      />

      <FormDivLabelInput
        labelMessage={isEnglish ? "Alias:" : "Alyas:"}
        inputName={"farmerAlias"}
        inputPlaceholder={isEnglish ? "e.g. " : "Hal. " + "Mang Kanor"}
        inputDisable={true}
        inputDefaultValue={userInfo.farmerAlias}
      />

      <FormDivLabelInput
        labelMessage={
          isEnglish ? "Family member count:" : "Bilang ng Miyembro sa Pamilya:"
        }
        inputName={"familyMemberCount"}
        inputPlaceholder={isEnglish ? "e.g. " : "Hal. " + "1"}
        inputDisable={true}
        inputDefaultValue={userInfo.familyMemberCount}
      />

      <FormDivLabelInput
        labelMessage={
          isEnglish ? "Residential barangay:" : "Baranggay na Tirahan:"
        }
        inputName={"barangay"}
        inputPlaceholder={isEnglish ? "e.g. " : "Hal. " + "Silangan"}
        inputDisable={true}
        inputDefaultValue={capitalizeFirstLetter(userInfo.barangay)}
      />

      <FormDivLabelInput
        labelMessage={isEnglish ? "Mobile number:" : "Numero ng Telepono:"}
        inputName={"mobileNumber"}
        inputPlaceholder={isEnglish ? "e.g. " : "Hal. " + "09** *** ****"}
        inputDisable={true}
        inputDefaultValue={userInfo.mobileNumber}
        logo={{ icon: Phone }}
      />

      <FormDivLabelInput
        labelMessage={isEnglish ? "Date of birth:" : "Kapanganakan:"}
        inputName={"birthdate"}
        inputDisable={true}
        inputDefaultValue={
          userInfo.birthdate instanceof Date
            ? DateToYYMMDD(userInfo.birthdate)
            : String(userInfo.birthdate)
        }
        logo={{ icon: CalendarDays }}
      />
    </>
  );
};

export const ViewUserOrganizationInfo: FC<UserOrganizationInfoFormPropType> = ({
  userOrgInfo,
  isEnglish,
}) => {
  return (
    <>
      <FormDivLabelInput
        labelMessage={
          isEnglish ? "Name of the Organization:" : "Pangalan ng Organisasyon:"
        }
        inputDisable={true}
        inputName={"orgId"}
        inputDefaultValue={
          userOrgInfo?.orgName ?? isEnglish
            ? "Not in any Organization"
            : "Wala sa organisasyon"
        }
        inputPlaceholder={
          isEnglish ? "Name of the Organization" : "Pangalan ng organisasyon"
        }
      />

      <FormDivLabelInput
        labelMessage={
          isEnglish ? "Leader of the Organization" : "Leader ng Organisasyon"
        }
        inputDisable={true}
        inputName={"leaderName"}
        inputDefaultValue={
          userOrgInfo?.farmerLeader ?? isEnglish
            ? "Not in any Organization"
            : "Wala sa organisasyon"
        }
        inputPlaceholder={
          isEnglish ? "Leader of the Organization" : "Leader ng Organisasyon"
        }
      />

      <FormDivLabelInput
        labelMessage={isEnglish ? "Position" : "Posisyon"}
        inputDisable={true}
        inputName={"orgRole"}
        inputDefaultValue={
          userOrgInfo?.orgRole ?? userOrgInfo?.farmerLeader ?? isEnglish
            ? "Not in any Organization"
            : "Wala sa organisasyon"
        }
        inputPlaceholder={isEnglish ? "Position" : "Posisyon"}
      />
    </>
  );
};

export const ViewUserCropInfo: FC<viewUserCropInfoPropType> = ({
  cropData,
  isViewing,
  work,
}) => {
  const cropStatus = (
    crop: cropStatusType,
    datePlanted: Date,
    dateHarvested: Date
  ) =>
    determineCropStatus({
      cropStatus: crop,
      datePlanted: datePlanted,
      dateHarvested: dateHarvested,
      isEnglish: work === "agriculturist" || work === "admin",
    });

  const gradientStyle = (
    crop: cropStatusType,
    datePlanted: Date,
    dateHarvested: Date
  ) => {
    const fiveDaysLater = 1000 * 60 * 60 * 24 * 5;

    const planted5DaysAgo = new Date(
      new Date(datePlanted).getTime() + fiveDaysLater
    );
    const harvested5DaysAgo = new Date(
      new Date(dateHarvested).getTime() + fiveDaysLater
    );

    if (!datePlanted || !dateHarvested) return "from-gray-100";

    switch (crop) {
      case `planted`:
        if (new Date() >= planted5DaysAgo) return "from-green-100";

        return "from-lime-100";

      case `harvested`:
        if (new Date() >= harvested5DaysAgo) return "from-gray-100";

        return "from-yellow-100";

      default:
        return "from-red-100";
    }
  };

  return (
    <>
      <div className="default-style-info [&>div]:last-of-type:col-span-2 [&>div]:last-of-type:[&>div]:nth-of-type-[2]:!grid-cols-2 mb-4">
        {cropData.map((crop) => {
          const { className, status } = cropStatus(
            crop.cropStatus,
            crop.datePlanted,
            crop.dateHarvested
          );

          return (
            <div
              key={crop.cropId}
              className={`border border-gray-300/70 rounded-md p-6 bg-gradient-to-br ${gradientStyle(
                crop.cropStatus,
                crop.datePlanted,
                crop.dateHarvested
              )} to-white hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-bold text-sage-900">
                  {crop.cropName}
                </h4>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${className}`}
                >
                  {status}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />

                  <div>
                    <p className="text-xs font-semibold text-sage-600 uppercase">
                      Lokasyon
                    </p>

                    <p className="text-sage-900 font-medium">
                      {crop.cropLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />

                  <div>
                    <p className="text-xs font-semibold text-sage-600 uppercase">
                      Sukat ng Lupain
                    </p>

                    <p className="text-sage-900 font-medium">
                      {crop.farmAreaMeasurement}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />

                  <div>
                    <p className="text-xs font-semibold text-sage-600 uppercase">
                      Nagtanim Noong
                    </p>

                    <p className="text-sage-900 font-medium">
                      {crop.dateHarvested
                        ? ReadableDateFormat(crop.datePlanted)
                        : "Hindi pa nakakapagtanim"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />

                  <div>
                    <p className="text-xs font-semibold text-sage-600 uppercase">
                      Huling Ani
                    </p>

                    <p className="text-sage-900 font-medium">
                      {crop.cropStatus === "harvested"
                        ? crop.dateHarvested
                          ? ReadableDateFormat(crop.dateHarvested)
                          : "Hindi pa na-aani"
                        : "Hindi pa na-aani"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isViewing && (
        <div className="w-full flex justify-end items-center">
          <Link
            className="button submit-button slimer-button text-sm"
            href={"/farmer/crop"}
          >
            Tignan
          </Link>
        </div>
      )}
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

          <div className="flex justify-between items-center gap-4">
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

          <div className="mt-4 very-small-text text-gray-600 w-full">
            <div className="flex justify-between items-end gap-4">
              <p className="flex flex-wrap gap-1">
                <span>{isEnglish ? "Now" : "Ngayong"}: </span>

                <span className="text-gray-700">
                  {ReadableDateFormat(
                    new Date(
                      currentWeather.weatherData.last_updated.split(" ")[0]
                    )
                  )}
                </span>
              </p>

              <span className="text-nowrap inline-flex">
                {converTimeToAMPM(
                  currentWeather.weatherData.last_updated.split(" ")[1]
                )}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <RenderRedirectNotification notif={currentWeather.notifError} />

          <div className="component h-full">
            <div className="card-title-wrapper flex justify-start items-center gap-2">
              <CloudOff className="logo text-gray-500" />
              <p>{isEnglish ? "Weather Today" : "Panahon ngayon"}</p>
            </div>

            <div className="flex justify-between items-center xl:py-4 text-center">
              <div className="w-full xl:space-y-2">
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

            <div className="mt-4 very-small-text text-gray-500 flex sm:hidden xl:flex justify-between items-center border-t border-gray-400 pt-2">
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
        <p>Mabilisang Paggawa</p>
      </div>

      <div className="flex flex-col space-y-4 [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:border [&>a]:rounded-md [&>a]:p-2">
        <Link
          href={`/farmer/report?addReport=true`}
          className="text-blue-700 border-blue-500 hover:bg-blue-50 hover:border-blue-800"
        >
          <FileText className="logo !size-5 " />
          <span>Maggawa ng ulat</span>
        </Link>

        <Link
          href={pathCropAddingCrop}
          className="text-green-700 border-green-500 hover:bg-green-50 hover:border-green-800"
        >
          <Wheat className="logo !size-5  " />
          <span>Magdagdag ng pananim</span>
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

  const NoValueInPieChart: FC = () => (
    <div className="no-val">
      <WheatOff className="!size-10 text-gray-400 mb-4" />

      <p className="text-xl font-semibold text-gray-700 mb-1">
        Wala ka pang pananim
      </p>
    </div>
  );

  return (
    <div className="component ">
      <div className=" space-y-4">
        <div className="font-semibold">
          <p>Bilang ng Ulat Bawat Pananim</p>
        </div>

        {reportCount.success ? (
          <PieChartCard
            data={reportCount.reportCountVal.map((val) => ({
              id: val.cropId,
              value: val.reportCount,
              label: val.cropName,
            }))}
          />
        ) : (
          <>
            <RenderRedirectNotification notif={reportCount.notifError} />
            <NoValueInPieChart />
          </>
        )}
      </div>
    </div>
  );
};

export const CropCountPerBrgy: FC = async () => {
  let cropCount: getCropCountPerBrgyReturnType;

  try {
    cropCount = await getCropCountPerBrgy();
  } catch (error) {
    console.error((error as Error).message);
    cropCount = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  const NoValueInPieChart: FC = () => (
    <div className="no-val">
      <WheatOff className="!size-10 text-gray-400 mb-4" />

      <p className="text-xl font-semibold text-gray-700 mb-1">
        Wala ka pang pananim
      </p>
    </div>
  );

  return (
    <div className="component ">
      <div className=" space-y-4">
        <div className="font-semibold">
          <p>Count of crop per Barangay</p>
        </div>

        {cropCount.success ? (
          cropCount.cropCount.length > 0 ? (
            <PieChartCard
              data={cropCount.cropCount.map((val, index) => ({
                id: `${val.cropLocation}-${index}`,
                value: val.cropCount,
                label: val.cropLocation,
              }))}
            />
          ) : (
            <NoValueInPieChart />
          )
        ) : (
          <>
            <RenderRedirectNotification notif={cropCount.notifError} />
            <NoValueInPieChart />
          </>
        )}
      </div>
    </div>
  );
};

export const CropStatusCount: FC = async () => {
  let cropCount: getCropStatusCountReturnType;

  try {
    cropCount = await getCropStatusCount();
  } catch (error) {
    console.error((error as Error).message);
    cropCount = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  const NoValueInPieChart: FC = () => (
    <div className="no-val">
      <WheatOff className="!size-10 text-gray-400 mb-4" />

      <p className="text-xl font-semibold text-gray-700 mb-1">
        There&apos;s no crop yet
      </p>
    </div>
  );

  return (
    <div className="component ">
      <div className=" space-y-4">
        <div className="font-semibold">
          <p>Count per crop status</p>
        </div>

        {cropCount.success ? (
          cropCount.cropStatusCount.length > 0 ? (
            <PieChartCard
              data={cropCount.cropStatusCount.map((val, index) => ({
                id: `${val.status}-${index}`,
                value: val.count,
                label: val.status,
              }))}
            />
          ) : (
            <NoValueInPieChart />
          )
        ) : (
          <>
            <RenderRedirectNotification notif={cropCount.notifError} />
            <NoValueInPieChart />
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
        <p>Mga Dati ng Ulat na Ipinasa</p>
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
                        <span className="flex-1 min-w-0 truncate">
                          {ReadableDateFormat(val.dayReported)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={viewFarmerReportPath(val.reportId)}
                      className="button submit-button slimer-button flex-shrink-0 text-sm"
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
