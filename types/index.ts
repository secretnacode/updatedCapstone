import { Dispatch, SetStateAction } from "react";
export type AuthComponentProps = {
  setIsSignUp: Dispatch<SetStateAction<boolean>>;
};

// Base type for authentication with common fields
interface AuthBaseType {
  username: string;
  password: string;
}

// Type for login - just username and password
export type AuthLoginType = AuthBaseType;

// Type for signup - extends base type with confirmPassword
export type AuthSignUpType = AuthBaseType & {
  confirmPassword: string;
};

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
