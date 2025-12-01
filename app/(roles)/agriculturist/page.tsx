import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { RecentReportWidget } from "@/component/server_component/customComponent";
import {
  DashboardComponent,
  DashboardNoValComponent,
} from "@/component/server_component/dashBoard";
import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { getAgriculturistDashboardData } from "@/lib/server_action/user";
import {
  getAgriculturistDashboardDataReturnType,
  NotificationBaseType,
} from "@/types";
import { UnexpectedErrorMessageEnglish } from "@/util/helper_function/reusableFunction";
import { Archive, FileText, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ notif?: string }>;
}) {
  const { notif } = await searchParams;
  let message: NotificationBaseType[] | null = null;

  if (notif) message = JSON.parse(notif);

  let data: getAgriculturistDashboardDataReturnType;

  try {
    data = await getAgriculturistDashboardData();
  } catch (error) {
    console.error((error as Error).message);
    data = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessageEnglish(), type: "error" }],
    };
  }

  return (
    <>
      <NavbarComponent forAgri={true} currentPage="Home">
        {" "}
        <main className="flex-1 p-8">
          {message && <RenderRedirectNotification notif={message} />}

          {data.success ? (
            <DashboardComponent
              card1={{
                logo: {
                  icon: FileText,
                  iconStyle: "text-green-700",
                  iconWrapperStyle: "bg-green-200",
                },
                cardLabel: {
                  label: "Report today",
                  className: "text-green-700 bg-green-100",
                },
                cardContent: String(data.cardValue.toalNewFarmerReportToday),
                contentLabel: "Count of report",
                link: "/agriculturist/farmerReports",
              }}
              card2={{
                logo: {
                  icon: Archive,
                  iconStyle: "text-blue-700",
                  iconWrapperStyle: "bg-blue-200",
                },
                cardLabel: {
                  label: "All report",
                  className: "text-blue-700 bg-blue-100",
                },
                cardContent: String(data.cardValue.totalFarmerReport),
                contentLabel: "Count of total report",
                link: "/agriculturist/farmerReports",
              }}
              card3={{
                logo: {
                  icon: UserRound,
                  iconStyle: "text-red-700",
                  iconWrapperStyle: "bg-red-200",
                },
                cardLabel: {
                  label: "Unverified farmer user",
                  className: "text-red-700 bg-red-100",
                },
                cardContent: String(data.cardValue.totalNotVerifiedFarmer),
                contentLabel: "Total of unverified farmer",
                link: "/agriculturist/validateFarmer",
              }}
              lineChart={{
                title: "Report count of all farmers",
                user: "agriculturist",
                data: data.reportSequence,
              }}
              userLocation={"silangan"}
              widget={
                <>
                  <RecentReportWidget
                    recentReport={data.recentReport}
                    widgetTitle={"Current passed report"}
                    linkFor="agri"
                  />
                </>
              }
              showQuickAction={false}
              user="agriculturist"
            />
          ) : (
            <>
              <RenderRedirectNotification notif={data.notifError} />
              <DashboardNoValComponent />
            </>
          )}
        </main>
      </NavbarComponent>
    </>
  );
}
