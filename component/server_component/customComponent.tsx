import {
  authBaseDesignPropType,
  AuthFormPropType,
  barangayType,
  ButtonPropType,
  CropFormPropType,
  DashboardCardPropType,
  FormCancelSubmitButtonPropType,
  FormDivInputRadioPropType,
  FormDivLabelInputPropType,
  FormDivLabelSelectType,
  FormDivLabelTextAreaPropType,
  FormMapComponentPropType,
  getMyCropStatusDetailReturnType,
  getMyRecentReportReturnType,
  ModalNoticeLogoType,
  ModalNoticePropType,
  MyPreviousReportPropType,
  NoContentYetPropType,
  RecentReportWidgetPropType,
  reportStatusPropType,
  reportTypePropType,
  seeAllValButtonPropType,
  TableComponentPropType,
  tableNoDataPropType,
} from "@/types";
import { FC } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  EyeClosed,
  Frown,
  LucideIcon,
  FileX,
  OctagonX,
  TriangleAlert,
  X,
  ClipboardPenLine,
  WheatOff,
  Wheat,
  ChevronRight,
  User,
  MapPin,
} from "lucide-react";
import {
  baranggayList,
  capitalizeFirstLetter,
  determineCropStatus,
  getInitials,
  intoFeaturePolygon,
  pathCropAddingCrop,
  ReadableDateFormat,
  reportStatus,
  reportTypeColor,
  timePass,
  translateReportType,
  UnexpectedErrorMessage,
  viewFarmerReportPath,
} from "@/util/helper_function/reusableFunction";
import {
  MapComponent,
  MapMarkerComponent,
} from "../client_component/mapComponent";
import { polygonCoordinates } from "@/util/helper_function/barangayCoordinates";
import Link from "next/link";
import { getMyRecentReport } from "@/lib/server_action/report";
import { getMyCropStatusDetail } from "@/lib/server_action/crop";
import { RenderRedirectNotification } from "../client_component/provider/notificationProvider";
import { FormHint } from "../client_component/componentForAllUser";

export const Button: FC<ButtonPropType> = ({
  children,
  className = "",
  ...buttonProp
}) => {
  return (
    <button {...buttonProp} className={`button ${className}`}>
      {children}
    </button>
  );
};

export const SubmitButton: FC<ButtonPropType> = ({
  type = "submit",
  onClick,
  className = "",
  disabled,
  children,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`submit-button ${className}`}
    >
      {children}
    </Button>
  );
};

export const CancelButton: FC<ButtonPropType> = ({
  type = "button",
  className = "",
  children,
  ...buttonProp
}) => {
  return (
    <Button
      type={type}
      className={`cancel-button ${className}`}
      {...buttonProp}
    >
      {children}
    </Button>
  );
};

export const FormCancelSubmitButton: FC<FormCancelSubmitButtonPropType> = ({
  divClassName = "",
  submitOnClick,
  submitLogo: SubmitLogo,
  submitButtonLabel,
  submitClassName = "",
  submitType = "submit",
  cancelOnClick,
  cancelLogo: CancelLogo,
  cancelButtonLabel,
  cancelClassName = "",
}) => {
  return (
    <div className={`div flex justify-end gap-4 pt-6 ${divClassName}`}>
      <SubmitButton
        onClick={submitOnClick}
        className={`${submitClassName}`}
        type={submitType}
      >
        {SubmitLogo && <SubmitLogo />}
        {submitButtonLabel}
      </SubmitButton>

      <CancelButton onClick={cancelOnClick} className={`${cancelClassName}`}>
        {CancelLogo && <CancelLogo />}
        {cancelButtonLabel}
      </CancelButton>
    </div>
  );
};

export const AuthInputPass: FC<AuthFormPropType> = ({
  label,
  isHidden,
  setIsHidden,
  formError,
  required = false,
  ...inputProps
}) => {
  return (
    <div className="space-y-2">
      <label className="label">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative flex justify-center items-center gap-2">
        <input
          type={isHidden ? "password" : "text"}
          name="password"
          placeholder="FarmerPass1"
          className=" input !pr-10"
          required={required}
          {...inputProps}
        />
        <button
          type="button"
          className="button absolute inset-y-0 right-0 flex items-center !px-3 text-gray-500 hover:text-gray-700"
          onClick={setIsHidden}
        >
          {isHidden ? <EyeClosed /> : <Eye />}
        </button>
      </div>

      {formError &&
        formError.map((message, index) => (
          <p key={message + index} className="p p-error">
            {message}
          </p>
        ))}
    </div>
  );
};

