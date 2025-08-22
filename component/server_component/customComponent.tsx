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
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 ${className}`}
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
      className={`button bg-red-500 hover:!bg-red-600 !text-white !py-2 !px-6 !rounded-2xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 ${className}`}
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
  onChange,
  inputPlaceholder,
  formError,
  inputDefaultValue,
}) => {
  return (
    <div className="div form-div">
      <label htmlFor={inputName}>{labelMessage}</label>
      <input
        type={inputType}
        disabled={inputDisable}
        name={inputName}
        value={inputValue}
        onChange={onChange}
        placeholder={inputPlaceholder}
        defaultValue={inputDefaultValue}
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
  selectName,
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
      ? { logo: OctagonX as LucideIcon, className: "text-orange-500" }
      : logo === "error"
      ? { logo: TriangleAlert as LucideIcon, className: "text-red-500" }
      : undefined;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {logoValue && <logoValue.logo className="logo" />}
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
  caption,
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
        <div className="div bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="div overflow-x-auto">
            <table className="table-style farmerReportTable">
              {caption && <caption className="caption">{caption}</caption>}
              <thead>{tableHeaderCell}</thead>
              <tbody>{tableCell}</tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
