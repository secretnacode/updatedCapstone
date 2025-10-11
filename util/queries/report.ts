import {
  AddNewFarmerReportQueryType,
  farmerRoleType,
  GetAllFarmerReportQueryReturnType,
  GetFarmerReportDetailQueryReturnType,
  GetOrgMemberReportQueryType,
  getRecentReportReturnType,
  getReportCountThisAndPrevMonthReturnType,
  getReportCountThisWeekReturnType,
  getReportCountThisYearReturnType,
  getTotalFarmerStatusType,
  GetUserReportReturnType,
  verificationStatusType,
} from "@/types";
import { pool } from "../configuration";
import {
  cteDaySeries,
  cteMonthSeries,
  cteWeekSeries,
  dateFilter,
} from "./reausableQuery";

export const GetUserReport = async (
  userId: string
): Promise<GetUserReportReturnType> => {
  try {
    return (
      await pool.query(
        `select r."reportId", r."verificationStatus",  r."dayReported", r."dayHappen",  r."title", c."cropName" from capstone.report r join capstone.crop c on r."cropId" = c."cropId" where r."farmerId" = $1`,
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
 * query for inserting the new value of the report in the db
 * @param data are the needed value in the insertion
 */
export const AddNewFarmerReport = async (
  data: AddNewFarmerReportQueryType
): Promise<void> => {
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

export const GetFarmerReportDetailQuery = async (
  reportId: string
): Promise<GetFarmerReportDetailQueryReturnType> => {
  try {
    return (
      await pool.query(
        `SELECT r."cropId", r."verificationStatus", r."dayReported", r."dayHappen", r."title", r."description", string_agg(i."imageUrl", ', ') as pictures from capstone.report r left join capstone.image i ON r."reportId" = i."reportId" WHERE r."reportId" = $1 GROUP BY r."reportId", r."cropId", r."verificationStatus", r."dayReported", r."dayHappen", r."title"`,
        [reportId]
      )
    ).rows[0];
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
): Promise<GetOrgMemberReportQueryType> => {
  try {
    return (
      await pool.query(
        `select r."reportId", r."verificationStatus", r."dayReported", r."title", f."farmerFirstName", f."farmerLastName", f."farmerAlias" from capstone.report r join capstone.farmer f on f."farmerId" = r."farmerId" where f."orgId" = $1 order by case when r."verificationStatus" = $2 then $3 else $4 end asc`,
        [orgId, "false", 1, 2]
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
export const ApprovedOrgMemberQuery = async (
  reportId: string,
  verificationStatus: verificationStatusType
) => {
  try {
    await pool.query(
      `update capstone.report set "verificationStatus" = $1, "orgId" = (select f."orgId" from capstone.farmer f join capstone.report r on f."farmerId" = r."farmerId" where r."reportId" = $2), "dayVerified" = $3 where "reportId" = $4`,
      [verificationStatus, reportId, new Date(), reportId]
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
export const GetAllFarmerReportQuery =
  async (): Promise<GetAllFarmerReportQueryReturnType> => {
    try {
      return (
        await pool.query(
          `select r."reportId", c."cropLocation", r."verificationStatus", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", r."dayReported", r."dayHappen", o."orgName" from capstone.report r join capstone.farmer f on r."farmerId" = f."farmerId" left join capstone.org o on r."orgId" = o."orgId" left join capstone.crop c on r."cropId" = c."cropId" where r."verificationStatus" = $1 or f."orgId" is null`,
          ["pending"]
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
        `select count(r."title") from capstone.report r left join capstone.farmer f on r."farmerId" = f."farmerId" join capstone.org o on f."orgId" = o."orgId" join capstone.farmer fl on o."farmerLeadId" = fl."farmerId" where fl."farmerId" = $1 and date(r."dayReported") = current_date`,
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
        `select count(r."verificationStatus") from capstone.report r left join capstone.farmer f on r."farmerId" = f."farmerId" join capstone.org o on f."orgId" = o."orgId" join capstone.farmer fl on o."farmerLeadId" = fl."farmerId" where fl."farmerId" = $1 and r."verificationStatus" = $2`,
        [farmerLeadId, "false"]
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
 * query to get all the report within this week for the leader
 * @param leadId id of the farmer leader that wants to get the report that was passed
 * @returns
 */
export const getReportCountThisWeek = async (
  userId: string,
  role: farmerRoleType
): Promise<getReportCountThisWeekReturnType[]> => {
  try {
    const cte = await cteDaySeries();
    const filter = await dateFilter(role);
    return (
      await pool.query(
        `${cte}
      select to_char(ds.date, 'FMDay') as "dayOfWeek", coalesce(count(r."reportId"), 0) as "reportCount" from day_series ds left join capstone.report r on date(r."dayReported") = ds.date and ${filter} group by ds.date, to_char(ds.date, 'FMDay') order by ds.date`,
        [userId]
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

export const getReportCountThisAndPrevMonth = async (
  userId: string,
  role: farmerRoleType
): Promise<getReportCountThisAndPrevMonthReturnType[]> => {
  try {
    const cte = await cteWeekSeries();
    const filter = await dateFilter(role);
    return (
      await pool.query(
        `${cte}
      select concat(to_char(ws.date, 'Mon DD'), '-', to_char((ws.date + interval '6 days')::date, 'DD')) as "weekLabel", coalesce(count(r."reportId"), 0) as "reportCount" from week_series ws left join capstone.report r on ws.date <= date(r."dayReported") and (ws.date + interval '6 days')::date >= date(r."dayReported") and ${filter} group by concat(to_char(ws.date, 'Mon DD'), '-', to_char((ws.date + interval '6 days')::date, 'DD')), extract(week from date) order by extract(week from date)`,
        [userId]
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

export const getReportCountThisYear = async (
  userId: string,
  role: farmerRoleType
): Promise<getReportCountThisYearReturnType[]> => {
  try {
    const cte = await cteMonthSeries();
    const filter = await dateFilter(role);
    return (
      await pool.query(
        `${cte}
      select to_char(ms.date, 'Mon') as month, coalesce(count(r."reportId"), 0) as "reportCount" from month_series ms left join capstone.report r on ms.date <= date(r."dayReported") and (ms.date + interval '1 month' - interval '1 day')::date >= date(r."dayReported") and ${filter} group by to_char(ms.date, 'Mon'), extract(month from ms.date) order by extract(month from ms.date)`,
        [userId]
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
 * @param leadId id of the leader that wanst to see it
 * @returns records of the report
 */
export const getRecentReport = async (
  leadId: string
): Promise<getRecentReportReturnType[]> => {
  try {
    return (
      await pool.query(
        `select f."farmerFirstName", f."farmerLastName", f."barangay", current_timestamp - r."dayReported" as "pastTime", r."reportId" from capstone.farmer f join capstone.report r on f."farmerId" = r."farmerId" join capstone.org o on r."orgId" = o."orgId" where o."farmerLeadId" = $1 and r."verificationStatus" = $2 order by current_timestamp - r."dayReported" limit 4`,
        [leadId, "false"]
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
        [farmerId, "false"]
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
    const status: getTotalFarmerStatusType = {
      pending: "pending",
      false: "false",
    };

    return (
      await pool.query(
        `select count("reportId") from capstone.report where "verificationStatus" = $1 or ("verificationStatus" = $2 and "orgId" is $3)`,
        [status.pending, status.false, "null"]
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
