import {
  addFarmerReportSchema,
  authLogInSchema,
  authSignUpSchema,
  farmerFirstDetailFormSchema,
  farmerSecondDetailFormSchema,
  userProfileOrgUpdateSchema,
} from "@/util/helper_function/validation/validationSchema";
import { MapRef } from "@vis.gl/react-maplibre";
import { LucideIcon, LucideProps } from "lucide-react";
import {
  ButtonHTMLAttributes,
  ChangeEvent,
  FormEvent,
  ForwardRefExoticComponent,
  ReactNode,
  Ref,
  RefAttributes,
} from "react";
import z from "zod/v4";

// exporting the type of authSignUpSchema so it can be used as a type together with the schema
export type AuthSignUpType = z.infer<typeof authSignUpSchema>;

// exporting the type of authSignUpSchema so it can be used as a type together with the schema
export type AuthLoginType = z.infer<typeof authLogInSchema>;

type NotificationStateType = "success" | "error" | "warning" | null;

export type AllHasValueType = {
  valid: boolean;
  message?: string;
};

export interface NotificationBaseType {
  message: string;
  type: NotificationStateType;
}

export type NotificationValType = NotificationBaseType & {
  notifId: string | null;
};

export type NotificationContextType = {
  notificationVal: NotificationValType[];
  handleRemoveNotification: (notifId: string) => void;
  handleSetNotification: (data: NotificationBaseType[]) => void;
};

export type ValidateReturnType = NotificationBaseType;

export type NewUserType = AuthLoginType & {
  userId: string;
  role: string;
};

export type ValidateAuthValType<T> =
  | {
      valid: false;
      errors: T;
    }
  | { valid: true };

export type QueryUserLoginReturnType =
  | {
      exist: false;
      message: string;
    }
  | {
      exist: true;
      data: { authId: string; password: string; work: string };
    };

export type AuthResponseType =
  | {
      success: false;
      errors: NotificationBaseType[];
    }
  | {
      success: true;
      url: string;
    };

export type ErrorResponseType = {
  errors: NotificationBaseType[];
};

export type SessionValueType = {
  userId: string;
  work: string;
};

export type LoadingContextType = {
  isLoading: boolean;
  loadingMessage: string;
  handleIsLoading: (message: string) => void;
  handleDoneLoading: () => void;
};

export type QueryAvailableOrgReturnType = {
  orgId: string;
  orgName: string;
};

export type AvailableOrgReturnType =
  | {
      success: true;
      orgList: QueryAvailableOrgReturnType[];
    }
  | ServerActionFailBaseType;

export type CropListType = {
  cropId: string;
  cropFarmArea: number;
  farmAreaMeasurement: "sqft" | "sqm" | "ac" | "ha" | null; // sqaure feet, square meter, acre, hectare
  cropBaranggay: string;
};

export type FarmerFirstDetailFormType = z.infer<
  typeof farmerFirstDetailFormSchema
>;

export type FormActionBaseType<T> = {
  success: boolean | null;
  notifError: NotificationBaseType[] | null;
  formError: { [v in keyof T]?: string[] } | null;
};

export type FarmerFirstDetailActionReturnType<T> =
  | { success: true }
  | (ServerActionFailBaseType & { formError?: FormErrorType<T> });

export type FarmerFirstDetailType = {
  farmerId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName: string | null;
  alias: string | null;
  mobileNumber: number;
  farmerBarangay: string;
  birthdate: Date;
  verified: boolean;
  organization: string | null;
  orgRole: string | null;
  dateCreated: Date;
  countFamilyMember: number;
};

export type FarmerSecondDetailFormType = z.infer<
  typeof farmerSecondDetailFormSchema
>;

export type FarmerDetailCropType = FarmerSecondDetailFormType & {
  cropId: string;
};

export type EditCropListType =
  | {
      editing: false;
      cropId: null;
    }
  | {
      editing: true;
      cropId: string;
    };

export type CropFormErrorsType = {
  cropId: string;
  formError: FormErrorType<FarmerSecondDetailFormType>;
};

