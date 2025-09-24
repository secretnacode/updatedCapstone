import {
  barangayType,
  ButtonPropType,
  CropFormPropType,
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

export const SubmitButton: FC<ButtonPropType> = ({
  type = "submit",
  onClick,
  className = "",
  disabled,
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button submit-button ${className}`}
    >
      {children}
    </button>
  );
};

export const CancelButton: FC<ButtonPropType> = ({
  type = "button",
  className = "",
  children,
  ...buttonProp
}) => {
  return (
    <button
      type={type}
      className={`button cancel-button ${className}`}
      {...buttonProp}
    >
      {children}
    </button>
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

export const ModalNotice: FC<ModalNoticePropType> = ({
  logo,
  modalTitle,
  closeModal,
  modalMessage,
  procceedButton,
  cancelButton,
}) => {
  const logoValue: { logo: LucideIcon; className: string } | undefined =
    logo === "warning"
      ? { logo: TriangleAlert as LucideIcon, className: "text-orange-500" }
      : logo === "error"
      ? { logo: OctagonX as LucideIcon, className: "text-red-500" }
      : undefined;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {logoValue && (
              <logoValue.logo
                className={`logo !size-10 ${logoValue.className}`}
              />
            )}
            <h1 className="title !text-[19px] !mb-0">{modalTitle}</h1>
          </div>
          <button
            onClick={closeModal}
            className="button !p-2 hover:bg-gray-100 !rounded-full transition-colors"
          >
            <X className="logo logo-mild-color" />
          </button>
        </div>

        <div className="p-6 border-y border-gray-400">{modalMessage}</div>

        {/* use 2 seperate button instead of single component(FormCancelSubmitButton) because the modal component can still be called for just an important notification  */}
        {procceedButton && cancelButton && (
          <div className="grid grid-cols-2 gap-3 p-3 ">
            {procceedButton && (
              <SubmitButton
                onClick={procceedButton.onClick}
                type="button"
                className={`${procceedButton.classsName ?? ""}`}
              >
                {procceedButton.label}
              </SubmitButton>
            )}

            {cancelButton && (
              <CancelButton
                onClick={closeModal}
                className={cancelButton.classsName ?? ""}
              >
                {cancelButton.label}
              </CancelButton>
            )}
          </div>
        )}
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
            <ClipboardX className="logo table-no-content" />
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
    <div>
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
          polygonCoordinates[cityToHighlight]
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
