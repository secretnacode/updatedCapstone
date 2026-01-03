import { AgriculturistValidateFarmerTable } from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { ViewAllUnvalidatedFarmer } from "@/lib/server_action/farmerUser";
import { ViewAllUnvalidatedFarmerReturnType } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroFarm",
  description:
    "Validating page where it can only validate the newly signed in farmer that has no organization and a new farmer leader",
  robots: { index: false, follow: false },
};

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
    <div className="component space-y-4">
      <div>
        <h1 className="table-title">
          Unverfied Farmer Leaders and Farmer W/O Organization
        </h1>
      </div>

      {!unvalidatedUser.success ? (
        <>
          <RenderRedirectNotification notif={unvalidatedUser.notifError} />
          <AgriculturistValidateFarmerTable farmer={[]} />
        </>
      ) : (
        <AgriculturistValidateFarmerTable
          farmer={unvalidatedUser.notValidatedFarmer}
        />
      )}
    </div>
  );
}
