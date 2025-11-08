import {
  getFamerLeaderDashboardData,
  getFarmerDashboardData,
} from "@/lib/server_action/user";
import {
  DashboardCard,
  WeatherSideComponentLoading,
  MyPreviousReport,
  MyRecentReportLoading,
  RecentReportWidget,
  SideComponentMyCropStatus,
  SideComponentMyCropStatusLoading,
} from "./customComponent";
import {
  Archive,
  ClipboardPen,
  Clock,
  FileText,
  UserRound,
} from "lucide-react";
import { LineChartComponent } from "../client_component/componentForAllUser";
import {
  FarmerQuickActionComponent,
  WeatherComponent,
} from "./componentForAllUser";
import { DashboardComponentPropType } from "@/types";
import { FC, Suspense } from "react";
import { RenderRedirectNotification } from "../client_component/provider/notificationProvider";

export const dynamic = "force-dynamic";

export const FarmerLeadDashBoard = async () => {
  const data = await getFamerLeaderDashboardData();

  return (
    <>
      {!data.success ? (
        <RenderRedirectNotification notif={data.notifError} />
      ) : (
        <DashboardComponent
          card1={{
            logo: {
              icon: FileText,
              iconStyle: "text-blue-700",
              iconWrapperStyle: "bg-blue-200",
            },
            cardLabel: {
              label: "Ulat ng miyembro",
              className: "text-blue-700 bg-blue-100",
            },
            cardContent: String(data.cardValue.orgMemberTotalReportToday),
            contentLabel: "Ulat ng miyembro ngayon",
            link: "/farmerLeader/validateReport",
          }}
          card2={{
            logo: {
              icon: Clock,
              iconStyle: "text-orange-700",
              iconWrapperStyle: "bg-orange-200",
            },
            cardLabel: {
              label: "Hindi kumpirmado",
              className: "text-orange-700 bg-orange-100",
            },
            cardContent: String(data.cardValue.totalUnvalidatedReport),
            contentLabel: "Hindi kumpirmadong ulat",
            link: "/farmerLeader/validateReport",
          }}
          card3={{
            logo: {
              icon: UserRound,
              iconStyle: "text-red-700",
              iconWrapperStyle: "bg-red-200",
            },
            cardLabel: {
              label: "Mga hindi beripikado",
              className: "text-red-700 bg-red-100",
            },
            cardContent: String(data.cardValue.totalUnverfiedUser),
            contentLabel: "Hindi beripikadong mga user",
            link: "/farmerLeader/orgMember",
          }}
          lineChart={{
            title: "Bilang ng mga ulat sa organisasyon",
            user: "farmer",
            data: data.reportSequence,
          }}
          userLocation={data.userLocation}
          widget={
            <>
              <RecentReportWidget
                recentReport={data.recentReport}
                widgetTitle={"Mga nag pasa ng ulat"}
              />
            </>
          }
          user="leader"
        />
      )}
    </>
  );
};

export const FarmerDashBoard = async () => {
  const data = await getFarmerDashboardData();

  return (
    <>
      {!data.success ? (
        <RenderRedirectNotification notif={data.notifError} />
      ) : (
        <DashboardComponent
          card1={{
            logo: {
              icon: ClipboardPen,
              iconStyle: "text-green-700",
              iconWrapperStyle: "bg-green-200",
            },
            cardLabel: {
              label: "Ulat mo",
              className: "text-green-700 bg-green-100",
            },
            cardContent: String(data.cardValue.countMadeReportToday),
            contentLabel: "Mga Ulat mo ngayon",
            link: "/farmer/report",
          }}
          card2={{
            logo: {
              icon: Archive,
              iconStyle: "text-blue-700",
              iconWrapperStyle: "bg-blue-200",
            },
            cardLabel: {
              label: "Iyong mga ulat",
              className: "text-blue-700 bg-blue-100",
            },
            cardContent: String(data.cardValue.countTotalReportMade),
            contentLabel: "Lahat ng iyong ulat",
            link: "/farmer/report",
          }}
          card3={{
            logo: {
              icon: FileText,
              iconStyle: "text-orange-700",
              iconWrapperStyle: "bg-orange-200",
            },
            cardLabel: {
              label: "Mga hindi pa nakukumpirma",
              className: "text-orange-700 bg-orange-100",
            },
            cardContent: String(data.cardValue.countPendingReport),
            contentLabel: "Hindi kumpirmadong mga ulat",
            link: "/farmer/report",
          }}
          lineChart={{
            title: "Bilang ng aking mga ulat",
            user: "farmer",
            data: data.reportSequence,
          }}
          userLocation={data.userLocation}
          user="farmer"
        />
      )}
    </>
  );
};

export const DashboardComponent: FC<DashboardComponentPropType> = ({
  user,
  card1,
  card2,
  card3,
  lineChart,
  userLocation,
  widget,
  showQuickAction = true,
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

        {user === "leader" ||
          (user === "farmer" && (
            <Suspense fallback={<MyRecentReportLoading />}>
              <MyPreviousReport user={user} />
            </Suspense>
          ))}
      </div>

      <div className="side-bar-wrapper ">
        <Suspense fallback={<WeatherSideComponentLoading />}>
          <WeatherComponent userLocation={userLocation} user={user} />
        </Suspense>

        <Suspense fallback={<SideComponentMyCropStatusLoading />}>
          <SideComponentMyCropStatus />
        </Suspense>

        {widget}

        {showQuickAction && <FarmerQuickActionComponent />}
      </div>
    </div>
  );
};
