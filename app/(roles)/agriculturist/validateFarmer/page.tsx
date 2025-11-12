import { AgriculturistValidateFarmerTable } from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { ViewAllUnvalidatedFarmer } from "@/lib/server_action/farmerUser";
import { ViewAllUnvalidatedFarmerReturnType } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let unvalidatedUser: ViewAllUnvalidatedFarmerReturnType;

  try {
    unvalidatedUser = await ViewAllUnvalidatedFarmer();
  } catch (error) {
    unvalidatedUser = {
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
    <>
      {!unvalidatedUser.success ? (
        <RenderRedirectNotification notif={unvalidatedUser.notifError} />
      ) : (
        <div className="component space-y-4">
          <div>
            <h1 className="table-title">
              Unverfied Farmer Leaders and Farmer W/O Organization
            </h1>
          </div>

          <AgriculturistValidateFarmerTable
            farmer={unvalidatedUser.notValidatedFarmer}
          />
        </div>
      )}
    </>
  );
}
