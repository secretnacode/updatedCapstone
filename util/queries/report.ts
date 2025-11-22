"use server";

import {
  AddNewFarmerReportQueryType,
  allType,
  allUserRoleType,
  GetAllFarmerReportQueryReturnType,
  GetFarmerReportDetailQueryReturnType,
  getLatestReportQueryReturnType,
  getMyRecentReportQueryReturnType,
  GetOrgMemberReportQueryType,
  getRecentReportParamType,
  getRecentReportReturnType,
  getReportCountPerCropQueryReturnType,
  getReportCountThisAndPrevMonthReturnType,
  getReportCountThisWeekReturnType,
  getReportCountThisYearReturnType,
  getToBeDownloadReportQueryReturnType,
  GetUserReportReturnType,
  reportDownloadType,
  reportTypeStateType,
} from "@/types";
import { pool } from "../configuration";
import {
  cteDaySeries,
  cteMonthSeries,
  cteWeekSeries,
  dateFilter,
} from "./reausableQuery";

export const reportType = async (): Promise<
  Record<reportTypeStateType, reportTypeStateType>
> => ({
  damage: "damage",
  planting: "planting",
  harvesting: "harvesting",
});

export const GetUserReport = async (
  userId: string
): Promise<GetUserReportReturnType[]> => {
  try {
    return (
      await pool.query(
        `select r."reportId", r."verificationStatus",  r."dayReported", r."dayHappen",  r."title", "reportType", c."cropName" from capstone.report r join capstone.crop c on r."cropId" = c."cropId" where r."farmerId" = $1`,
        [userId]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari habang kinukuha ang mga impormasyon ng mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang kinukuha ang mga impormasyon ng mga ulat`
    );
  }
};

/**
 * IF ADDING ANOTHER REPORT, JUST USE THIS AND UPDATE THE TABLE AND USE FUNCTION ` updateReportType `
 * TO UPDATE THE REPORT INTO DAMAGE, HARVESTING, OR PLANTING
 *
 * query for inserting the new value of the report in the db
 * @param data are the needed value in the insertion
 */
export const addNewReport = async (data: AddNewFarmerReportQueryType) => {
  try {
    await pool.query(
      `insert into capstone.report ("reportId", "farmerId", "verificationStatus", "dayReported", "dayHappen", "title", "description", "cropId", "orgId") values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        data.reportId,
        data.farmerId,
        data.verificationStatus,
        data.dayReported,
        data.dayHappen,
        data.reportTitle,
        data.reportDescription,
        data.cropId,
        data.orgId,
      ]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag gagawa ng panibagong ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag gagawa ng panibagong ulat`
    );
  }
};

/**
 * query for updating the reportType of the report, use this after the insertion of report to update the null value
 *
 * did this because the 3 report types uses the same query and their only difference is the reportType,
 * so after the insertion of new report, this is needed to be executed
 * @param type
 * @param reportId
 */
export const updateReportType = async (
  type: reportTypeStateType,
  reportId: string
) => {
  try {
    await pool.query(
      `update capstone.report set "reportType" = $1 where "reportId" = $2`,
      [type, reportId]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag uupdate ng ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag uupdate ng ulat`
    );
  }
};

/**
 * query for getting all the necessary information to view the report detail
 * @param reportId if of the report
 * @returns
 */
