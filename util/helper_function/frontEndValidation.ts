import { AllHasValueType, ValidateReturnType } from "@/types";

// validate function that will check the value of each object in the data and will return a errors array variable that will contain the error message and the type of the error for each object, the type will be used in the notification provider
export function Validate<T extends object>(
  data: T
): { errors: ValidateReturnType[] } {
  const errors: ValidateReturnType[] = [];

  if (AllHasValue(data).valid === false)
    return {
      errors: [
        {
          message: AllHasValue(data).message ?? "",
          type: "warning",
        },
      ],
    };

  for (const [key, value] of Object.entries(data)) {
    // checks the value if it has atleast 8 character or more
    if (value.length < 8)
      errors.push({
        message: `Ang ${key} mo dapat ay may walo(8) na letra o pataas`,
        type: "warning",
      });

    // checks the value it atleast have a single big letter
    if (!/[A-Z]/.test(value))
      errors.push({
        message: `Lagyan ng kahit isang malaking letra (A-Z) ang ${key} mo`,
        type: "warning",
      });

    // checks the value it atleast have a single small letter
    if (!/[a-z]/.test(value))
      errors.push({
        message: `Lagyan ng kahit isang maliit letra (a-z) ang ${key} mo`,
        type: "warning",
      });

    // checks the value it atleast have a single number
    if (!/[0-9]/.test(value))
      errors.push({
        message: `Lagyan ng kahit isang numero(0-9) ang ${key} mo`,
        type: "warning",
      });
  }

  return { errors };
}

// checks the value of each object if its equal to empty string(defaul value), if it is, will return a false
export function AllHasValue<T extends object>(data: T): AllHasValueType {
  for (const value of Object.values(data)) {
    if (value === "") {
      return { valid: false, message: "Lagyan lahat ng laman ang hinihingi" };
    }
  }

  return { valid: true };
}
