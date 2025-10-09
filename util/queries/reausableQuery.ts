"use server";

import { farmerRoleType } from "@/types";

/**
 * return a date value, from this week(sunday - saturday)
 *
 * it will return all this DATE THIS WEEK and not the day of the week(e.g. monday)
 *
 * @var day_series ds
 * @example "today's date it july 3, 2025"
 * 2025-07-1 -- (sunday)  starting date
 * 2025-07-2 -- (monday)
 * 2025-07-3 -- (tuesday) todays date
 * 2025-07-4 -- (wednesday)
 * 2025-07-5 -- (thursday)
 * 2025-07-6 -- (friday)
 * 2025-07-7 -- (saturday)  ending date
 */
export const cteDaySeries = async () =>
  `with day_series as (select generate_series(date_trunc('week', current_date) - interval '1 day' , date_trunc('week', current_date ) + interval '5 days', '1 day'::interval)::date as date)`;

/**
 * return a value date per week from 1month ago to this month(if july now, its starting date is May 1)
 *
 * @var week_series ws
 *
 * @example "today's date is october 3, 2025"
 * 2025-09-01 -- starting date
 * 2025-09-08
 * 2025-09-15
 * 2025-09-22
 * 2025-09-29
 * ....
 * 2025-10-31 -- ending date
 */
export const cteWeekSeries = async () =>
  `with week_series as (select generate_series( date_trunc('month', current_date) - interval '1 month', date_trunc('month', CURRENT_DATE) + INTERVAL '1 month', '1 week'::interval)::date as date)`;

/**
 * return a date per month this year
 *
 * @var month_series ms
 *
 * @example "today's date is october 3, 2025"
 * 2025-01-01 -- starting date
 * 2025-02-01
 * 2025-03-01
 * ....
 * 2025-12-01 -- ending date
 */
export const cteMonthSeries = async () =>
  `with month_series as (select generate_series(date_trunc('year', current_date), date_trunc('year', current_date ) + interval '11 months', '1 month'::interval)::date as date)`;

/**
 * dynamic filter query that filter the date base on the role that was passed
 * @param role role of the user
 * @returns string query with parameter
 */
export const dateFilter = async (role: farmerRoleType) => {
  if (role === "leader")
    return `r."orgId" in (select "orgId" from capstone.org where "farmerLeadId" = $1)`;

  return `r."farmerId" = $1`;
};
