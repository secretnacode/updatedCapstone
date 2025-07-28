import {
  FarmerFirstDetailType,
  NewUserType,
  QueryUserLoginReturnType,
} from "@/types";
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
export const InsertNewUser = async (data: NewUserType): Promise<void> => {
  try {
    await pool.query(
      `insert into capstone.auth ("authId", "username", "password", "role") values ($1, $2, $3, $4)`,
      [data.userId, data.username, data.password, data.role]
    );
  } catch (error) {
    const err = error as Error;
    console.error(
      `Error in Inserting a new user query ${err.message as string}`
    );
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
        message: "Mali ang nailagay mong password o username",
      };

    return {
      exist: true,
      data: query.rows[0],
    };
  } catch (error) {
    const err = error as Error;
    console.error(`Error in User Login query ${err.message as string}`);
    throw new Error(`Error in User Login query ${err.message as string}`);
  }
};

/**
 * inserting the value of the new user
 * @param data of the new user that is signing up
 */
export const FarmerFirstDetailQuery = async (
  data: FarmerFirstDetailType
): Promise<void> => {
  try {
    await pool.query(
      `insert into capstone.farmer ("farmerId", "farmerFirstName", "farmerLastName", "farmerAlias", "mobileNumber", "barangay", "birthdate", "verified", "dateCreated") values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        data.farmerId,
        data.firstName,
        data.lastName,
        data.alias,
        data.mobileNumber,
        data.farmerBarangay,
        data.birthdate,
        data.verified,
        data.dateCreated,
      ]
    );
  } catch (error) {
    const err = error as Error;
    console.error(
      `Error in Farmer First Detail query ${err.message as string}`
    );
    throw new Error(
      `Error in Farmer First Detail query ${err.message as string}`
    );
  }
};

/**
 * query to update the farmer info, changing its orgRole and its orgId
 * @param orgId is the id of the new orgnization that was created
 * @param userRole is the role of the user in their organization, the letter should start in small letter (e.g. "member")
 * @param userId is the id of the current user
 */
export const UpdateUserOrgAndRoleAfterSignUp = async (
  orgId: string | null,
  userRole: string | null,
  userId: string
): Promise<void> => {
  try {
    await pool.query(
      `update capstone.farmer set "orgId"=$1, "orgRole"=$2 where "farmerId"=$3`,
      [orgId, userRole, userId]
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in updating user orgId and orgRole:", error);
    throw new Error(
      `Error in updating user orgId and orgRole: ${err.message as string}`
    );
  }
};
