import pool from "../db";

export const GetAvailableQuery = async () => {
  try {
    return (await pool.query(`select "orgId", "orgName" from capstone.org`))
      .rows;
  } catch (error) {
    const err = error as Error;
    console.error("Error in Inserting a new user query", error);
    throw new Error(
      `Error in Inserting a new user query ${err.message as string}`
    );
  }
};