export const FormDivLabelInput: FC<FormDivLabelInputPropType> = ({
  labelMessage,
  labelClassName = "",
  divClassName = "",
  inputType = "text",
  inputDisable,
  inputName,
  inputValue,
  inputMax,
  inputMin,
  inputClassName = "",
  onChange,
  inputPlaceholder,
  formError,
  inputDefaultValue,
  inputChecked,
  inputRequired = false,
  labelOnClick,
  children,
  logo,
  hintMessage,
  adjacentBesideLabel = { children: <></>, classNameWrapper: "" },
  ...inputProps
}) => {
  return (
    <div className={`cursor-pointer div form-div ${divClassName}`}>
      <div className="flex items-center gap-2">
        <label
          htmlFor={inputName}
          className={`label flex flex-row items-centers gap-1 ${labelClassName}`}
          onClick={labelOnClick}
        >
          {logo && <logo.icon className={`size-4 ${logo.style ?? ""}`} />}

          <p>
            {labelMessage}
            {inputRequired && <span className="text-red-500">*</span>}
          </p>
        </label>

        {hintMessage && <FormHint message={hintMessage} />}
      </div>

      <div
        className={`${adjacentBesideLabel.classNameWrapper} ${
          adjacentBesideLabel ? "flex justify-between items-end gap-6" : ""
        }`}
      >
        <input
          type={inputType}
          disabled={inputDisable}
          name={inputName}
          value={inputValue}
          onChange={onChange}
          placeholder={inputPlaceholder}
          defaultValue={inputDefaultValue}
          className={`input ${inputClassName}`}
          max={inputMax}
          min={inputMin}
          required={inputRequired}
          checked={inputChecked}
          {...inputProps}
        />

        {adjacentBesideLabel.children}
      </div>

      {children}
      {formError &&
        formError.map((message, index) => (
          <p key={message + index} className="p p-error">
            {message}
          </p>
        ))}
    </div>
  );
};

