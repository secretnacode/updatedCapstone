import {
  FarmerFirstDetailType,
  GetFarmerOrgMemberQueryReturnType,
  GetFarmerUserProfileInfoQueryReturnType,
  NewUserType,
  QueryUserLoginReturnType,
  userFarmerInfoPropType,
  ViewAllVerifiedFarmerUserQueryReturnType,
} from "@/types";
import { pool } from "../configuration";

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
    console.error(
      `May hindi inaasahang pagkakamali sa pag susuri ng username ng user: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag susuri ng username ng user`
    );
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
      `insert into capstone.auth ("authId", "username", "password", "work") values ($1, $2, $3, $4)`,
      [data.userId, data.username, data.password, data.role]
    );
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa pag lalagay ng impormasyon sa database: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag lalagay ng impormasyon sa database`
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
      `select "authId", "password", "work" from capstone.auth where username = $1`,
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
    console.error(
      `May hindi inaasahang pagkakamali sa pag lologin ng user: ${
        (error as Error).message
      }`
    );
    throw new Error(`May hindi inaasahang pagkakamali sa pag lologin ng user`);
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
    console.error(
      `May hindi inaasahang pagkakamali sa pag sisign up ng user: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag sisign up ng user`
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
      `update capstone.farmer set "orgId"= $1, "orgRole"= $2 where "farmerId"= $3`,
      [orgId, userRole, userId]
    );
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali habang binabago ang impormasyon ng user sa kanyang organisasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali habang binabago ang impormasyon ng user sa kanyang organisasyon`
    );
  }
};

/**
 * query to get the role of the farmer (e.g. member or leader)
 * @param userId id params of the current farmer user
 * @returns the role of the farmer user
 */
