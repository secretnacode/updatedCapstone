import {
  addFarmerReportSchema,
  authLogInSchema,
  authSignUpSchema,
  farmerFirstDetailFormSchema,
  farmerSecondDetailFormSchema,
} from "@/util/helper_function/validation/validationSchema";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
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
    }[]
  | [];

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
    }[]
  | [];

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
    }[]
  | [];

export type GetUserReportReturnType =
  | {
      reportId: string;
      cropIdReported: string;
      verificationStatus: string;
      dayReported: string;
      dayHappen: string;
      title: string;
    }[]
  | [];

export type GetFarmerReportReturnType =
  | {
      success: true;
      userReport: GetUserReportReturnType;
    }
  | { success: false; notifError: NotificationBaseType[] };

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