export const FormDivLabelTextArea: FC<FormDivLabelTextAreaPropType> = ({
  name,
  className = "",
  labelClassName = "",
  labelOnClick,
  labelMessage,
  required,
  formError,
  ...textAreaProp
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className={`label ${labelClassName}`}
        onClick={labelOnClick}
      >
        {labelMessage}
        {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        name={name}
        className={`w-full h-[150px] resize-none input ${className}`}
        {...textAreaProp}
      />

      {formError &&
        formError.map((message, index) => (
          <p key={message + index} className="p p-error">
            {message}
          </p>
        ))}
    </div>
  );
};

export const FormDivLabelSelect: FC<FormDivLabelSelectType> = ({
  labelMessage,
  selectValue,
  selectDefaultValue,
  selectName,
  selectOrganization = false,
  selectDisable = false,
  selectRequired = false,
  childrenOption,
  optionDefaultValueLabel,
  optionOtherValAndLabel,
  onChange,
  formError,
  labelClassName,
  logo,
}) => {
  return (
    <div className="div form-div">
      <label
        htmlFor={selectName}
        className={`label flex items-centers gap-4 ${labelClassName}`}
      >
        {logo && <logo.icon className={`logo ${logo.style ?? ""}`} />}

        <div>
          {labelMessage}
          {selectRequired && <span className="text-red-500">*</span>}
        </div>
      </label>

      <select
        value={selectValue}
        defaultValue={selectDefaultValue}
        name={selectName}
        className="select"
        disabled={selectDisable}
        required={selectRequired}
        onChange={onChange}
      >
        {/* default value option */}
        {optionDefaultValueLabel && (
          <option value={optionDefaultValueLabel.value} className="option">
            {optionDefaultValueLabel.label}
          </option>
        )}

        {/* option lists */}
        {childrenOption}

        {/* option other value */}
        {optionOtherValAndLabel &&
          optionOtherValAndLabel.map((option) => (
            <option key={option.value} value={option.value} className="option">
              {option.label}
            </option>
          ))}

        {/* this will only show for other option, if the select tag will be used for showing available organization */}
        {selectOrganization && (
          <>
            <option value="other" className="option">
              Maglagay ng iba
            </option>
            <option value="none" className="option">
              Wala
            </option>
          </>
        )}
      </select>

      {formError &&
        formError.map((message, index) => (
          <p key={message + index} className="p p-error">
            {message}
          </p>
        ))}
    </div>
  );
};

export const FormDivInputRadio: FC<FormDivInputRadioPropType> = ({
  radioList,
  inputName,
  inputVal,
  onChange,
  divClassName = "",
  inputClassName = "",
  formError,
  labelMessage,
  labelClassName,
  logo,
  required = false,
}) => {
  return (
    <div className="div form-div">
      <label
        htmlFor={inputName}
        className={`label flex items-centers gap-4 ${labelClassName}`}
      >
        {logo && <logo.icon className={`logo ${logo.style ?? ""}`} />}

        <div>
          {labelMessage}
          {required && <span className="text-red-500">*</span>}
        </div>
      </label>

      <div className={`${divClassName} flex justify-start items-center gap-4`}>
        {radioList.map((val) => (
          <div
            key={val.radioLabel}
            className="flex justify-center items-center gap-1"
          >
            {inputVal ? (
              <input
                type="radio"
                name={inputName}
                id={val.radioValue}
                onChange={onChange}
                value={val.radioValue}
                checked={inputVal === val.radioValue}
                className={`${inputClassName} text-green-600 focus:ring-green-500 cursor-pointer mr-1`}
              />
            ) : (
              <input
                type="radio"
                name={inputName}
                id={val.radioValue}
                value={val.radioValue}
                className={`${inputClassName} text-green-600 focus:ring-green-500 cursor-pointer mr-1`}
              />
            )}

            <label
              htmlFor={val.radioValue}
              className="text-sm text-gray-700 cursor-pointer text-center grid place-items-center"
            >
              {val.radioLabel}
            </label>
          </div>
        ))}
      </div>

      {formError &&
        formError.map((message, index) => (
          <p key={message + index} className="p p-error">
            {message}
          </p>
        ))}
    </div>
  );
};

/**
 * Modal component for showing an important notice through modal
 * for just showing an important notice that needs a single button(e.g. Proceed button), just pass the necesarry props, the component will show a just a normal modal
 *
 * if you need a modal for deleting an important info(e.g. deletion of user), make sure to fill all the props to make the component show a modal that ask the user to procceed or not(e.g. with the deletion of user)
 */
export const ModalNotice: FC<ModalNoticePropType> = ({
  type,
  title,
  message,
  onClose,

  onProceed = onClose,
  showCancelButton,
  showCloseButton = true,
  cancel,
  proceed = { label: "Magpatuloy", className: "" },
}) => {
  const logo: ModalNoticeLogoType =
    type === "warning"
      ? {
          logo: TriangleAlert as LucideIcon,
          logoColor: "text-orange-600",
          bgColor: "bg-orange-100",
        }
      : type === "error"
      ? {
          logo: OctagonX as LucideIcon,
          logoColor: "text-red-600",
          bgColor: "bg-red-100",
        }
      : undefined;

  return (
    <div className="modal-form">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in slide-in-from-bottom-4 duration-300 block">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {logo && (
              <div
                className={`p-3 grid place-items-center rounded-xl ${logo.bgColor} shadow-sm transition-transform hover:scale-105`}
              >
                <logo.logo className={`logo ${logo.logoColor}`} />
              </div>
            )}
            <h1 className="title !text-[20px] !text-gray-900 !mb-0 !font-semibold">
              {title}
            </h1>
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="button !p-2 hover:bg-gray-100 !rounded-full transition-all duration-200 hover:rotate-90 active:scale-95"
              aria-label="Close modal"
            >
              <X className="logo !size-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

        <div>
          <p className="font-normal text-gray-600 tracking-wide leading-relaxed mb-6 text-[15px]">
            {message}
          </p>

          <div className={`grid grid-cols-2 gap-3`} dir="rtl">
            <SubmitButton
              onClick={onProceed}
              type="button"
              className={`${
                proceed.className ?? ""
              } !rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 ${
                showCancelButton ? "modal-red-button" : "modal-green-button"
              }`}
            >
              {proceed.label}
            </SubmitButton>

            {showCancelButton && cancel && (
              <CancelButton
                onClick={onClose}
                className={`${
                  cancel.className ?? ""
                } !rounded-lg modal-green-button shadow-sm hover:shadow-md transition-all duration-200 active:scale-95`}
              >
                {cancel.label}
              </CancelButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * reausable table component that render what you pass
 * @param param0 necesarry props to render the table(in tableList, ONLY PASS THE VALUE/DATA YOU WANT TO SHOW IN THE TABLE AND NOT ALL)
 * @returns table component together with the data you want to pass
 */
export const TableComponent: FC<TableComponentPropType> = ({
  tableClassName,
  noContentlogo: Logo,
  logoClassName = "",
  noContentMessage,
  listCount,
  tableHeaderCell,
  tableCell,
}) => {
  return (
    <>
      {listCount === 0 ? (
        <div className="div text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="div space-y-3">
            <Logo
              className={`logo !size-20 stroke-1 table-no-content ${logoClassName}`}
            />
            <p className="p text-gray-500 !text-xl">{noContentMessage}</p>
          </div>
        </div>
      ) : (
        <div
          className={`div rounded-lg border border-gray-200 w-full overflow-x-auto ${tableClassName}`}
        >
          <table className="table-style farmerReportTable">
            <thead>
              <tr className="">{tableHeaderCell}</tr>
            </thead>
            <tbody className="">{tableCell}</tbody>
          </table>
        </div>
      )}
    </>
  );
};

export const TableNoData: FC<tableNoDataPropType> = ({ message }) => {
  return (
    <div className="div text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <div className="div space-y-3">
        <Frown className="logo !size-20 stroke-1 table-no-content" />
        <p className="p text-gray-500 !text-xl">{message}</p>
      </div>
    </div>
  );
};

export const FormMapComponent: FC<FormMapComponentPropType> = ({
  label = "Pindutin ang mapa para ma-markahan kung saan makikita ang iyong taniman:",
  mapRef,
  mapHeight,
  cityToHighlight,
  mapOnClick,
  coor,
  formError,
}) => {
  return (
    <div id="mapFormComponent">
      <label className="label">{label}</label>

      {formError &&
        formError.map((error, index) => (
          <p key={index} className="p-error">
            {error}
          </p>
        ))}

      <MapComponent
        mapHeight={mapHeight}
        ref={mapRef}
        cityToHighlight={intoFeaturePolygon(
          cityToHighlight
            ? polygonCoordinates[cityToHighlight]
            : polygonCoordinates.calauan
        )}
        onClick={mapOnClick}
        id=""
      >
        {coor.lng && coor.lat && (
          <MapMarkerComponent markerLng={coor.lng} markerLat={coor.lat} />
        )}
      </MapComponent>
    </div>
  );
};

export const CropForm: FC<CropFormPropType> = ({
  handleChangeVal,
  currentCrops,
  mapHeight,
  mapRef,
  mapOnClick,
  formError,
}) => {
  return (
    <div className="space-y-5">
      <FormDivLabelInput
        labelMessage="Pangalanan ng taniman:"
        inputName="cropName"
        onChange={handleChangeVal}
        inputValue={currentCrops.cropName}
        formError={formError?.cropName}
      />

      <FormDivLabelInput
        labelMessage="Sukat ng Lupain:(Ektarya)"
        inputName="cropFarmArea"
        onChange={handleChangeVal}
        inputValue={currentCrops.cropFarmArea}
        formError={formError?.cropFarmArea}
      />

      <FormDivLabelSelect
        labelMessage="Lugar ng Iyong pinagtataniman:"
        selectName="cropBaranggay"
        selectValue={currentCrops.cropBaranggay}
        onChange={handleChangeVal}
        childrenOption={baranggayList.map((brgy) => (
          <option key={brgy} value={brgy}>
            {brgy.charAt(0).toUpperCase() + brgy.slice(1)}
          </option>
        ))}
        optionDefaultValueLabel={
          currentCrops.cropBaranggay
            ? undefined
            : {
                label: "--Pumili--Ng--Lugar--",
                value: "",
              }
        }
        formError={formError?.cropBaranggay}
      />

      <FormMapComponent
        mapOnClick={mapOnClick}
        mapHeight={mapHeight}
        mapRef={mapRef}
        cityToHighlight={currentCrops.cropBaranggay as barangayType}
        coor={{
          lat: currentCrops.cropCoor.lat,
          lng: currentCrops.cropCoor.lng,
        }}
        formError={formError?.cropCoor}
      />
    </div>
  );
};

export const LoadingScreen: FC = () => {
  return (
    <div className="loader fixed inset-0 flex items-center justify-center p-4 z-30 overflow-hidden bg-white">
      <div className="square" id="sq1"></div>
      <div className="square" id="sq2"></div>
      <div className="square" id="sq3"></div>
      <div className="square" id="sq4"></div>
      <div className="square" id="sq5"></div>
      <div className="square" id="sq6"></div>
      <div className="square" id="sq7"></div>
      <div className="square" id="sq8"></div>
      <div className="square" id="sq9"></div>
    </div>
  );
};

export const DashboardCard: FC<DashboardCardPropType> = ({
  cardLabel = { className: "", label: "" },
  logo = { icon: "", iconStyle: "", iconWrapperStyle: "" },
  cardContent,
  contentLabel,
  link,
  isEnglish = false,
}) => {
  return (
    <div className="component">
      <div className="flex flex-col justify-between gap-2">
        <div className="flex justify-between items-start mb-3 gap-4">
          <div
            className={`p-2 inline-block rounded-md shadow-md ${logo.iconWrapperStyle}`}
          >
            <logo.icon className={`size-5 md:size-8 ${logo.iconStyle}`} />
          </div>

          <p
            className={`text-sm text-end px-3 py-1 rounded-2xl tracking-wide opacity-90 min-w-0 truncate ${cardLabel.className}`}
          >
            {cardLabel.label}
          </p>
        </div>

        <p className="card-value">{cardContent}</p>

        <div>
          <div className="flex justify-between items-center gap-4">
            <p className="card-label min-w-0 truncate text-nowrap ">
              {contentLabel}
            </p>

            <Link href={link} className="card-link">
              {isEnglish ? "See More" : "Tingnan"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingCard = () => {
  return (
    <div className="bg-white animate-pulse w-full aspect-square">
      <div className="bg-gray-400 p-1 rounded-xl w-1/3" />
      <div className="grid grid-rows-4 space-y-2 mt-2 [&>div]:bg-gray-400 [&>div]:p-1 [&>div]:rounded-xl">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export const WeatherSideComponentLoading = () => {
  return (
    <div className="component">
      <div className="card-title-wrapper flex justify-start items-center gap-2 mb-4 children-div-loading">
        <div className="h-6 w-6 " />
        <div className="h-4 w-28 " />
      </div>

      <div className="flex justify-between items-center">
        <div className=" children-div-loading">
          <div className="h-10 w-20  mb-1" />
          <div className="h-4 w-36 " />
        </div>

        <div className="h-12 w-12 div-loading" />
      </div>

      <div className="mt-4 very-small-text text-gray-600 flex justify-between items-center children-div-loading">
        <div className="h-3 w-32" />
        <div className="h-3 w-16" />
      </div>
    </div>
  );
};

export const ClerkModalLoading = () => {
  return (
    <div className="p-8 bg-white animate-pulse w-full aspect-square border border-gray-300 rounded-xl shadow-xl">
      <div className="flex items-center justify-center flex-col gap-2 [&>div]:bg-gray-400 [&>div]:rounded-xl mb-8">
        <div className="w-1/3 p-1.5" />

        <div className="w-2/3 p-1" />
      </div>

      <div className="flex items-center justify-center flex-row gap-3 [&>div]:bg-gray-400 [&>div]:rounded-xl [&>div]:p-3 [&>div]:w-3/8 mb-10">
        <div />
        <div />
      </div>

      <div className="bg-gray-400 rounded-xl p-1 mb-10" />

      <div className="flex items-start justify-center flex-col gap-3 [&>div]:bg-gray-400 [&>div]:rounded-xl mb-8">
        <div className="w-1/3 p-1" />
        <div className="w-full p-3" />
      </div>

      <div className="w-full p-3 bg-gray-400 rounded-xl mb-10" />

      <div className="flex justify-center item-center">
        <div className="w-1/2 p-1 bg-gray-400 rounded-xl" />
      </div>
    </div>
  );
};

export const RecentReportWidget: FC<RecentReportWidgetPropType> = ({
  recentReport,
  widgetTitle,
  linkFor,
}) => {
  return (
    <div className="component">
      <div className=" card-title-wrapper">
        <p>{widgetTitle}</p>
      </div>

      {recentReport.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {recentReport.map((val) => (
            <Link
              href={`${
                linkFor === "agri"
                  ? "/agriculturist/farmerReports"
                  : "/farmerLeader/validateReport"
              }?reportId=${val.reportId}`}
              key={val.reportId}
              className="block hover:bg-gray-100/80 transition-all duration-200 group cursor-pointer pl-2 py-3"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm shadow-sm`}
                >
                  {getInitials(val.farmerFirstName, val.farmerLastName)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                    {val.farmerFirstName} {val.farmerLastName}
                  </p>

                  <p className="flex items-center 2xl:gap-2 xl:gap-1 lg:gap-3 mt-0.5 text-xs text-gray-500">
                    <span className="capitalize block truncate flex-nowrap">
                      {val.barangay}
                    </span>

                    <span>•</span>

                    <span className="flex items-center gap-1 truncate flex-nowrap">
                      <Clock className="w-3 h-3" />
                      {timePass(val.pastTime)}
                    </span>
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0  " />
              </div>
            </Link>
          ))}

          <SeeAllValButton
            link={
              linkFor === "agri"
                ? "/agriculturist/farmerReports"
                : "/farmerLeader/validateReport"
            }
          />
        </div>
      ) : (
        // Empty State
        <>
          <div className="px-5 py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Walang bagong ulat
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Mag-antay ng mga bagong submission
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export const ModalLoading: FC = () => {
  return (
    <div className="modal-form">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <div className="mb-6">
          <div className="h-6 div-loading w-3/4 mb-2"></div>
        </div>

        <div className="space-y-3 children-div-loading [&>div]:h-4">
          <div />
          <div className="w-5/6" />
          <div className="w-4/6" />
        </div>

        <div className="mt-8">
          <div className="h-10 div-loading" />
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex gap-1 children-div-loading [&>div]:!bg-blue-500 [&>div]:w-2 [&>div]:h-2 ">
            <div />
            <div style={{ animationDelay: "0.2s" }} />
            <div style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuthBaseDesign: FC<authBaseDesignPropType> = ({
  children,
  isEnglish,
}) => {
  return (
    <main>
      <div className="min-h-screen max-h-fit w-full bg-gradient-to-b from-green-50 to-white">
        <div className="flex flex-col md:flex-row md:gap-7 lg:gap-0 items-center justify-center min-h-screen p-4">
          <div className="flex flex-col items-center md:items-end md:w-full md:max-w-[500px] lg:pr-4 xl:pr-8 space-y-6 mb-8 md:mb-0">
            <div className="text-center md:text-right">
              <h1 className="web-title">AgroFarm</h1>
              <p className="hidden md:block text-lg lg:text-xl text-gray-600 max-w-md">
                {/* original text "Enabling Seamless Reporting and Informed Farmer Reports" */}
                {isEnglish
                  ? "Enabling Seamless Monitoring of Farmers' Crops Through Informed Farmer Reports"
                  : "Magpasa ng Ulat ng Walang Hadlang at Mabilis na may Patungkol sa Iyong Pananim"}
              </p>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-4 text-right">
              <div className="hidden lg:block p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-green-100 shadow-sm">
                <h3
                  className={`font-semibold text-green-800 ${
                    isEnglish ? "" : "text-sm"
                  }`}
                >
                  {/* original text: "Real-time Updates" */}
                  {isEnglish
                    ? "Instant Report Delivery"
                    : "Agarang Pagpapasa ng Ulat"}
                </h3>
                <p className="text-sm text-gray-600">
                  {/* original text: "Instant farm monitoring" */}
                  {isEnglish
                    ? "Receive reports immediately"
                    : "Mabilisang paggawa ng ulat"}
                </p>
              </div>

              <div className="hidden lg:block p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-green-100 shadow-sm">
                <h3
                  className={`font-semibold text-green-800 ${
                    isEnglish ? "" : "text-sm"
                  }`}
                >
                  {/* original text: "Data Analytics" */}
                  {isEnglish ? "Data Analytics" : "Pamamahala ng Pananim"}
                </h3>
                <p className="text-sm text-gray-600">
                  {/* orginial text: "Smart farming insights" */}

                  {isEnglish ? "Smart farming insights" : "Estado ng pananim"}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-green-300 to-transparent h-[70vh] md:mx-4 lg:mx-8"></div>

          {/* Right Section - Auth Forms */}

          <div className="w-[90%] max-w-md">{children}</div>
        </div>
      </div>
    </main>
  );
};

export const LoadingReportModal: FC = () => {
  return (
    <div className="space-y-6 p-6 ">
      <div className="children-div-loading z-0">
        <div className="h-4 w-1/2 mb-3" />
        <div className="h-10 w-full" />
      </div>

      <div>
        <div className="h-4 div-loading w-1/2 mb-3" />

        <div className="flex gap-4 children-div-loading [&>div]:h-12 [&>div]:w-32">
          <div />
          <div />
          <div />
        </div>
      </div>

      <div className="children-div-loading">
        <div className="h-4 w-1/3 mb-3" />
        <div className="h-10 w-full" />
      </div>

      <div className="children-div-loading">
        <div className="h-4 w-1/3 mb-3" />
        <div className="h-10 w-full" />
      </div>

      <div className="children-div-loading">
        <div className="h-4 w-1/3 mb-3" />
        <div className="h-32 w-full" />
      </div>

      <div>
        <div className="h-4 w-1/2 mb-3 div-loading" />

        {/* Two checkbox/button skeletons */}
        <div className="flex gap-4 children-div-loading [&>div]:h-12 [&>div]:w-48">
          <div />
          <div />
        </div>
      </div>
    </div>
  );
};

export const MyPreviousReport: FC<MyPreviousReportPropType> = async ({
  user,
}) => {
  let recentReport: getMyRecentReportReturnType;

  try {
    recentReport = await getMyRecentReport();
  } catch (error) {
    console.log((error as Error).message);

    recentReport = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  return (
    <div className="component !p-0">
      <div className="card-title-wrapper p-4 pt-5 border-b border-gray-200 !mb-0">
        <p className="">Mga Dati ng Ulat na Ipinasa</p>
      </div>

      <div className="divide-y divide-gray-200">
        {recentReport.success ? (
          recentReport.recentReport.length > 0 ? (
            recentReport.recentReport.map((report) => (
              <div
                key={report.reportId}
                className="hover:bg-gray-50 transition-colors cursor-pointer py-2 px-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <p
                    className={`px-2 py-1 rounded text-xs font-semibold ${reportTypeColor(
                      report.reportType
                    )}`}
                  >
                    {translateReportType({ type: report.reportType })}
                  </p>

                  {user !== "leader" && (
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border [&>svg]:size-4 ${
                        report.verificationStatus
                          ? "text-green-600 bg-green-50 border-green-200"
                          : "text-amber-600 bg-amber-50 border-amber-200"
                      }`}
                    >
                      {report.verificationStatus ? <CheckCircle /> : <Clock />}
                      <span className="capitalize">
                        {report.verificationStatus ? "Naaprubahan" : "Hindi pa"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm text-gray-900">
                      Pamagat:{" "}
                      <span className="font-bold text-gray-600">
                        {report.title}
                      </span>
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {ReadableDateFormat(report.dayReported)}
                      </span>
                    </div>
                  </div>

                  <div className="">
                    <Link
                      href={viewFarmerReportPath(report.reportId)}
                      className={`button slimer-button submit-button ${
                        user !== "leader" ? "text-sm" : ""
                      }`}
                    >
                      Tingnan
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoContentYet logo={FileX} message="Wala ka pang nagagawang ulat">
              <Link
                href={`/farmer/report?addReport=true`}
                className="button submit-button blue-button"
              >
                <ClipboardPenLine className="logo !size-5" />
                <span>Mag-ulat</span>
              </Link>
            </NoContentYet>
          )
        ) : (
          <>
            <RenderRedirectNotification notif={recentReport.notifError} />

            <NoContentYet logo={FileX} message="Wala ka pang nagagawang ulat" />
          </>
        )}
      </div>
    </div>
  );
};

export const MyRecentReportLoading: FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="h-6 w-48  div-loading" />
      </div>

      <div className="divide-y divide-gray-100">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 children-div-loading">
                <div className="h-5 w-16 " />
                <div className="h-5 w-40 " />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 children-div-loading">
                <div className="h-4 w-20 " />
                <div className="h-4 w-24 " />
              </div>
            </div>

            <div className="h-6 w-20 div-loading" />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 children-div-loading">
                <div className="h-5 w-16 " />
                <div className="h-5 w-40 " />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 children-div-loading">
                <div className="h-4 w-20 " />
                <div className="h-4 w-24 " />
              </div>
            </div>

            <div className="h-6 w-20 div-loading" />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 children-div-loading">
                <div className="h-5 w-16 " />
                <div className="h-5 w-40 " />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 children-div-loading">
                <div className="h-4 w-20 " />
                <div className="h-4 w-24 " />
              </div>
            </div>

            <div className="h-6 w-20 div-loading" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const NoContentYet: FC<NoContentYetPropType> = ({
  message,
  logo: Logo,
  children,
  parentDiv = "",
  logoClassName = "",
  textClassName = "",
  childrenDivClassName = "",
  textWrapperDivClassName = "",
}) => {
  return (
    <div
      className={`div text-center py-12 px-5 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 m-8 space-y-3 ${parentDiv}`}
    >
      <div
        className={`flex justify-center items-center flex-wrap gap-3 ${textWrapperDivClassName}`}
      >
        {Logo && (
          <Logo
            className={`size-15 text-gray-400 stroke-1.5 ${logoClassName}`}
          />
        )}
        <p
          className={`p font-semibold text-gray-500 !text-xl ${textClassName}`}
        >
          {message}
        </p>
      </div>

      <div
        className={`flex justify-center items-center gap-2 ${childrenDivClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export const SideComponentMyCropStatus = async () => {
  let cropStatus: getMyCropStatusDetailReturnType;

  try {
    cropStatus = await getMyCropStatusDetail();
  } catch (error) {
    console.error((error as Error).message);

    cropStatus = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  return (
    <div className="component overflow-hidden">
      <div className="card-title-wrapper">
        <p>Mga Pananim Ko</p>
      </div>

      {cropStatus.success ? (
        cropStatus.cropInfoStatus.length > 0 ? (
          <>
            <div className="divide-y divide-gray-100 [&>div]:not-last-of-type:border-b [&>div]:not-last-of-type:border-gray-200">
              {cropStatus.cropInfoStatus.map((crop) => {
                const { status, className } = determineCropStatus({
                  cropStatus: crop.cropStatus,
                  datePlanted: crop.datePlanted,
                  dateHarvested: crop.dateHarvested,
                  isEnglish: false,
                });

                return (
                  <div key={crop.cropId} className=" py-2 ">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {crop.cropName}
                        </h4>

                        <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5 truncate">
                          <MapPin className="w-3.5 h-3.5" />

                          <span>
                            {crop.farmAreaMeasurement}
                            {parseFloat(crop.farmAreaMeasurement) === 1
                              ? "hectare"
                              : "hectares"}
                          </span>
                        </p>
                      </div>

                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold text-nowrap ${className}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Itinanim:{" "}
                        {crop.datePlanted
                          ? ReadableDateFormat(crop.datePlanted)
                          : "Hindi pa naitatala"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <SeeAllValButton link="/farmer/crop" />
          </>
        ) : (
          <NoContentYet
            message={"Wala ka pang pananim"}
            logo={WheatOff}
            parentDiv="!m-0 p-4"
            logoClassName="!size-10"
            textWrapperDivClassName="!gap-0"
          >
            <Link href={pathCropAddingCrop} className="button submit-button">
              <Wheat className="logo !size-5" />
              <span>Magdagdag</span>
            </Link>
          </NoContentYet>
        )
      ) : (
        <>
          <RenderRedirectNotification notif={cropStatus.notifError} />

          <NoContentYet
            message={"Wala ka pang pananim"}
            logo={WheatOff}
            parentDiv="!m-0 p-4"
            logoClassName="!size-10"
            textWrapperDivClassName="!gap-0"
          />
        </>
      )}
    </div>
  );
};

export const SideComponentMyCropStatusLoading = () => {
  const skeletonItems = Array.from({ length: 3 });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="h-6 w-36 div-loading" />
      </div>

      <div className="divide-y divide-gray-100">
        {skeletonItems.map((_, index) => (
          <div key={index} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2  h-9 w-9 div-loading" />

                <div className="children-div-loading">
                  <div className="h-4 w-28  mb-1" />
                  <div className="h-3 w-20 " />
                </div>
              </div>

              <div className="h-5 w-16 div-loading" />
            </div>

            <div className="text-xs text-gray-500 space-y-1 children-div-loading [&>div]:h-3 [&>div]:w-40">
              <div />
              <div />
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="w-full h-4 div-loading" />
      </div>
    </div>
  );
};

export const SeeAllValButton: FC<seeAllValButtonPropType> = ({ link }) => (
  <Link
    href={link}
    className="p-2 bg-gray-100/80 border-t-2 border-gray-200 rounded-b-md text-sm text-green-600 hover:text-green-700 font-medium tracking-wide flex justify-center items-center "
  >
    Tingnan lahat
    <ChevronRight className="w-4 h-4" />
  </Link>
);

export const ReportType: FC<reportTypePropType> = ({
  type,
  isEnglish = false,
  className = "",
}) => (
  <span
    className={`px-3 py-1 rounded-2xl very-very-small-text tracking-wide ${reportTypeColor(
      type
    )} ${className}`}
  >
    {capitalizeFirstLetter(translateReportType({ type, isEnglish }))}
  </span>
);

export const ReportStatus: FC<reportStatusPropType> = ({
  verificationStatus,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full very-very-small-text font-medium ${
        verificationStatus
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      } ${className}`}
    >
      {reportStatus({ val: verificationStatus })}
    </span>
  );
};