export type CheckCropListReturnType =
  | {
      showModal: boolean;
      valid: false;
      formError: FormErrorType<FarmerSecondDetailFormType>;
      notifError?: NotificationBaseType[];
      isExistName?: boolean;
    }
  | { valid: true };

export type FarmerSecondDetailActionReturnType = ServerActionFailBaseType & {
  formList: CropFormErrorsType[];
};

export type FirstErrorType = {
  organization: string;
  otherOrg: string;
  cropFarmArea: string;
  farmAreaMeasurement: string;
  cropBaranggay: string;
  cropId: string;
};

export type HandleInsertCropType = {
  userId: string;
  cropId: string;
  cropName: string;
  farmAreaMeasurement: string;
  cropLocation: string;
};

export type NavbarType =
  | {
      page: string;
      pageLabel: string;
      logo: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >;
    }[];

export type GetUserReportReturnType =
  | {
      reportId: string;
      cropIdReported: string;
      verificationStatus: string;
      dayReported: string;
      dayHappen: string;
      title: string;
    }[];

export type ServerActionFailBaseType = {
  success: false;
  notifError: NotificationBaseType[];
};

export type GetFarmerReportReturnType =
  | {
      success: true;
      userReport: GetUserReportReturnType;
    }
  | ServerActionFailBaseType;

export type AddReportValType = z.infer<typeof addFarmerReportSchema>;

export type AddReportActionFormType = FormActionBaseType<AddReportValType>;

export type AddReportPictureType = {
  picId: string;
  file: File;
}[];

export type AddNewFarmerReportQueryType = {
  reportId: string;
  farmerId: string;
  reportTitle: string;
  reportDescription: string;
  dayHappen: Date;
  dayReported: Date;
  verificationStatus: boolean;
};

export type AddNewFarmerReportImageType = {
  picId: string;
  reportId: string;
  pictureUrl: string;
};

type GetFarmerReportDetailBaseType = {
  cropIdReported: string;
  verificationStatus: string;
  dayReported: Date;
  dayHappen: Date;
  title: string;
  description: string;
};

export type GetFarmerReportDetailQueryReturnType =
  GetFarmerReportDetailBaseType & {
    pictures: string;
  };

export type ReportDetailType = GetFarmerReportDetailBaseType & {
  pictures: string[];
};

export type GetFarmerReportDetailReturnType =
  | {
      success: true;
      reportDetail: ReportDetailType;
    }
  | ServerActionFailBaseType;

export type GetOrgMemberReportQueryType = {
  reportId: string;
  verificationStatus: string;
  dayReported: Date;
  title: string;
  farmerFirstName: string;
  farmerLastName: string;
  farmerAlias: string;
}[];

export type GetOrgMemberReportReturnType =
  | {
      success: true;
      memberReport: GetOrgMemberReportQueryType;
    }
  | ServerActionFailBaseType;

export type ApprovedOrgMemberReturnType =
  | {
      success: true;
      notifMessage: NotificationBaseType[];
    }
  | ServerActionFailBaseType;

export type GetAllFarmerReportQueryReturnType = {
  reportId: string;
  cropIdReported: string;
  verificationStatus: string;
  farmerName: string;
  dayReported: Date;
  dayHappen: Date;
  orgName: string;
}[];

export type GetAllFarmerReportReturnType =
  | {
      success: true;
      validatedReport: GetAllFarmerReportQueryReturnType;
    }
  | ServerActionFailBaseType;

export type GetFarmerOrgMemberQueryReturnType = {
  farmerId: string;
  farmerName: string;
  farmerAlias: string;
  mobileNumber: string;
  barangay: string;
  verified: boolean;
  cropNum: number;
}[];

export type GetFarmerOrgMemberReturnType =
  | {
      success: true;
      farmerMember: GetFarmerOrgMemberQueryReturnType;
    }
  | ServerActionFailBaseType;

