import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import {
  DashboardNoValComponent,
  FarmerDashBoard,
  FarmerLeadDashBoard,
} from "@/component/server_component/dashBoard";
import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { checkFarmerRole } from "@/lib/server_action/user";
import { checkFarmerRoleReturnType, NotificationBaseType } from "@/types";
import { UnexpectedErrorMessage } from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ notif?: string }>;
}) {
  const { notif } = await searchParams;
  let message: NotificationBaseType[] | null = null;
  if (notif) message = JSON.parse(notif);

  let userRole: checkFarmerRoleReturnType;

  try {
    userRole = await checkFarmerRole();
  } catch (error) {
    console.log((error as Error).message);
    userRole = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  return (
    <>
      <NavbarComponent forAgri={false} currentPage="Home" />

      <main className="flex-1 p-8">
        <div>
          {message && <RenderRedirectNotification notif={message} />}

          {userRole.success ? (
            userRole.role === "leader" ? (
              <FarmerLeadDashBoard />
            ) : (
              <FarmerDashBoard />
            )
          ) : (
            <>
              <RenderRedirectNotification notif={userRole.notifError} />
              <DashboardNoValComponent />
            </>
          )}
        </div>
      </main>
    </>
  );
}
