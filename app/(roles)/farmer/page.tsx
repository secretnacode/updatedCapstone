import {
  RedirectManager,
  RenderNotification,
} from "@/component/client_component/fallbackComponent";
import {
  FarmerDashBoard,
  FarmerLeadDashBoard,
} from "@/component/server_component/dashBoard";
import { checkFarmerRole } from "@/lib/server_action/user";
import { checkFarmerRoleReturnType, NotificationBaseType } from "@/types";
import { UnexpectedErrorMessage } from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ notif?: string }>;
}) {
  // for notification
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
    <div>
      {message && <RedirectManager data={message} />}
      {userRole.success ? (
        <div className="grid grid-cols-4 gap-4"></div>
      ) : (
        <RenderNotification notif={userRole.notifError} />
      )}
      {userRole.success && userRole.role === "leader" ? (
        <FarmerLeadDashBoard />
      ) : (
        <FarmerDashBoard />
      )}
    </div>
  );
}
