import {
  getFarmerDashboardData,
  getFarmerLeadDashboardData,
} from "@/lib/server_action/user";
import { DashboardCard } from "./customComponent";
import {
  Archive,
  ClipboardPlus,
  Clock,
  FileText,
  UserRound,
  Wheat,
} from "lucide-react";
import { LineChartComponent } from "../client_component/componentForAllUser";
import { RenderNotification } from "../client_component/fallbackComponent";
import Link from "next/link";
import {
  FarmerQuickActionComponent,
  WeatherComponent,
} from "./componentForAllUser";
import { DashboardComponentPropType } from "@/types";
import { FC } from "react";

export const dynamic = "force-dynamic";

export const FarmerLeadDashBoard = async () => {
  const data = await getFarmerLeadDashboardData();

  return (
    <>
      {!data.success ? (
        <RenderNotification notif={data.notifError} />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4 [&>div]:shadow-sm">
              <DashboardCard
                logo={{
                  icon: FileText,
                  iconStyle: "text-blue-700",
                  iconWrapperStyle: "bg-blue-200",
                }}
                cardLabel={{
                  label: "Ulat ng miyembro",
                  className: "text-blue-700 bg-blue-100",
                }}
                cardContent={String(data.cardValue.orgMemberTotalReportToday)}
                contentLabel="Ulat ng miyembro ngayon"
                link={`/farmer/validateReport`}
              />

              <DashboardCard
                logo={{
                  icon: Clock,
                  iconStyle: " text-orange-700",
                  iconWrapperStyle: "bg-orange-200",
                }}
                cardLabel={{
                  label: "Unvalidated",
                  className: "text-orange-700 bg-orange-100",
                }}
                contentLabel={"Hindi kumpirmadong ulat"}
                cardContent={String(data.cardValue.totalUnvalidatedReport)}
                link={`/farmer/validateReport`}
              />

              <DashboardCard
                logo={{
                  icon: UserRound,
                  iconStyle: " text-red-700",
                  iconWrapperStyle: "bg-red-200",
                }}
                cardLabel={{
                  label: "Ipinasang ulat ngayon",
                  className: "text-red-700 bg-red-100",
                }}
                contentLabel={"Hindi beripikadong user"}
                cardContent={String(data.cardValue.totalUnverfiedUser)}
                link={`/farmer/validateReport`}
              />
            </div>

            <LineChartComponent
              title="Bilang ng mga ulat"
              user={"farmer"}
              data={data.lineChartValue}
            />
          </div>
          <div className="flex flex-col gap-4 [&>div]:rounded-xl [&>div]:p-6 [&>div]:bg-white [&>div]:shadow-sm ">
            <WeatherComponent userLocation={data.userLocation} />
            <div>
              <div className="card-title-wrapper">
                <p className="font-semibold">Bagong pasa ng report</p>
              </div>

              <div className="grid gap-1 [&>div]:not-last:pb-1 [&>div]:not-last:border-b [&>div]:not-last:border-gray-300">
                {data.recentReport.map((val) => {
                  const timePass = () => {
                    if (val.pastTime.days ?? 0 > 0)
                      return `${val.pastTime.days} day/s`;
                    else if (val.pastTime.hours ?? 0 > 0)
                      return `${val.pastTime.hours} hr/s`;
                    else if (val.pastTime.minutes ?? 0 > 0)
                      return `${val.pastTime.minutes} min/s`;
                    else return `0min`;
                  };

                  return (
                    <div key={val.reportId} className="grid grid-cols-4">
                      <div className="flex items-center justify-center">
                        <p className="text-gray-700 size-9 rounded-full bg-gray-100 grid place-items-center">
                          {val.farmerFirstName.charAt(0) +
                            val.farmerLastName.charAt(0)}
                        </p>
                      </div>

                      <div className="col-span-2 flex flex-col justify-center items-start leading-4">
                        <p className="">
                          {val.farmerFirstName + " " + val.farmerLastName}
                        </p>
                        <p className="very-small-text text-gray-400 tracking-wide">
                          {val.barangay.charAt(0).toUpperCase() +
                            val.barangay.slice(1)}
                        </p>
                      </div>

                      <p className="text-gray-500 very-very-small-text grid place-items-center">
                        {timePass()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <FarmerQuickActionComponent />
          </div>
        </div>
      )}
    </>
  );
};

export const FarmerDashBoard = async () => {
  const data = await getFarmerDashboardData();

  return (
    <>
      {!data.success ? (
        <RenderNotification notif={data.notifError} />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4 [&>div]:shadow-sm">
              <DashboardCard
                logo={{
                  icon: FileText,
                  iconStyle:
                    data.work === "leader" ? "text-blue-700" : "text-green-700",
                  iconWrapperStyle:
                    data.work === "leader" ? "bg-blue-200" : "bg-green-200",
                }}
                cardLabel={{
                  label:
                    data.work === "leader" ? "Ulat ng miyembro" : "Ulat mo",
                  className:
                    data.work === "leader"
                      ? "text-blue-700 bg-blue-100 "
                      : "text-green-700 bg-green-100",
                }}
                cardContent={String(
                  data.work === "leader"
                    ? data.cardValue.orgMemberTotalReportToday
                    : data.cardValue.countMadeReportToday
                )}
                contentLabel={`${
                  data.work === "leader"
                    ? "Ulat ng miyembro ngayon"
                    : "Mga Ulat mo ngayon"
                }`}
                link={`${
                  data.work === "leader"
                    ? "/farmer/validateReport"
                    : "farmer/report"
                }`}
              />

              <DashboardCard
                logo={{
                  icon: data.work === "leader" ? Clock : Archive,
                  iconStyle:
                    data.work === "leader"
                      ? "text-orange-700"
                      : "text-blue-700",
                  iconWrapperStyle:
                    data.work === "leader" ? "bg-orange-200" : "bg-blue-200",
                }}
                cardLabel={{
                  label: "Unvalidated",
                  className:
                    data.work === "leader"
                      ? "text-orange-700 bg-orange-100"
                      : "text-blue-700 bg-blue-100",
                }}
                contentLabel={`${
                  data.work === "leader"
                    ? "Hindi kumpirmadong ulat"
                    : "Lahat ng iyong ulat"
                }`}
                cardContent={String(
                  data.work === "leader"
                    ? data.cardValue.totalUnvalidatedReport
                    : data.cardValue.countTotalReportMade
                )}
                link={`${
                  data.work === "leader"
                    ? "/farmer/validateReport"
                    : "farmer/report"
                }`}
              />

              <DashboardCard
                logo={{
                  icon: UserRound,
                  iconStyle: " text-red-700",
                  iconWrapperStyle: "bg-red-200",
                }}
                cardLabel={{
                  label: "Ipinasang ulat ngayon",
                  className: "text-red-700 bg-red-100",
                }}
                contentLabel={"Hindi beripikadong user"}
                cardContent={String(
                  data.work === "leader"
                    ? data.cardValue.totalUnverfiedUser
                    : data.cardValue.countPendingReport
                )}
                link={`/farmer/validateReport`}
              />
            </div>

            <LineChartComponent
              title="Bilang ng mga ulat"
              user={"farmer"}
              data={data.lineChartValue}
            />
          </div>
          <div className="flex flex-col gap-4 [&>div]:rounded-xl [&>div]:p-6 [&>div]:bg-white [&>div]:shadow-sm ">
            <WeatherComponent userLocation={data.userLocation} />

            {data.work === "leader" && data.recentReport && (
              <div>
                <div className="card-title-wrapper">
                  <p className="font-semibold">Bagong pasa ng report</p>
                </div>

                <div className="grid gap-1 [&>div]:not-last:pb-1 [&>div]:not-last:border-b [&>div]:not-last:border-gray-300">
                  {data.recentReport.map((val) => {
                    const timePass = () => {
                      if (val.pastTime.days ?? 0 > 0)
                        return `${val.pastTime.days} day/s`;
                      else if (val.pastTime.hours ?? 0 > 0)
                        return `${val.pastTime.hours} hr/s`;
                      else if (val.pastTime.minutes ?? 0 > 0)
                        return `${val.pastTime.minutes} min/s`;
                      else return `0min`;
                    };

                    return (
                      <div key={val.reportId} className="grid grid-cols-4">
                        <div className="flex items-center justify-center">
                          <p className="text-gray-700 size-9 rounded-full bg-gray-100 grid place-items-center">
                            {val.farmerFirstName.charAt(0) +
                              val.farmerLastName.charAt(0)}
                          </p>
                        </div>

                        <div className="col-span-2 flex flex-col justify-center items-start leading-4">
                          <p className="">
                            {val.farmerFirstName + " " + val.farmerLastName}
                          </p>
                          <p className="very-small-text text-gray-400 tracking-wide">
                            {val.barangay.charAt(0).toUpperCase() +
                              val.barangay.slice(1)}
                          </p>
                        </div>

                        <p className="text-gray-500 very-very-small-text grid place-items-center">
                          {timePass()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <FarmerQuickActionComponent />
          </div>
        </div>
      )}
    </>
  );
};

export const DashboardComponent: FC<DashboardComponentPropType> = ({
  card1,
  card2,
  card3,
  lineChart,
  userLocation,
  widget,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4 [&>div]:shadow-sm">
          <DashboardCard {...card1} />

          <DashboardCard {...card2} />

          <DashboardCard {...card3} />
        </div>

        <LineChartComponent {...lineChart} />
      </div>
      <div className="flex flex-col gap-4 [&>div]:rounded-xl [&>div]:p-6 [&>div]:bg-white [&>div]:shadow-sm ">
        <WeatherComponent userLocation={userLocation} />

        {widget}
        {/* <div>
          <div className="card-title-wrapper">
            <p className="font-semibold">Bagong pasa ng report</p>
          </div>

          <div className="grid gap-1 [&>div]:not-last:pb-1 [&>div]:not-last:border-b [&>div]:not-last:border-gray-300">
            {data.recentReport.map((val) => {
              const timePass = () => {
                if (val.pastTime.days ?? 0 > 0)
                  return `${val.pastTime.days} day/s`;
                else if (val.pastTime.hours ?? 0 > 0)
                  return `${val.pastTime.hours} hr/s`;
                else if (val.pastTime.minutes ?? 0 > 0)
                  return `${val.pastTime.minutes} min/s`;
                else return `0min`;
              };

              return (
                <div key={val.reportId} className="grid grid-cols-4">
                  <div className="flex items-center justify-center">
                    <p className="text-gray-700 size-9 rounded-full bg-gray-100 grid place-items-center">
                      {val.farmerFirstName.charAt(0) +
                        val.farmerLastName.charAt(0)}
                    </p>
                  </div>

                  <div className="col-span-2 flex flex-col justify-center items-start leading-4">
                    <p className="">
                      {val.farmerFirstName + " " + val.farmerLastName}
                    </p>
                    <p className="very-small-text text-gray-400 tracking-wide">
                      {val.barangay.charAt(0).toUpperCase() +
                        val.barangay.slice(1)}
                    </p>
                  </div>

                  <p className="text-gray-500 very-very-small-text grid place-items-center">
                    {timePass()}
                  </p>
                </div>
              );
            })}
          </div>
        </div> */}

        <FarmerQuickActionComponent />
      </div>
    </div>
  );
};
