import { getFarmerLeadDashboardData } from "@/lib/server_action/user";
import { DashboardCard } from "./customComponent";
import { ClipboardCheck, Clock, FileText } from "lucide-react";
import { LineChartComponent } from "../client_component/componentForAllUser";
import { RenderNotification } from "../client_component/fallbackComponent";

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
            <div className="grid grid-cols-3 gap-4">
              <DashboardCard
                logo={
                  <div className="bg-blue-200 card-logo-wrapper">
                    <FileText className="logo  text-blue-700" />
                  </div>
                }
                cardLabel={
                  <span className="text-blue-700 bg-blue-100">
                    Ulat ng miyembro
                  </span>
                }
                cardContent={String(data.cardValue.orgMemberTotalReportToday)}
                contentLabel="Ulat ng mga miyembro"
                link={`/farmer/validateReport`}
              />

              <DashboardCard
                logo={
                  <div className="bg-orange-200 card-logo-wrapper">
                    <Clock className="logo  text-orange-700" />
                  </div>
                }
                cardLabel={
                  <span className="text-orange-700 bg-orange-100">
                    Unvalidated
                  </span>
                }
                contentLabel={"Bilang ng unvalidated na"}
                cardContent={String(data.cardValue.totalUnvalidatedReport)}
                link={`/farmer/validateReport`}
              />

              <DashboardCard
                logo={
                  <div className="bg-green-200 card-logo-wrapper">
                    <ClipboardCheck className="logo text-green-700" />
                  </div>
                }
                cardLabel={
                  <span className="text-green-700 bg-green-100">
                    Ipinasang ulat ngayon
                  </span>
                }
                contentLabel={"Bilang ng ulat ko ngayon"}
                cardContent={String(data.cardValue.totalReportMake)}
                link={`/farmer/validateReport`}
              />
            </div>

            <LineChartComponent
              title="Bilang ng mga ulat"
              user={"farmer"}
              data={data.lineChartValue}
            />
          </div>
          <div></div>
        </div>
      )}
    </>
  );
};

export const FarmerDashBoard = () => {
  return <div>farmer</div>;
};