export const GetFarmerReportDetailQuery = async (
  reportId: string
): Promise<GetFarmerReportDetailQueryReturnType> => {
  try {
    const reportInfo = await pool.query(
      `select c."cropName", c."cropLng", c."cropLat", c."cropLocation", r."verificationStatus", r."reportType", r."dayReported", r."dayHappen", r."title", r."description", string_agg(i."imageUrl", ', ') as pictures from capstone.report r join capstone.image i on r."reportId" = i."reportId" join capstone.crop c on r."cropId" = c."cropId" where r."reportId" = $1 group by c."cropName", c."cropLng", c."cropLat", c."cropLocation", r."cropId", r."verificationStatus", r."reportType", r."dayReported", r."dayHappen", r."title", r."description"`,
      [reportId]
    );

    if (reportInfo.rowCount === 0) return { isExist: false };

    return { isExist: true, reportInfo: reportInfo.rows[0] };
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng ulat`
    );
  }
};

/**
 * gets the report of the member in the same organization
 * @param orgId id of the organization that you want to see the reports
 * @returns reports of the members within the organization
 */
export const GetOrgMemberReportQuery = async (
  orgId: string
): Promise<GetOrgMemberReportQueryType[]> => {
  try {
    return (
      await pool.query(
        `select r."reportId", r."verificationStatus", r."dayReported", r."title", r."reportType", f."farmerFirstName", f."farmerLastName", f."farmerAlias" from capstone.report r join capstone.farmer f on f."farmerId" = r."farmerId" where f."orgId" = $1 and f."orgRole" = $2 order by case when r."verificationStatus" = $3 then $4 else $5 end asc`,
        [orgId, "member", false, 1, 2]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat`
    );
  }
};

/**
 * query for approving the farmer org member
 * @param reportId id that you want to approved
 */
export const ApprovedOrgMemberQuery = async (reportId: string) => {
  try {
    await pool.query(
      `update capstone.report set "verificationStatus" = $1, "orgId" = (select f."orgId" from capstone.farmer f join capstone.report r on f."farmerId" = r."farmerId" where r."reportId" = $2), "dayVerified" = $3 where "reportId" = $4`,
      [true, reportId, new Date(), reportId]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag aapruba ng ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag aapruba ng ulat`
    );
  }
};

/**
 * server action for getting all the farmer report information where the status of it is pending or is null
 * @returns farmer report information
 */
export const GetAllFarmerReportQuery = async (): Promise<
  GetAllFarmerReportQueryReturnType[]
> => {
  try {
    return (
      await pool.query(
        `select r."reportId", c."cropLocation", r."verificationStatus", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", f."farmerId", r."dayReported", r."dayHappen", o."orgName" from capstone.report r join capstone.farmer f on r."farmerId" = f."farmerId" left join capstone.org o on r."orgId" = o."orgId" left join capstone.crop c on r."cropId" = c."cropId" where r."verificationStatus" = $1 or f."orgId" is null order by r."verificationStatus" desc`,
        [true]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat`
    );
  }
};

/**
 * function for getting all the report count that was passed to the farmer leader today
 * @param farmerLeadId id of the farmer leader that wants to see the total count of report that was made today
 * @returns count of farmer member report that was passed today
 */
export const getCountFarmerMemReportToday = async (
  farmerLeadId: string
): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count(r."title") from capstone.report r left join capstone.farmer f on r."farmerId" = f."farmerId" join capstone.org o on f."orgId" = o."orgId" where o."farmerLeadId" = $1 and date(r."dayReported") = current_date`,
        [farmerLeadId]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat`
    );
  }
};

/**
 * query for getting the count of unvalidated report
 * @param farmerLeadId id of the farmerLeader that wants to know the count of unvalidated report
 * @returns number of unvalidated report
 */
export const getCountUnvalidatedReport = async (
  farmerLeadId: string
): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count(r."verificationStatus") from capstone.report r left join capstone.farmer f on r."farmerId" = f."farmerId" join capstone.org o on f."orgId" = o."orgId" where o."farmerLeadId" = $1 and r."verificationStatus" = $2`,
        [farmerLeadId, false]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng unvalidated na ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng unvalidated na ulat`
    );
  }
};

/**
 * query for getting the count that the user made today
 * @param userId id of the user that wants to know the report it made today
 * @returns number
 */
export const getCountMadeReportToday = async (
  userId: string
): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count("reportId") from capstone.report where "farmerId" = $1 and date("dayHappen") = current_date`,
        [userId]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng ulat na isinagawa mo: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng ulat na isinagawa mo`
    );
  }
};

/**
 * query to get all the report within this week per day
 *
 * IF THIS WILL USE BY THE AGRI OR THE ADMIN, JUST PASS ANY RANDOM IN THE USERID JUST FOR IT TO WORK
 *
 * @param leadId id of the farmer leader that wants to get the report that was passed
 * @returns
 */
export const getReportCountThisWeek = async (
  userId: string,
  role: allUserRoleType
): Promise<getReportCountThisWeekReturnType[]> => {
  try {
    const cte = await cteDaySeries();
    const filter = await dateFilter(role);
    const paramVal = role === "agriculturist" ? [] : [userId];

    return (
      await pool.query(
        `${cte}
      select to_char(ds.date, 'FMDay') as "dayOfWeek", coalesce(count(r."reportId"), 0) as "reportCount" from day_series ds left join capstone.report r on date(r."dayReported") = ds.date ${filter} group by ds.date, to_char(ds.date, 'FMDay') order by ds.date`,
        paramVal
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon sa mga ulat na naipasa sa linggo na ito: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon sa mga ulat na naipasa sa linggo na ito`
    );
  }
};

