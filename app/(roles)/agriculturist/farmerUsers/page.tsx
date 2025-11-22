import { AgriculturistFarmerUserTable } from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { ViewAllValidatedFarmerUser } from "@/lib/server_action/farmerUser";
import { ViewAllValidatedFarmerUserReturnType } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let farmers: ViewAllValidatedFarmerUserReturnType;

  try {
    farmers = await ViewAllValidatedFarmerUser();
  } catch (error) {
    farmers = {
      success: false,
      notifError: [
        {
          message: (error as Error).message,
          type: "error",
        },
      ],
    };
  }

  return (
    <div className="component space-y-4">
      <div>
        <h1 className="table-title">Verified Farmer Users</h1>
      </div>

      {!farmers.success ? (
        <>
          <RenderRedirectNotification notif={farmers.notifError} />
          <AgriculturistFarmerUserTable farmer={[]} />
        </>
      ) : (
        <AgriculturistFarmerUserTable farmer={farmers.validatedFarmer} />
      )}
    </div>
  );
}
