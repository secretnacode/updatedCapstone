import {
  ControlledFormInputType,
  ControlledSelectElementForBarangayType,
  ControlledSelectElementForOrgListType,
  FormButtonType,
  FormCancelSubmitButtonType,
  FormDivLabelInputType,
  FormDivLabelSelectType,
  FormDivType,
  FormElementType,
  FormErrorElementType,
  FormInputType,
  FormLabelType,
  FormTitleType,
} from "@/types";
import { baranggayList } from "@/util/helper_function/reusableFunction";
import { FC, memo } from "react";

export const FormDiv: FC<FormDivType> = memo(({ className = "", children }) => {
  return <div className={`space-y-1 ${className}`}>{children}</div>;
});
FormDiv.displayName = "FormDiv";

export const FormInput: FC<FormInputType> = memo(
  ({ type, name, placeholder, className = "", required, disabled }) => {
    return (
      <input
        type={type}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 disabled:text-gray-500 ${className}`}
        required={required}
      />
    );
  }
);
FormInput.displayName = "FormInput";

export const ControlledFormInput: FC<ControlledFormInputType> = memo(
  ({
    type,
    name,
    placeholder,
    className = "",
    required,
    disabled,
    value,
    onChange,
  }) => {
    return (
      <input
        type={type}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 disabled:text-gray-500 ${className}`}
        required={required}
      />
    );
  }
);
ControlledFormInput.displayName = "ControlledFormInput";

export const FormLabel: FC<FormLabelType> = memo(
  ({ children, className = "", htmlFor }) => {
    return (
      <label
        htmlFor={htmlFor}
        className={`block text-sm font-medium text-gray-700 ${className}`}
      >
        {children}
      </label>
    );
  }
);
FormLabel.displayName = "FormLabel";

export const FormTitle: FC<FormTitleType> = memo(
  ({ children, className = "" }) => {
    return <h1 className={`${className}`}>{children}</h1>;
  }
);
FormTitle.displayName = "FormTitle";

export const ControlledSelectElementForBarangay: FC<ControlledSelectElementForBarangayType> =
  memo(
    ({
      selectValue,
      selectName,
      selectClassName = "",
      selectIsDisable,
      selectOnChange,
    }) => {
      return (
        <select
          name={selectName}
          value={selectValue}
          onChange={selectOnChange}
          className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${selectClassName}`}
          disabled={selectIsDisable}
        >
          <option value="">--Pumili--Ng--Baranggay--</option>
          {baranggayList.map((baranggay, index) => (
            <option key={index} value={baranggay}>
              {baranggay.charAt(0).toUpperCase() + baranggay.slice(1)}
            </option>
          ))}
        </select>
      );
    }
  );
ControlledSelectElementForBarangay.displayName =
  "ControlledSelectElementForBarangay";

export const FormErrorElement: FC<FormErrorElementType> = memo(
  ({ className = "", messages }) => {
    return (
      <>
        {messages.map((message, index) => (
          <p key={index} className={`text-red-500 text-sm ${className}`}>
            {message}
          </p>
        ))}
      </>
    );
  }
);
FormErrorElement.displayName = "FormErrorElement";

export const ControlledSelectElementForOrgList: FC<ControlledSelectElementForOrgListType> =
  memo(
    ({
      selectOrgList,
      selectValue,
      selectName,
      selectClassName = "",
      selectIdDisable,
      selectOnChange,
    }) => {
      return (
        <select
          name={selectName}
          onChange={selectOnChange}
          value={selectValue}
          className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${selectClassName}`}
          disabled={selectIdDisable}
        >
          <option value="">--Pumili--Ng--Organisasyon</option>
          {selectOrgList.map((org, index) => (
            <option key={index} value={org.orgId}>
              {org.orgName}
            </option>
          ))}

          <option value="other">Mag Lagay ng iba</option>
          <option value="none">Wala</option>
        </select>
      );
    }
  );
ControlledSelectElementForOrgList.displayName =
  "ControlledSelectElementForOrgList";

export const FormElement: FC<FormElementType> = memo(
  ({ children, onSubmit, classname }) => {
    return (
      <form onSubmit={onSubmit} className={`${classname}`}>
        {children}
      </form>
    );
  }
);
FormElement.displayName = "FormElement";

export const FormSubmitButton: FC<FormButtonType> = memo(
  ({
    type = "button",
    onClick = () => {},
    className = "",
    buttonLabel,
    children,
  }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`flex items-center justify-center gap-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 ${className}`}
      >
        {children}
        {buttonLabel}
      </button>
    );
  }
);
FormSubmitButton.displayName = "FormSubmitButton";

export const FormCancelButton: FC<FormButtonType> = memo(
  ({
    type = "button",
    onClick = () => {},
    className = "",
    buttonLabel,
    children,
  }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`flex items-center justify-center gap-3 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 ${className}`}
      >
        {children}
        {buttonLabel}
      </button>
    );
  }
);
FormCancelButton.displayName = "FormButton";

export const FormCancelSubmitButton: FC<FormCancelSubmitButtonType> = memo(
  ({
    submitOnClick,
    submitClassName = "",
    submitButtonLabel,
    submitLogo: SubmitLogo,
    cancelOnClick,
    cancelClassName = "",
    cancelButtonLabel,
    cancelLogo: CancelLogo,
  }) => {
    return (
      <div className="flex justify-end gap-4 pt-6">
        <FormSubmitButton
          buttonLabel={submitButtonLabel}
          onClick={submitOnClick}
          className={submitClassName}
          type="submit"
        >
          {SubmitLogo && <SubmitLogo />}
        </FormSubmitButton>

        <FormCancelButton
          buttonLabel={cancelButtonLabel}
          onClick={cancelOnClick}
          className={cancelClassName}
        >
          {CancelLogo && <CancelLogo />}
        </FormCancelButton>
      </div>
    );
  }
);
FormCancelSubmitButton.displayName = "FormCancelSubmitButton";

export const FormDivLabelInput: FC<FormDivLabelInputType> = memo(
  ({
    labelMessage,
    inputType = "text",
    inputDisable,
    inputName,
    inputValue,
    inputOnchange,
    inputPlaceholder,
    formErrorMessage,
  }) => {
    return (
      <FormDiv>
        <FormLabel htmlFor={inputName}>{labelMessage}</FormLabel>
        <ControlledFormInput
          type={inputType}
          disabled={inputDisable}
          name={inputName}
          value={inputValue}
          onChange={inputOnchange}
          placeholder={inputPlaceholder}
        />
        {formErrorMessage && <FormErrorElement messages={formErrorMessage} />}
      </FormDiv>
    );
  }
);
FormDivLabelInput.displayName = "FormDivLabelInput";

export const FormDivLabelSelect: FC<FormDivLabelSelectType> = memo(
  ({
    labelMessage,
    selectValue,
    selectName,
    selectIsDisable,
    selectOnChange,
    formErrorMessage,
  }) => {
    return (
      <FormDiv>
        <FormLabel htmlFor={selectName}>{labelMessage}</FormLabel>
        <ControlledSelectElementForBarangay
          selectIsDisable={selectIsDisable}
          selectName={selectName}
          selectValue={selectValue}
          selectOnChange={selectOnChange}
        />
        {formErrorMessage && <FormErrorElement messages={formErrorMessage} />}
      </FormDiv>
    );
  }
);
FormDivLabelSelect.displayName = "FormDivLabelSelect";