/**
 * query to get all the report within this past month and this month per week
 *
 * IF THIS WILL USE BY THE AGRI OR THE ADMIN, JUST PASS ANY RANDOM IN THE USERID JUST FOR IT TO WORK
 *
 * @param leadId id of the farmer leader that wants to get the report that was passed
 * @returns
 */
export const getReportCountThisAndPrevMonth = async (
  userId: string,
  role: allUserRoleType
): Promise<getReportCountThisAndPrevMonthReturnType[]> => {
  try {
    const cte = await cteWeekSeries();
    const filter = await dateFilter(role);
    const paramVal = role === "agriculturist" ? [] : [userId];

    return (
      await pool.query(
        `${cte}
      select concat(to_char(ws.date, 'Mon DD'), '-', to_char((ws.date + interval '6 days')::date, 'DD')) as "weekLabel", coalesce(count(r."reportId"), 0) as "reportCount" from week_series ws left join capstone.report r on ws.date <= date(r."dayReported") and (ws.date + interval '6 days')::date >= date(r."dayReported") ${filter} group by concat(to_char(ws.date, 'Mon DD'), '-', to_char((ws.date + interval '6 days')::date, 'DD')), extract(week from date) order by extract(week from date)`,
        paramVal
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon sa mga ulat na naipasa sa mga nakaraang buwan: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon sa mga ulat na naipasa sa mga nakaraang buwan`
    );
  }
};

/**
 * query to get all the report within this year per month
 *
 * IF THIS WILL USE BY THE AGRI OR THE ADMIN, JUST PASS ANY RANDOM IN THE USERID JUST FOR IT TO WORK
 *
 * @param leadId id of the farmer leader that wants to get the report that was passed
 * @returns
 */
export const getReportCountThisYear = async (
  userId: string,
  role: allUserRoleType
): Promise<getReportCountThisYearReturnType[]> => {
  try {
    const cte = await cteMonthSeries();
    const filter = await dateFilter(role);
    const paramVal = role === "agriculturist" ? [] : [userId];

    return (
      await pool.query(
        `${cte}
      select to_char(ms.date, 'Mon') as month, coalesce(count(r."reportId"), 0) as "reportCount" from month_series ms left join capstone.report r on ms.date <= date(r."dayReported") and (ms.date + interval '1 month' - interval '1 day')::date >= date(r."dayReported") ${filter} group by to_char(ms.date, 'Mon'), extract(month from ms.date) order by extract(month from ms.date)`,
        paramVal
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon sa mga ulat na naipasa ngayung taon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon sa mga ulat na naipasa ngayung taon`
    );
  }
};

/**
 * query for getting all the recent submitter report
 *
 * IF THIS WILL BE USED BY THE AGRICULTURIST OR THE ADMIN, JUST PASS A EMPTY ARRAY IN THE "leadId" ARGS
 *
 * THE DEFAULT VALUE OF WORK IS "leader" SO IF ITS FOR FARMER LEADER, YOU DONT NEED TO PASS THE VALUE "leader" FOR WORK ARGS
 *
 * @param leadId id of the leader that wanst to see it
 * @returns records of the report
 */
export const getRecentReport = async (
  param: getRecentReportParamType
): Promise<getRecentReportReturnType[]> => {
  try {
    const dynamicFilterAndParam: {
      filter: string;
      param: (string | boolean)[];
    } =
      param.userRole === "agriculturist"
        ? {
            filter: `r."verificationStatus" = $1`,
            param: [true],
          }
        : {
            filter: `o."farmerLeadId" = $1 and r."verificationStatus" = $2`,
            param: [param.leaderId, false],
          };

    return (
      await pool.query(
        `select f."farmerFirstName", f."farmerLastName", f."barangay", current_timestamp - r."dayReported" as "pastTime", r."reportId" from capstone.farmer f join capstone.report r on f."farmerId" = r."farmerId" join capstone.org o on r."orgId" = o."orgId" where ${dynamicFilterAndParam.filter} order by current_timestamp - r."dayReported" limit 4`,
        dynamicFilterAndParam.param
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga bagong pasang ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga bagong pasang ulat`
    );
  }
};

/**
 * query that gets the count pending report of the farmer
 * @param farmerId id of the farmer
 * @returns number of pending report
 */
export const getCountPendingReport = async (
  farmerId: string
): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count("reportId") from capstone.report where "farmerId" = $1 and "verificationStatus" = $2`,
        [farmerId, false]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga pending na ulat mong ipinasa: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga pending na ulat mong ipinasa`
    );
  }
};

/**
 * query for getting the total report of the farmer that was made
 * @param farmerId
 * @returns
 */
export const getCountTotalReportMade = async (
  farmerId: string
): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count("reportId") from capstone.report where "farmerId" = $1`,
        [farmerId]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga naipasa mong ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga naipasa mong ulat`
    );
  }
};

/**
 * query for geting the total of report that was approved by the farmer leader and the farmer who dont have a organization
 * @returns
 */
export const getTotalFarmerReport = async (): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count("reportId") from capstone.report where "verificationStatus" = $1 or ("verificationStatus" = $2 and "orgId" is null)`,
        [true, false]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng bilang ng mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng bilang ng mga ulat`
    );
  }
};

/**
 * get all the count of the new farmer today
 * @returns
 */
export const getTotalNewFarmerReportToday = async (): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count("reportId") from capstone.report where ("verificationStatus" = $1 or ("verificationStatus" = $2 and "orgId" is null)) and date("dayReported") = current_date`,
        [true, false]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng bilang ng mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng bilang ng mga ulat`
    );
  }
};

/**
 * query for getting the famerId of the farmer base on the report id that was given
 * @param reportId id of the report
 * @return the farmerid value
 */
export const getFarmerIdOfReport = async (
  reportId: string
): Promise<string> => {
  try {
    return (
      await pool.query(
        `select "farmerId" from capstone.report where "reportId" = $1`,
        [reportId]
      )
    ).rows[0].farmerId;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng ulat`
    );
  }
};

/**
 * query for changing the report description
 * @param desc change the current description value into this value
 * @param reportId report id that will be changed
 */
export const changeTheReportDescription = async (
  desc: string,
  reportId: string
): Promise<void> => {
  try {
    await pool.query(
      `update capstone.report set "description" = $1 where "reportId" = $2`,
      [desc, reportId]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng impormasyon ng ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag babago ng impormasyon ng ulat`
    );
  }
};

/**
 * query for getting the count of report made per crop
 * @param farmerId id of the user who wants to see the report coint
 * @returns
 */
export const getReportCountPerCropQuery = async (
  farmerId: string
): Promise<getReportCountPerCropQueryReturnType[]> => {
  try {
    return (
      await pool.query(
        `select count(r."reportId") as "reportCount", c."cropName", c."cropId" from capstone.report r join capstone.crop c on r."cropId" = c."cropId" where c."farmerId" = $1 group by c."cropName", c."cropId"`,
        [farmerId]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng bilang ng iyong ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng bilang ng iyong ulat`
    );
  }
};

export const getLatestReportQuery = async (
  farmerId: string
): Promise<getLatestReportQueryReturnType[]> => {
  try {
    return (
      await pool.query(
        `select "reportId", "title", "dayReported", "reportType" from capstone.report where "farmerId" = $1 limit 5`,
        [farmerId]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng iyong mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng iyong mga ulat`
    );
  }
};

/**
 * query for getting the recent report of the farmer user
 * @param farmerId if of the farmer
 * @returns
 */
export const getMyRecentReportQuery = async (
  farmerId: string
): Promise<getMyRecentReportQueryReturnType[]> => {
  try {
    return (
      await pool.query(
        `select  "reportId", "dayReported", "verificationStatus", "title", "reportType" from capstone.report where "farmerId" = $1 order by "dayReported" asc limit 5`,
        [farmerId]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng iyong mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng iyong mga ulat`
    );
  }
};

/**
 * query to check if the report was own by the user
 * @param farmerId id of the farmer
 * @param reportId id of the report that will be checked if owned
 * @returns boolean
 */
export const checkIfMyReport = async (
  farmerId: string,
  reportId: string
): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.report where "farmerId" = $1 and "reportId" = $2)`,
        [farmerId, reportId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari habang chinecheck kung ang report ay iyo: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang chinecheck kung ang report ay iyo`
    );
  }
};

