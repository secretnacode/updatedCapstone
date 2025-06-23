import { compare, hashSync } from "bcrypt";

export function Hash(word: string): string {
  return hashSync(word, 10);
}

/**
 * use to compare the password and hashpass that was store in the database
 * @param password of the user input
 * @param hashPass that is from the database
 * @returns {Promise<boolean>} true if the password and hashpass is same value, if not will return a false
 */
export async function ComparePassword(
  password: string,
  hashPass: string
): Promise<boolean> {
  try {
    return await compare(password, hashPass);
  } catch (error) {
    const err = error as Error;
    console.log(`Error in comparing of password and hash password: ${err}`);
    throw new Error(`Error in comparing of password and hash password: ${err}`);
  }
}
