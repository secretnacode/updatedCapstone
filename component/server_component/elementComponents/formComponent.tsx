import {
  ButtonPropType,
  DivPropType,
  FormCancelSubmitButtonPropType,
  FormDivLabelInputPropType,
  FormDivLabelSelectType,
  FormType,
  InputPropType,
  LabelType,
  LogoPropType,
  ModalNoticePropType,
  OptionType,
  PType,
  SelectType,
  TitleType,
} from "@/types";
import { LucideIcon, OctagonX, TriangleAlert, X } from "lucide-react";
import { FC, forwardRef } from "react";

export const Div: FC<DivPropType> = ({ className = "", children }) => {
  return <div className={`${className}`}>{children}</div>;
};

export const FormDiv: FC<DivPropType> = ({ className = "", children }) => {
  return <Div className={`space-y-1 ${className}`}>{children}</Div>;
};

export const Input: FC<InputPropType> = ({
  type = "text",
  name,
  value,
  defaultValue,
  onChange,
  onClick,
  placeholder,
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onClick={onClick}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 disabled:text-gray-500 ${className}`}
    />
  );
};

export const Label: FC<LabelType> = ({ className = "", htmlFor, children }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
};

export const Title: FC<TitleType> = ({ children, className }) => {
  return (
    <h1
      className={`font-semibold text-gray-900 mb-4 tracking-wide ${className}`}
    >
      {children}
    </h1>
  );
};

export const FormTitle: FC<TitleType> = ({ children, className }) => {
  return <Title className={`text-lg ${className}`}>{children}</Title>;
};

export const Select: FC<SelectType> = ({
  value,
  name,
  className,
  disable = false,
  required = false,
  onChange,
  children,
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disable}
      required={required}
      className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
    >
      {children}
    </select>
  );
};

export const Option: FC<OptionType> = ({ children, className, value }) => {
  return (
    <option className={`${className}`} value={value}>
      {children}
    </option>
  );
};

export const P: FC<PType> = ({ className = "", children }) => {
  return <p className={`text-sm ${className}`}>{children}</p>;
};

export const PError: FC<PType> = ({ className = "", children }) => {
  return <P className={`!text-red-500 ${className}`}>{children}</P>;
};

export const Form = forwardRef<HTMLFormElement, FormType>(function Form(
  { children, onSubmit, className },
  ref
) {
  return (
    <form onSubmit={onSubmit} className={`${className}`} ref={ref}>
      {children}
    </form>
  );
});

export const Logo: FC<LogoPropType> = ({ logo: Logo, className }) => {
  return <Logo className={`size-6 ${className}`} />;
};

export const Button: FC<ButtonPropType> = ({
  type = "button",
  onClick,
  className = "",
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer flex items-center justify-center gap-3 py-2 px-6 rounded-2xl ${className}`}
    >
      {children}
    </button>
  );
};

export const FormSubmitButton: FC<ButtonPropType> = ({
  type = "submit",
  onClick,
  className = "",
  children,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={`bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </Button>
  );
};

export const FormCancelButton: FC<ButtonPropType> = ({
  type = "button",
  onClick,
  className = "",
  children,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={`bg-red-500 hover:!bg-red-600 !text-white !py-2 !px-6 !rounded-2xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </Button>
  );
};

export const FormCancelSubmitButton: FC<FormCancelSubmitButtonPropType> = ({
  divClassName = "",
  submitOnClick,
  submitClassName = "",
  submitLogo: SubmitLogo,
  submitButtonLabel,
  submitType = "submit",
  cancelOnClick,
  cancelClassName = "",
  cancelLogo: CancelLogo,
  cancelButtonLabel,
}) => {
  return (
    <Div className={`flex justify-end gap-4 pt-6 ${divClassName}`}>
      <FormSubmitButton
        onClick={submitOnClick}
        className={submitClassName}
        type={submitType}
      >
        {SubmitLogo && <SubmitLogo />}
        {submitButtonLabel}
      </FormSubmitButton>

      <FormCancelButton onClick={cancelOnClick} className={cancelClassName}>
        {CancelLogo && <CancelLogo />}
        {cancelButtonLabel}
      </FormCancelButton>
    </Div>
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
  errorClassName = "",
}) => {
  return (
    <FormDiv>
      <Label htmlFor={inputName}>{labelMessage}</Label>
      <Input
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
          <PError key={message + index} className={errorClassName}>
            {message}
          </PError>
        ))}
    </FormDiv>
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
  divClass,
  labelClass,
  selectClass,
  optionClass,
  formError,
  errorClassName = "",
}: FormDivLabelSelectType<T>) => {
  return (
    <FormDiv className={divClass}>
      <Label htmlFor={selectName} className={labelClass}>
        {labelMessage}
      </Label>
      <Select
        value={selectValue}
        name={selectName}
        className={selectClass}
        disable={selectDisable}
        required={selectRequired}
        onChange={onChange}
      >
        {/* default value option */}
        {optionDefaultValueLabel && (
          <Option value={optionDefaultValueLabel.value}>
            {optionDefaultValueLabel.label}
          </Option>
        )}

        {/* option lists */}
        {optionList.map((list) => (
          <Option
            key={optionValue(list)}
            value={optionValue(list)}
            className={optionClass}
          >
            {optionLabel(list)}
          </Option>
        ))}

        {/* option other value */}
        {optionOtherValAndLabel &&
          optionOtherValAndLabel.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
      </Select>

      {formError &&
        formError.map((message, index) => (
          <PError key={message + index} className={errorClassName}>
            {message}
          </PError>
        ))}
    </FormDiv>
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
            {logoValue && (
              <Logo logo={logoValue.logo} className={logoValue.className} />
            )}
            <Title className="!text-[19px] !mb-0">{modalTitle}</Title>
          </div>
          <Button
            onClick={closeModal}
            className="!p-2 hover:bg-gray-100 !rounded-full transition-colors"
          >
            <Logo logo={X} className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div className="p-6">{modalMessage}</div>

        {procceedButton && cancelButton && (
          <div className="flex justify-end gap-3 p-5 border-t ">
            {procceedButton && (
              <FormSubmitButton
                onClick={procceedButton.onClick}
                type="button"
                className={procceedButton.classsName}
              >
                {procceedButton.label}
              </FormSubmitButton>
            )}

            {cancelButton && (
              <FormCancelButton
                onClick={closeModal}
                className={cancelButton.classsName}
              >
                {cancelButton.label}
              </FormCancelButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
