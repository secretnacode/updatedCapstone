import {
  authLogInSchema,
  authSignUpSchema,
} from "@/util/helper_function/validation/validationSchema";
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
      data: { authId: string; password: string; role: string };
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
  role: string;
} | null;

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
  farmAreaMeasurement: "sqft" | "sqm" | "ac" | "ha"; // sqaure feet, square meter, acre, hectare
  cropBaranggay: string;
};
