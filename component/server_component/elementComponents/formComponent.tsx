import {
  ControlledFormInputType,
  ControlledSelectElementForBarangayType,
  ControlledSelectElementForOrgListType,
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
          className={`${selectClassName}`}
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
  ({ className = "", message }) => {
    return <p className={className}>{message}</p>;
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
          className={selectClassName}
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
