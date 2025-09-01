import {
  ButtonPropType,
  FormCancelSubmitButtonPropType,
  FormDivLabelInputPropType,
  FormDivLabelSelectType,
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
  onClick,
  className = "",
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button cancel-button ${className}`}
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
  submitType = "submit",
  cancelOnClick,
  cancelLogo: CancelLogo,
  cancelButtonLabel,
}) => {
  return (
    <div className={`div flex justify-end gap-4 pt-6 ${divClassName}`}>
      <SubmitButton onClick={submitOnClick} type={submitType}>
        {SubmitLogo && <SubmitLogo />}
        {submitButtonLabel}
      </SubmitButton>

      <CancelButton onClick={cancelOnClick}>
        {CancelLogo && <CancelLogo />}
        {cancelButtonLabel}
      </CancelButton>
    </div>
  );
};

export const FormDivLabelInput: FC<FormDivLabelInputPropType> = ({
  labelMessage,
  inputType = "text",
  inputDisable,
  inputName,
  inputValue,
  inputMax,
  inputMin,
  onChange,
  inputPlaceholder,
  formError,
  inputDefaultValue,
  inputRequired = false,
}) => {
  return (
    <div className="div form-div">
      <label htmlFor={inputName} className="label">
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
        className="input"
        max={inputMax}
        min={inputMin}
        required={inputRequired}
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

export const FormDivLabelSelect = <T,>({
  labelMessage,
  selectValue,
  selectDefaultValue,
  selectName,
  selectOrganization = false,
  selectDisable = false,
  selectRequired = false,
  optionList,
  optionDefaultValueLabel,
  optionOtherValAndLabel,
  optionValue,
  optionLabel,
  onChange,
  formError,
}: FormDivLabelSelectType<T>) => {
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
        {optionList.map((list) => (
          <option
            key={optionValue(list)}
            value={optionValue(list)}
            className="option"
          >
            {optionLabel(list)}
          </option>
        ))}

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
        <div className="flex items-center justify-between p-4 border-b">
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

        <div className="p-6">{modalMessage}</div>

        {procceedButton && cancelButton && (
          <div className="flex justify-end gap-3 p-5 border-t ">
            {procceedButton && (
              <SubmitButton
                onClick={procceedButton.onClick}
                type="button"
                className={procceedButton.classsName}
              >
                {procceedButton.label}
              </SubmitButton>
            )}

            {cancelButton && (
              <CancelButton
                onClick={closeModal}
                className={cancelButton.classsName}
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
          <div className="div bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
