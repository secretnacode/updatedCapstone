import {
  AllHasValueType,
  AuthLoginType,
  AuthSignUpType,
  NotificationBaseType,
  ValidateAuthValType,
} from "@/types";
import { authLogInSchema, authSignUpSchema } from "../validationSchema";
import { reserveNames } from "../reserveName";

/**
 * A validation function for signup function
 * @param data object that contains all the value of tha user who's trying to login{username, password, confirmPassword}
 * @returns { ValidateAuthValType<NotificationBaseType[]> } a valid with a boolean value,
 * if false it returns a errors object that contains all the error messages together with its type of notification
 */
export const ValidateSingupVal = (
  data: AuthSignUpType
): ValidateAuthValType<NotificationBaseType[]> => {
  const hasVal: AllHasValueType = AllHasValue(data);
  if (!hasVal.valid)
    return {
      valid: false,
      errors: [
        {
          message: hasVal.message ?? "",
          type: "warning",
        },
      ],
    };

  const validate = authSignUpSchema.safeParse(data);
  if (!validate.success)
    return {
      valid: false,
      errors: validate.error.issues.map((issue) => ({
        message: issue.message,
        type: "warning",
      })),
    };

  const invalidName = InvalidName(data);
  if (!invalidName.valid)
    return {
      valid: false,
      errors: invalidName.errors,
    };

  return { valid: true };
};

/**
 * A validation function for login function
 * @param data object that contains all the value of tha user who's trying to login{username, password}
 * @returns { ValidateAuthValType<NotificationBaseType[]> } a success with a boolean value, if false it returns a errors object that contains all the error messages together with its type of notification
 *
 */
export const ValidateLoginVal = (
  data: AuthLoginType
): ValidateAuthValType<NotificationBaseType[]> => {
  const hasVal: AllHasValueType = AllHasValue(data);
  if (!hasVal.valid)
    return {
      valid: false,
      errors: [
        {
          message: hasVal.message ?? "",
          type: "warning",
        },
      ],
    };

  const validate = authLogInSchema.safeParse(data);
  if (!validate.success)
    return {
      valid: false,
      errors: validate.error.issues.map((issue) => ({
        message: issue.message,
        type: "warning",
      })),
    };

  return { valid: true };
};

/**
 * Check every value of the object if it has a value or not
 * @param data object that contains all the value that was passed in this function
 * @returns {message: string, valid: boolean} returns a truthy if all the object has a value,
 * if the value is equal to empty string or ""(default value) the function will return a falsey value of valid and a message
 */
export function AllHasValue<T extends object>(data: T): AllHasValueType {
  for (const value of Object.values(data)) {
    if (value === "") {
      return { valid: false, message: "Lagyan lahat ng laman ang hinihingi" };
    }
  }

  return { valid: true };
}

/**
 * Check every value of the object if it contains a reserved name
 * @param data object that contains all the value that was passed in this function
 * @returns {message: string, valid: boolean} returns a valid object that is a boolean
 * if the valid is false, it will return a
 */
export function InvalidName<T extends object>(
  data: T
): ValidateAuthValType<NotificationBaseType[]> {
  for (const [key, value] of Object.entries(data)) {
    if (reserveNames.has(value.toLowerCase()))
      return {
        valid: false,
        errors: [
          {
            message: `Bawal ang ${value} sa iyong ${key}`,
            type: "warning",
          },
        ],
      };
  }

  return { valid: true };
}
