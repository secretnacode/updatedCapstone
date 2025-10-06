import { getFarmerLeadDashboardData } from "@/lib/server_action/user";
import { DashboardCard } from "./customComponent";
import { ClipboardPlus, Clock, FileText, UserRound, Wheat } from "lucide-react";
import { LineChartComponent } from "../client_component/componentForAllUser";
import { RenderNotification } from "../client_component/fallbackComponent";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const FarmerLeadDashBoard = async () => {
  const data = await getFarmerLeadDashboardData();

  if (data.success) console.log(data.recentReport);

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
                contentLabel="Ulat ng mga miyembro"
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
          <div className="flex flex-col gap-4 [&>div]:rounded-xl [&>div]:p-6 [&>div]:bg-white [&>div]:shadow-sm [&>div]:[&>p]:first:mb-6 [&>div]:[&>p]:first:font-semibold">
            <div>
              <p className="font-semibold">Bagong pasa ng report</p>

              <div className="grid gap-1 [&>div]:not-last:pb-1 [&>div]:not-last:border-b [&>div]:not-last:border-gray-300">
                {data.recentReport.map((val) => {
                  const timePass = () => {
                    if (val.pastTime.days ?? 0 > 0)
                      return `${val.pastTime.days}min`;
                    else if (val.pastTime.hours ?? 0 > 0)
                      return `${val.pastTime.hours}min`;
                    else if (val.pastTime.minutes ?? 0 > 0)
                      return `${val.pastTime.minutes}min`;
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

            <div>
              <p>Mabilisang Pag gawa</p>
              <div className="flex flex-col space-y-4 [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:border [&>a]:border-gray-300 [&>a]:hover:bg-gray-100 [&>a]:rounded-md [&>a]:p-2">
                <Link href={`/farmer/report`}>
                  <ClipboardPlus className="logo !size-5" />
                  <span>Mag gawa ng ulat</span>
                </Link>
                <Link href={"/farmer/crop"}>
                  <Wheat className="logo !size-5" />
                  <span>Mag dagdag ng pananim</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const FarmerDashBoard = () => {
  return <div>farmer</div>;
};
