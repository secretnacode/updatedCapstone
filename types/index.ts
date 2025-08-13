import {
  addFarmerReportSchema,
  authLogInSchema,
  authSignUpSchema,
  farmerFirstDetailFormSchema,
  farmerSecondDetailFormSchema,
} from "@/util/helper_function/validation/validationSchema";
import { LucideIcon, LucideProps } from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  ForwardRefExoticComponent,
  ReactNode,
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

export type QueryAvailableOrgReturnType =
  | {
      orgId: string;
      orgName: string;
    }[];

export type AvailableOrgReturnType =
  | {
      success: true;
      data: QueryAvailableOrgReturnType;
    }
  | {
      success: false;
      errors: NotificationBaseType[];
    };

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

export type FarmerFirstDetailActionReturnType =
  FormActionBaseType<FarmerFirstDetailFormType> & {
    fieldValues: FarmerFirstDetailFormType;
  };

export type FarmerFirstDetailType = FarmerFirstDetailFormType & {
  farmerId: string;
  verified: boolean;
  dateCreated: Date;
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
      listNum: null;
    }
  | {
      editing: true;
      cropId: string;
      listNum: number;
    };

export type CheckCropListReturnType =
  | {
      showModal: boolean;
      valid: false;
      error: FormActionBaseType<FarmerSecondDetailFormType>;
    }
  | { valid: true };

export type FarmerSecondDetailActionReturnType = {
  success: false;
  cropErrors?: CropErrorFormType;
  notifError: NotificationBaseType[];
};

export type CropErrorFormType =
  | {
      formError: { [v in keyof FarmerSecondDetailFormType]?: string[] } | null;
      cropId: string;
    }[];

export type FirstErrorType = {
  organization: string;
  otherOrg: string;
  cropFarmArea: string;
  farmAreaMeasurement: string;
  cropBaranggay: string;
  cropId: string;
};

export type CropAfterSignUpType = {
  cropId: string;
  cropLocation: string;
  farmAreaMeasurement: string;
};

export type HandleInsertCropType = FarmerDetailCropType & { userId: string };

export type InsertCropAfterSignUpType = CropAfterSignUpType & {
  userId: string;
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

export type GetFarmerUserProfileInfoQueryReturnType = {
  farmerFirstName: string;
  farmerLastName: string;
  farmerAlias: string;
  mobileNumber: string;
  barangay: string;
  birthdate: Date;
  verified: string;
  orgId: string;
  orgRole: string;
  leaderName: string;
  cropid: string;
};

export type GetFarmerUserProfileInfoReturnType =
  | {
      success: true;
      farmerUserInfo: GetFarmerUserProfileInfoQueryReturnType;
    }
  | {
      success: false;
      notMember?: boolean;
      notifError?: NotificationBaseType[];
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

export type GetMyProfileInfoType =
  | {
      success: true;
      farmerInfo: GetFarmerUserProfileInfoQueryReturnType;
    }
  | ServerActionFailBaseType;

export type FarmerPersonalInfoType = FarmerFirstDetailFormType;

export type FormErrorType<T> = { [key in keyof T]?: string[] } | null;

export type UpdateUserProfileInfoType = {
  notifMessage: NotificationBaseType[];
} & (
  | {
      success: true;
    }
  | {
      success: false;
      formError?: FormErrorType<FarmerPersonalInfoType>;
    }
);

export type ChildrenType = Readonly<{ children?: Readonly<ReactNode> }>;

export type FormInputType = {
  type: string;
  name: string;
  placeholder: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

export type ControlledFormInputType = FormInputType & {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type FormLabelType = ChildrenType & {
  htmlFor: string;
  className?: string;
};

export type FormTitleType = ChildrenType & {
  className?: string;
};

export type ControlledSelectElementForBarangayType = {
  selectValue: string;
  selectName: string;
  selectClassName?: string;
  selectIsDisable: boolean;
  selectOnChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export type FormErrorElementType = {
  messages: string[];
  className?: string;
};

export type ControlledSelectElementForOrgListType = {
  selectOrgList: QueryAvailableOrgReturnType;
  selectValue: string;
  selectName: string;
  selectClassName?: string;
  selectIdDisable: boolean;
  selectOnChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export type FormElementType = ChildrenType & {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  classname?: string;
};

export type FormDivType = ChildrenType & {
  className?: string;
};

export type FormDivLabelInputType = {
  labelMessage: string;
  inputType?: string;
  formErrorMessage?: string[];
  inputDisable: boolean;
  inputName: string;
  inputValue: string;
  inputPlaceholder: string;
  inputOnchange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export type FormDivLabelSelectType = ControlledSelectElementForBarangayType & {
  labelMessage: string;
  formErrorMessage?: string[];
};

export type FormButtonType = ChildrenType & {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  logo?: LucideIcon;
  buttonLabel: string;
};

export type FormCancelSubmitButtonType = {
  submitOnClick?: () => void;
  submitClassName?: string;
  submitButtonLabel: string;
  submitLogo?: LucideIcon;
  cancelOnClick?: () => void;
  cancelClassName?: string;
  cancelButtonLabel: string;
  cancelLogo?: LucideIcon;
};
