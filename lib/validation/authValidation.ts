import z from "zod/v4";

/**
 * Check every value of the object if it has a value or not
 * @param data object that contains all the value that was passed in this function
 * @returns {message: string, valid: boolean} returns a truthy if all the object has a value,
 * if the value is equal to empty string or ""(default value) the function will return a falsey value of valid and a message
 */
export function AllHasValue<T extends object>(data: T) {
  let errors = {};
  for (const [key, value] of Object.entries(data)) {
    if (value.trim() === "")
      errors = { ...errors, [key]: `Walang laman ito, lagyan ng laman` };
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors: errors };

  return { valid: true };
}

/**
 *  a generic function that validates the value of the form and returns its errors
 * @param formVal 1st param of the function, this represents the value of the object form that you will validate
 * @param ZodSchema 2nd param of the function that represents the zod schema of the form that you will validate
 * @returns a valid and formError object, if the valid is false, the formError will contain all the error of the form, if not null
 */
export function ZodValidateForm<T>(formVal: T, ZodSchema: z.ZodType) {
  const validate = ZodSchema.safeParse(formVal);
  if (!validate.success) {
    return {
      valid: false,
      formError: z.flattenError(validate.error).fieldErrors,
    };
  }

  return { valid: true, formError: null };
}
