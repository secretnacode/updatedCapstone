import {
  RedirectManager,
  RenderNotification,
} from "@/component/client_component/fallbackComponent";
import { RecentReportWidget } from "@/component/server_component/customComponent";
import { DashboardComponent } from "@/component/server_component/dashBoard";
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
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  let message: NotificationBaseType[] | null = null;

  if (success) message = JSON.parse(success);

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
    <div>
      {message && <RedirectManager data={message} paramName="success" />}

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
            link: "/agriculturist/farmerReprots",
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
              />
            </>
          }
          showQuickAction={false}
        />
      ) : (
        <RenderNotification notif={data.notifError} />
      )}
    </div>
  );
}
