import {
  barangayType,
  ButtonPropType,
  CropFormPropType,
  DashboardCardPropType,
  FormCancelSubmitButtonPropType,
  FormDivInputRadioPropType,
  FormDivLabelInputPropType,
  FormDivLabelSelectType,
  FormMapComponentPropType,
  ModalNoticePropType,
  TableComponentPropType,
} from "@/types";
import { FC } from "react";
import {
  ClipboardX,
  LucideIcon,
  OctagonX,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  baranggayList,
  farmAreaMeasurementValue,
  intoFeaturePolygon,
} from "@/util/helper_function/reusableFunction";
import {
  MapComponent,
  MapMarkerComponent,
} from "../client_component/mapComponent";
import { polygonCoordinates } from "@/util/helper_function/barangayCoordinates";
import Link from "next/link";

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
  inputClassName,
  onChange,
  inputPlaceholder,
  formError,
  inputDefaultValue,
  inputChecked,
  inputRequired = false,
  labelOnClick,
  children,
}) => {
  return (
    <div className={`cursor-pointer div form-div ${divClassName}`}>
      <label
        htmlFor={inputName}
        className={`label ${labelClassName}`}
        onClick={labelOnClick}
      >
        {labelMessage}
        {inputRequired && <span className="text-red-500">*</span>}
      </label>
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
      />

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
}) => {
  return (
    <div className="div form-div">
      <label htmlFor={selectName} className="label">
        {labelMessage}
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
              Mag lagay ng iba
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
}) => {
  return (
    <div>
      <div className={`${divClassName} grid grid-cols-2 gap-4`}>
        {radioList.map((val) => (
          <div key={val.radioLabel}>
            <input
              type="radio"
              name={inputName}
              id={val.radioValue}
              onChange={onChange}
              value={val.radioValue}
              checked={inputVal === val.radioValue}
              className={`${inputClassName} text-green-600 focus:ring-green-500 cursor-pointer mr-1`}
            />

            <label
              htmlFor={val.radioValue}
              className="text-sm text-gray-700 cursor-pointer"
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
  cancel,
  proceed = { label: "Mag patuloy", className: "" },
}) => {
  const logo:
    | { logo: LucideIcon; logoColor: string; bgColor: string }
    | undefined =
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {logo && (
              <div
                className={`p-3 grid place-items-center rounded-full ${logo.bgColor}`}
              >
                <logo.logo className={`logo ${logo.logoColor}`} />
              </div>
            )}
            <h1 className="title !text-[18px] !text-gray-800 !mb-0">{title}</h1>
          </div>
          <button
            onClick={onClose}
            className="button !p-2 hover:bg-gray-100 !rounded-full transition-colors"
          >
            <X className="logo !size-4" />
          </button>
        </div>

        <div>
          <p className="font-light text-gray-800 tracking-wide leading-relaxed mb-5">
            {message}
          </p>
          {/* use 2 seperate button instead of single component(FormCancelSubmitButton) because the modal component can still be called for just an important notification  */}
          <div className={`grid grid-cols-2 gap-3`} dir="rtl">
            <SubmitButton
              onClick={onProceed}
              type="button"
              className={`${proceed.className ?? ""} !rounded-md ${
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
                } !rounded-md modal-green-button`}
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
  tableTitle,
  tableClassName,
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
            <ClipboardX className="logo !size-20 stroke-1 table-no-content" />
            <p className="p text-gray-500 !text-xl">{noContentMessage}</p>
          </div>
        </div>
      ) : (
        <>
          {tableTitle && (
            <div className="flex justify-between items-center ">
              <h1 className="title !text-2xl !font-bold ">{tableTitle}</h1>
            </div>
          )}
          <div
            className={`div bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${tableClassName}`}
          >
            <div className="div overflow-x-auto">
              <table className="table-style farmerReportTable">
                <thead>
                  <tr>{tableHeaderCell}</tr>
                </thead>
                <tbody>{tableCell}</tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
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
    <div id="mapCanvas">
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
        labelMessage="Sukat ng lote na iyong Pinagtataniman:"
        inputName="cropFarmArea"
        onChange={handleChangeVal}
        inputValue={currentCrops.cropFarmArea}
        formError={formError?.cropFarmArea}
      />

      <FormDivInputRadio
        radioList={farmAreaMeasurementValue()}
        inputName="farmAreaMeasurement"
        inputVal={currentCrops.farmAreaMeasurement}
        onChange={handleChangeVal}
        formError={formError?.farmAreaMeasurement}
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
    <div className="loader">
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
}) => {
  return (
    <div className="rounded-xl p-4 bg-white space-y-2 ">
      <div className="flex justify-between items-start [&>svg]:!size-8 mb-3">
        <div
          className={`p-2 inline-block rounded-md shadow-md ${logo.iconWrapperStyle}`}
        >
          <logo.icon className={`logo ${logo.iconStyle}`} />
        </div>
        <p
          className={`very-small-text px-3 py-1 rounded-2xl tracking-wide opacity-90  ${cardLabel.className}`}
        >
          {cardLabel.label}
        </p>
      </div>

      <p className="font-bold text-4xl">{cardContent}</p>

      <div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-[14px]">{contentLabel}</p>
          <Link
            href={link}
            className="tracking-wider bg-gray-100 text-gray-500 font-semibold text-[12px] px-3 rounded-2xl hover:shadow-md transition-shadow"
          >
            Tingnan
          </Link>
        </div>
      </div>
    </div>
  );
};