export const getToBeDownloadReportQuery = async (
  type: reportDownloadType
): Promise<getToBeDownloadReportQueryReturnType[]> => {
  try {
    // const {
    //   condition,
    //   val,
    // }: {
    //   condition: string;
    //   val: [reportDownloadType] | [];
    // } =
    //   type === "all"
    //     ? { condition: "", val: [] }
    //     : { condition: `and r."reportType" = $3`, val: [type] };

    const select = `select f."farmerFirstName" as "FIRST NAME", f."farmerLastName" as "SURNAME", f."farmerMiddleName" as "MIDDLE NAME", f."farmerExtensionName" as "EXTENSION NAME", TO_CHAR(f."birthdate", 'Month DD, YYYY') as "DATE OF BIRTH", c."cropLocation" "FARM LOCATION", c."farmAreaMeasurement" as "FARM AREA"`;

    const from = `from capstone.report r join capstone.farmer f on r."farmerId" = f."farmerId" join capstone.crop c on r."cropId" = c."cropId"`;

    const where = `where (r."verificationStatus" = $1 or (r."verificationStatus" = $2 and r."orgId" is null))`;

    const orderBy = `order by c."cropLocation"`;

    let query = `${select} ${from} ${where}`;

    const parameter: allType[] = [true, false];

    if (type === "planting")
      query = `${select}, p."cropType" as "PLANTED CROP TYPE" ${from} join capstone.planted p on r."reportId" = p."reportId" ${where} and r."reportType" = $3 ${orderBy}`;
    else if (type === "damage")
      query = `${select}, d."totalDamageArea" as "TOTALLY DAMAGED AREA" ${from} join capstone.damage d on r."reportId" = d."reportId" ${where} and r."reportType" = $3 ${orderBy}`;
    else if (type === "harvesting")
      query = `${select}, h."totalKgHarvest" as "TOTAL HARVEST CROP" ${from} join capstone.harvested h on r."reportId" = h."reportId" ${where} and r."reportType" = $3 ${orderBy}`;

    if (type !== "all") parameter.push(type);

    console.log("query");
    console.log(query);
    console.log("parameter");
    console.log(parameter);

    return (await pool.query(query, parameter)).rows;
  } catch (error) {
    console.error(
      `Unexpected report while getting all the report that will be downloaded: ${
        (error as Error).message
      }`
    );

    throw new Error(
      `Unexpected report while getting all the report that will be downloaded`
    );
  }
};