export type GetFarmerProfilePersonalInfoQueryReturnType = {
  farmerId: string;
  farmerFirstName: string;
  farmerAlias?: string;
  mobileNumber: string;
  barangay: string;
  birthdate: Date;
  verified: boolean;
  farmerLastName: string;
  farmerMiddleName: string;
  farmerExtensionName?: string;
  familyMemberCount: number;
};

export type GetFarmerProfileCropInfoQueryReturnType = {
  cropId: string;
  cropName: string;
};

export type GetFarmerProfileOrgInfoQueryReturnType = {
  orgId: string;
  orgRole: string;
  orgName: string;
  farmerLeader: string;
};

export type UserFarmerInfoPropType = {
  farmerFirstName: string;
  farmerLastName: string;
  farmerAlias: string;
  mobileNumber: string;
  barangay: string;
  birthdate: Date;
  orgId: string;
  orgRole: string;
  leaderName: string;
};

export type ClientUserProfileFormPropType = {
  isViewing: false;
  userFarmerInfo: GetFarmerProfilePersonalInfoQueryReturnType;
};

export type UserProfileFormPropType =
  | {
      isViewing: true;
      userFarmerInfo?: GetFarmerProfilePersonalInfoQueryReturnType;
    }
  | {
      isViewing: false;
      userInfoState?: GetFarmerProfilePersonalInfoQueryReturnType;
      formError?: FormErrorType<GetFarmerProfilePersonalInfoQueryReturnType>;
      handleChangeState?: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => void;
    };

export type InputComponentPropType = {
  labelMessage: string;
  inputType?: string;
  inputName: keyof GetFarmerProfilePersonalInfoQueryReturnType;
  inputPlaceholder?: string;
};

export type propValFunctionReturnType =
  | inputElementReturnPropType
  | selectElementReturnPropType;

export type inputElementReturnPropType =
  | { inputDefaultValue: string | number | boolean | Date | undefined }
  | {
      inputValue: string | number | boolean | undefined;
      formError: string[] | undefined;
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    };

export type selectElementReturnPropType =
  | { selectDefaultValue: string | number | boolean | Date | undefined }
  | {
      selectValue: string | number | boolean | undefined;
      formError: string[] | undefined;
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    };

export type ClientOrganizationInfoFormPropType = {
  isViewing: false;
  availOrgList: QueryAvailableOrgReturnType[];
  userOrgInfo: GetFarmerProfileOrgInfoQueryReturnType;
};

export type UserOrganizationInfoFormPropType = {
  userOrgInfo: GetFarmerProfileOrgInfoQueryReturnType;
} & (
  | {
      isViewing: true;
    }
  | {
      isViewing: false;
      orgInfo: OrgInfoType;
      handleUserOrgChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => void;
      availOrgList: QueryAvailableOrgReturnType[];
      formError: FormErrorType<OrgInfoType>;
      otherOrg: boolean;
    }
);

export type OrgInfoType = z.infer<typeof userProfileOrgUpdateSchema>;

export type CreateNewOrgAfterSignUpType = {
  firstName: string;
  lastName: string;
  alias: string;
  mobileNumber: string;
  birthdate: Date;
  farmerBarangay: string;
  memberRole: string;
  orgId: string;
};

export type GetFarmerUserProfileInfoReturnType =
  | SuccessGetMyProfileInfoReturnType
  | {
      success: false;
      isMember?: false;
      notifError?: NotificationBaseType[];
      isExist?: false;
    };

export type GetFarmerCropInfoQueryReturnType = {
  dayPlanted: Date;
  cropLocation: string;
  farmAreaMeasurement: string;
};

export type GetFarmerCropInfoReturnType =
  | {
      success: true;
      cropData: GetFarmerCropInfoQueryReturnType;
    }
  | ServerActionFailBaseType;

export type ProfileInfoReturnType = {
  cropInfo: GetFarmerProfileCropInfoQueryReturnType[];
  farmerInfo: GetFarmerProfilePersonalInfoQueryReturnType;
  orgInfo: GetFarmerProfileOrgInfoQueryReturnType;
};