export const GetFarmerRole = async (
  userId: string
): Promise<{ orgRole: string }> => {
  try {
    return (
      await pool.query(
        `select "orgRole" from capstone.farmer where "farmerId" = $1`,
        [userId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa pag kuha ng role ng magsasaka: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag kuha ng role ng magsasaka`
    );
  }
};

/**
 * query to get the role of the farmer (e.g. member or leader)
 * @param userId id params of the current farmer user
 * @returns the role of the farmer user
 */
export const GetAgriRole = async (
  userId: string
): Promise<{ agriRole: string }> => {
  try {
    return (
      await pool.query(
        `select "agriRole" from capstone.agriculturist where "agriId" = $1`,
        [userId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa pag kuha ng role ng agriculturist: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag kuha ng role ng agriculturist`
    );
  }
};

/**
 * query for getting the necesarry info of the membe in the organizatio
 * @param leaderId id of the farm leader
 * @returns all the user info that is within the organization
 */
export const GetFarmerOrgMemberQuery = async (
  leaderId: string
): Promise<GetFarmerOrgMemberQueryReturnType> => {
  try {
    return (
      await pool.query(
        `select f."farmerId", concat( f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", f."farmerAlias", f."mobileNumber", f."barangay", f."verified", count(c."cropId") as "cropNum" from capstone.farmer f left join capstone.crop c on f."farmerId" = c."farmerId"  where f."orgId" = (select "orgId" from capstone.farmer where "farmerId" = $1) and f."orgRole" = $2 group by f."farmerId" order by case when f."verified" = $3 then $4 else $5 end asc `,
        [leaderId, "member", false, 1, 2]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa pag kuha ng detalye sa database: ${
        (error as Error).message
      }`,
      error
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag kuha ng detalye sa database`
    );
  }
};

/**
 * query for updating the verified status of the farmer account
 * @param farmerId id of the farmer you want to approved
 */
export const ApprovedOrgFarmerAccQuery = async (farmerId: string) => {
  try {
    await pool.query(
      `update capstone.farmer set "verified" = $1 where "farmerId" = $2`,
      [true, farmerId]
    );
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa pag aapruba ng mag sasaka sa database: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag aapruba ng mag sasaka sa database`
    );
  }
};

/**
 * checks the current user(usually leader) if the other farmer was its member or not
 * @param farmerId farmer id that you want to check if its the member of the leader id or not
 * @param leaderId current id of the user(leader id)
 * @returns boolean value base on the result that the farmer is a member of the leader or not
 */
export const CheckMyMemberquery = async (
  farmerId: string,
  leaderId: string
): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.farmer f join capstone.org o on f."orgId" = o."orgId" where f."farmerId" = $1 and o."orgLeadFarmerId" = $2)`,
        [farmerId, leaderId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa database habang tsinetsek kung ang user nato ay ka miyembro mo: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa database habang tsinetsek kung ang user nato ay ka miyembro mo`
    );
  }
};

/**
 * getting the necesarry information about the farmer
 * @param farmerId id of the farmer you want to get the info
 * @returns info of the farmer
 */
export const GetFarmerUserProfileInfoQuery = async (
  farmerId: string
): Promise<GetFarmerUserProfileInfoQueryReturnType> => {
  try {
    return (
      await pool.query(
        `select f."farmerFirstName", f."farmerLastName", f."farmerAlias", f."mobileNumber", f."barangay", f."birthdate" , f."verified", o."orgId", (select concat(fl."farmerFirstName", ' ', fl."farmerLastName") from capstone.farmer fl join capstone.org o on fl."farmerId" = o."orgLeadFarmerId" join capstone.farmer f on o."orgId" = f."orgId" where f."farmerId" = $1) as "leaderName", f."orgRole", string_agg(c."cropId"::text, ', ') as "cropId" from capstone.farmer f left join capstone.org o on f."orgId" = o."orgId" join capstone.crop c on f."farmerId" = c."farmerId" where f."farmerId" = $2 group by f."farmerFirstName", f."farmerLastName", f."farmerAlias", f."mobileNumber", f."barangay", f."birthdate" , f."verified", o."orgId", f."orgRole"`,
        [farmerId, farmerId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa database habang tsinetsek kung ang user nato ay ka miyembro mo: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa database habang tsinetsek kung ang user nato ay ka miyembro mo`
    );
  }
};

/**
 * delete the user infromation
 * @param farmerId id of the farmer you want to delete
 */
export const DelteUserAccountQuery = async (
  farmerId: string
): Promise<void> => {
  try {
    await pool.query(`delete from capstone.auth where "authId" = $1`, [
      farmerId,
    ]);
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa pag tatanggal ng account ng user: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag tatanggal ng account ng user`
    );
  }
};

/**
 * server action for updating the user information
 * @param userId id of the user
 * @param newProfileInfo new value of the user
 */
export const UpdateUserProfileInfoQuery = async (
  userId: string,
  newProfileInfo: userFarmerInfoPropType
): Promise<void> => {
  try {
    await pool.query(
      `update capstone.farmer set "farmerFirstName" = $1, "farmerAlias" = $2, "mobileNumber" = $3, "barangay" = $4, "birthdate" = $5, "farmerLastName" = $6 where "farmerId" = $7`,
      [
        newProfileInfo.firstName,
        newProfileInfo.alias,
        newProfileInfo.mobileNumber,
        newProfileInfo.farmerBarangay,
        newProfileInfo.birthdate,
        newProfileInfo.lastName,
        userId,
      ]
    );
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa pag uupdate ng user sa database: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag uupdate ng user sa database`
    );
  }
};

/**
 * server action of getting all the farmer that is verified
 * @returns list of verified farmer user
 */
export const ViewAllVerifiedFarmerUserQuery = async (): Promise<
  ViewAllVerifiedFarmerUserQueryReturnType[]
> => {
  try {
    return (
      await pool.query(
        `select f."farmerId", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", f."farmerAlias", f."dateCreated", f."orgRole", o."orgName", count(r."reportId") as "reportCount", count(c."cropId") as "cropCount" from capstone.farmer f left join capstone.org o on f."orgId" = o."orgId" left join capstone.report r on f."farmerId" = r."farmerId" left join capstone.crop c on f."farmerId" = c."farmerId" where f."verified" = $1 group by f."farmerId", f."farmerFirstName", f."farmerLastName", f."farmerAlias", f."verified", f."dateCreated", f."orgId", f."orgRole", o."orgName"`,
        [true]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa pag kuha ng impormasyon ng mga magsasaka: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa pag kuha ng impormasyon ng mga magsasaka`
    );
  }
};
