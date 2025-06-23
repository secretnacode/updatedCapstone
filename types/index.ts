import {
  authLogInSchema,
  authSignUpSchema,
} from "@/util/helper_function/validation/validationSchema";
import { Dispatch, SetStateAction } from "react";
import z from "zod/v4";

export type AuthComponentProps = {
  setIsSignUp: Dispatch<SetStateAction<boolean>>;
};

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

export type AuthValType = {
  username: string;
  password: string;
};

export type NewUserTye = AuthValType & {
  userId: string;
};

export type ValidateAuthValType<T> = {
  valid: boolean;
  errors?: T;
};

export type QueryUserLoginReturnType =
  | {
      exist: false;
      message: string;
    }
  | {
      exist: true;
      data: { authId: string; password: string; role: string };
    };

export type LoginFailedReturnType = {
  success: false;
  errors: NotificationBaseType[];
};

export type LoginSuccessReturnType = {
  success: true;
  url: string;
};
