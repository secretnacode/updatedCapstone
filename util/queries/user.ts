import { NewUserTye } from "@/types";
import pool from "../db";

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

export const InsertNewUser = async (data: NewUserTye) => {
  try {
    return await pool.query(
      `insert into capstone.auth ('authId', 'username', 'password', 'work') values ($1, $2, $3, $4)`,
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
