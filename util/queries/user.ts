import { NewUserTye, QueryUserLoginReturnType } from "@/types";
import pool from "../db";

/**
 * Check the user value by making a query that returns a boolean value.
 * @param {string} username - The username of the new user that is trying to sign up
 * @returns {Promise<boolean>} A promise that either true or false
 * @throws {Error} If the network request fails or an invalid username is provided.
 */
export const CheckUsername = async (username: string): Promise<boolean> => {
  try {
    // returns a boolean that indicates whether the username exists in the database, the 1 in the select subquery will be returned if the where clause is satisfied, and if the 1 is returned it means it was existing
    return (
      await pool.query(
        `select exists(select 1 from capstone.auth where username = $1)`,
        [username]
      )
    ).rows[0].exists;
  } catch (error) {
    const err = error as Error;
    console.error("Error in CheckUsername query", error);
    throw new Error(`Error in CheckUsername query ${err.message as string}`);
  }
};

/**
 * @param {string} data.username - The username of the user that is trying to sign up
 * @param {string} data.password - The hashed password of the new user
 * @param {string} data.userId - UUID of the new user, this ensures the uniqueness of the ID
 * @throws {Error} If the network request fails or an invalid username is provided.
 **/
export const InsertNewUser = async (data: NewUserTye) => {
  try {
    return await pool.query(
      `insert into capstone.auth ("authId", "username", "password", "role") values ($1, $2, $3, $4)`,
      [data.userId, data.username, data.password, `farmer`]
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in Inserting a new user query", error);
    throw new Error(
      `Error in Inserting a new user query ${err.message as string}`
    );
  }
};

/**
 * @param username the username of the user that is trying to login
 * @returns a object of exist that is a boolean type, if its false there's an object with it called message, this contains the error message
 * but if the exist is a truthy value, it comes with the data object; it consist of {authId: string, password: string, work: string}
 * @throws {Error} if the network is request fails
 */
export const UserLogin = async (
  username: string
): Promise<QueryUserLoginReturnType> => {
  try {
    // returns a boolean that indicates whether the username exists in the database, the 1 in the select subquery will be returned if the where clause is satisfied, and if the 1 is returned it means it was existing
    const query = await pool.query(
      `select "authId", "password", "role" from capstone.auth where username = $1`,
      [username]
    );

    if (!query.rows[0])
      return {
        exist: false,
        message: "Walang user sa username na ito, mag-sign up ka muna",
      };

    return {
      exist: true,
      data: query.rows[0],
    };
  } catch (error) {
    const err = error as Error;
    console.error("Error in CheckUsername query", error);
    throw new Error(`Error in CheckUsername query ${err.message as string}`);
  }
};