export type SuccessGetMyProfileInfoReturnType = ProfileInfoReturnType & {
  success: true;
};

export type GetMyProfileInfoReturnType =
  | SuccessGetMyProfileInfoReturnType
  | ServerActionFailBaseType;

export type FormErrorType<T> = { [key in keyof T]?: string[] } | null;

export type UpdateUserProfileInfoReturnType = {
  notifMessage: NotificationBaseType[];
} & (
  | {
      success: true;
    }
  | {
      success: false;
      formError?: FormErrorType<GetFarmerProfilePersonalInfoQueryReturnType>;
    }
);

export type ChildrenType = Readonly<{ children?: Readonly<ReactNode> }>;

export type InputPropType = {
  type?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

export type LabelType = ChildrenType & {
  htmlFor: string;
  className?: string;
};

export type TitleType = ChildrenType & {
  className?: string;
};

export type SelectType = ChildrenType & {
  value?: string;
  name?: string;
  className?: string;
  disable?: boolean;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export type OptionType = ChildrenType & {
  className?: string;
  value: string | number;
};

export type PType = ChildrenType & {
  className?: string;
};

export type FormType = ChildrenType & {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  className?: string;
};

export type DivPropType = ChildrenType & {
  className?: string;
};

export type FormDivLabelInputPropType = ChildrenType & {
  labelMessage: string;
  labelClassName?: string;
  divClassName?: string;
  labelOnClick?: () => void;
  inputType?: string;
  formError?: string[];
  inputDisable?: boolean;
  inputMax?: string | number;
  inputMin?: string | number;
  inputName: string;
  inputChecked?: boolean;
  inputValue?: string;
  inputClassName?: string;
  inputDefaultValue?: string;
  inputPlaceholder?: string;
  inputRequired?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type FormDivLabelSelectType<T> = {
  labelMessage: string;
  selectValue?: string;
  selectDefaultValue?: string;
  selectName: string;
  selectOrganization?: boolean;
  selectDisable?: boolean;
  selectRequired?: boolean;
  optionList: T[];
  optionDefaultValueLabel?: { value: string | number; label: string };
  optionOtherValAndLabel?: { value: string | number; label: string }[];
  optionValue: (list: T) => string | number;
  optionLabel: (list: T) => string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  formError?: string[];
};

export type LogoPropType = {
  logo: LucideIcon;
  className?: string;
};

export type ButtonTypeAttribType = "button" | "submit" | "reset";

export type ButtonPropType = ChildrenType &
  ButtonHTMLAttributes<HTMLButtonElement>;

export type FormCancelSubmitButtonPropType = {
  divClassName?: string;
  submitOnClick?: () => void;
  submitButtonLabel: string;
  submitLogo?: LucideIcon;
  submitType?: ButtonTypeAttribType;
  cancelOnClick?: () => void;
  cancelButtonLabel: string;
  cancelLogo?: LucideIcon;
};

export type ModalNoticePropType = {
  logo?: "warning" | "error";
  modalTitle: string;
  closeModal: () => void;
  modalMessage: ReactNode;
  procceedButton?: {
    label: string;
    onClick: () => void;
    classsName?: string;
  };
  cancelButton?: { label: string; classsName?: string };
};

export type NewOrgType = {
  orgId: string;
  orgRole: string;
  farmerId: string;
};

export type UpdateUserProfileOrgReturnType = {
  notifMessage: NotificationBaseType[];
} & (
  | {
      success: true;
      newOrgIdVal: string;
    }
  | {
      success: false;
      formError?: FormErrorType<OrgInfoType>;
    }
);

export type ViewAllVerifiedFarmerUserQueryReturnType = {
  farmerId: string;
  farmerName: string;
  farmerAlias: string;
  dateCreated: Date;
  orgRole: string;
  orgName: string;
  reportCount: number;
  cropCount: number;
};

export type ViewAllValidatedFarmerUserReturnType =
  | {
      success: true;
      validatedFarmer: ViewAllVerifiedFarmerUserQueryReturnType[];
    }
  | ServerActionFailBaseType;

export type TablePropType = ChildrenType & {
  className?: string;
};

export type CaptionPropType = ChildrenType & {
  className?: string;
};

export type TableHeaderPropType = ChildrenType & {
  className?: string;
};

export type TableBodyPropType = ChildrenType & {
  className?: string;
};

export type TableRowPropType = ChildrenType & {
  className?: string;
};

export type TableHeaderCellPropType = ChildrenType & {
  className?: string;
  scope?: string;
};

export type TableCellPropType = ChildrenType & {
  className?: string;
};

export type TableComponentPropType = {
  tableTitle?: string;
  noContentMessage: string;
  listCount: number;
  tableHeaderCell: Readonly<ReactNode>;
  tableCell: Readonly<ReactNode>;
};

export type ViewAllUnvalidatedFarmerQueryReturnQuery = {
  farmerId: string;
  farmerName: string;
  farmerAlias: string;
  dateCreated: Date;
  verified: boolean;
  orgRole: string;
  orgName: string;
};

export type ViewAllUnvalidatedFarmerReturnType =
  | {
      success: true;
      notValidatedFarmer: ViewAllUnvalidatedFarmerQueryReturnQuery[];
    }
  | ServerActionFailBaseType;

export type ApprovedButtonPropType = {
  farmerId: string;
  verificationStatus: boolean;
  label?: string;
};

export type DynamicLinkPropType = {
  baseLink: "farmerUser" | "agriculturist/organizations";
  dynamicId: string;
  label?: string;
  className?: string;
};

export type DeleteUserPropType = {
  farmerId: string;
  farmerName: string;
  buttonLabel?: string;
  proceedButtonLabel?: string;
  cancelButtonLabel?: string;
  modalTitle?: string;
  modalMessage?: Readonly<ReactNode>;
};

export type GetAllOrganizationQueryReturnType = {
  orgId: string;
  orgName: string;
  farmerLeaderName: string;
  farmerId: string;
  totalMember: number;
};

export type GetAllOrganizationReturnType =
  | {
      success: true;
      orgList: GetAllOrganizationQueryReturnType[];
    }
  | ServerActionFailBaseType;

export type GetAllOrgMemberListQueryReturnType = {
  farmerId: string;
  farmerName: string;
  farmerAlias: string;
  barangay: string;
  verified: boolean;
  orgRole: string;
};

export type GetAllOrgMemberListReturnType =
  | { success: true; memberList: GetAllOrgMemberListQueryReturnType[] }
  | (ServerActionFailBaseType & { isExist?: boolean });

export type AgriculturistNavLinkType = {
  link: string;
  logo: LucideIcon;
  linkName: string;
};

export type FarmerUserProfilePropType = {
  userFarmerInfo: ProfileInfoReturnType;
  isViewing: boolean;
};

export type ViewCropModalButtonPropType = {
  cropInfo: GetFarmerProfileCropInfoQueryReturnType[];
  isViewing: boolean;
};

export type UserProFileComponentPropType = {
  userFarmerInfo: GetFarmerProfilePersonalInfoQueryReturnType;
  orgInfo: GetFarmerProfileOrgInfoQueryReturnType;
  orgList: QueryAvailableOrgReturnType[];
  isViewing: boolean;
};

export type barangayType =
  | "balayhangin"
  | "bangyas"
  | "dayap"
  | "hanggan"
  | "imok"
  | "kanluran"
  | "lamot 1"
  | "lamot 2"
  | "limao"
  | "mabacan"
  | "masiit"
  | "paliparan"
  | "perez"
  | "san isidro"
  | "santo tomas"
  | "silangan"
  | "prinza";

export type pointCoordinatesType = Record<barangayType | "calauan", number[]>;

export type polygonCoordinatesType = Record<
  barangayType | "calauan",
  number[][]
>;

export type MapComponentPropType = {
  ref?: Ref<MapRef>;
};

export type getPointCoordinateReturnType = {
  longitude: number;
  latitude: number;
};
