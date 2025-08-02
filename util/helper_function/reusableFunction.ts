import { NotificationBaseType } from "@/types";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a new UUID (Universally Unique Identifier).
 * @returns {string} A new UUID.
 */
export function CreateUUID(): string {
  return uuidv4();
}

export function HandleErrorReturn(error: Error, message: string) {
  console.log(`${message}: ${error.message}`);
  throw new Error(`${message}: ${error.message}`);
}

/**
 * used if you want to get the current date
 * @returns current date with the format of YYMMDD eg. 2025-05-23
 */
export function CurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * a function that gets the date to day and is used for the inupt type date if you want the maximum date is today
 * @returns
 */
export function MaxDateToday(): string {
  return `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`;
}

/**
 * a function that returns a date
 * @returns date 4 days before
 */
export function FourDaysBefore(): string {
  let month = new Date().getMonth() + 1;
  let date = new Date().getDate();

  if (date - 3 <= 0) {
    if (month % 2 === 0) date = date - 3 + 30;
    else date = date - 3 + 31;
    month -= 1;
  }

  return `${new Date().getFullYear()}-${month
    .toString()
    .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
}

/**
 * if you want to convert the date that you want to pass into YYMMDD format date
 * @param date that you want to convery
 * @returns returns the date value(2025-35-35) that can be use in defaultValue of input date type
 */
export function DateToYYMMDD(date: Date) {
  return date.toISOString().split("T")[0];
}

/**
 * will be used in the validation of birthdate in farmer detail(after signing up)
 * @returns a date from 10 years ago
 */
export function Date10YearsAgo() {
  return new Date(
    `${new Date().getFullYear() - 10}-${new Date()
      .getMonth()
      .toString()
      .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`
  );
}

export const baranggayList = [
  "balayhangin",
  "bangyas",
  "dayap",
  "hanggan",
  "imok",
  "kanluran",
  "lamot 1",
  "lamot 2",
  "limao",
  "mabacan",
  "masiit",
  "paliparan",
  "san isidro",
  "santo tomas",
  "prinza",
] as const;

/**
 * used to redirect the user into login page with an error message
 * @param errorMessage params for the messsage of the error after redirecting to the login page and the type of its error
 * @returns redirect function with its message
 */
export const RedirectLoginWithError = (error: NotificationBaseType[]) => {
  return redirect(`/?error=${NotifToUriComponent(error)}`);
};

export const NotifToUriComponent = (notif: NotificationBaseType[]) => {
  return encodeURIComponent(JSON.stringify(notif));
};
