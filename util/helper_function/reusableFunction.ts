import { ErrorResponseType } from "@/types";
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
 * Throwing all the 4xx and 5xx into catch block
 * @param res is the response of the api
 * @returns res.json() if the res is whitin 2xx and 3xx status
 * @throws errors object that will be used in the notification provider if the response status is 4xx and 5xx
 */
export async function HandleAPIResponse(res: Response) {
  if (!res.ok) {
    throw {
      errors: (await res.json()).errors ?? [
        { message: "Unknown Error", type: "error" },
      ],
    } as ErrorResponseType;
  }

  return await res.json();
}
