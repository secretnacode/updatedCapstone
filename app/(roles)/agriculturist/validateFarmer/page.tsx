import {
  ApprovedButton,
  DeleteUser,
} from "@/component/client_component/componentForAllUser";
import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { DynamicLink } from "@/component/server_component/componentForAllUser";
import { TableComponent } from "@/component/server_component/customComponent";
import { ViewAllUnvalidatedFarmer } from "@/lib/server_action/farmerUser";
import { ViewAllUnvalidatedFarmerReturnType } from "@/types";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";

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
        <RenderNotification notif={unvalidatedUser.notifError} />
      ) : (
        <TableComponent
          noContentMessage="There's no user that's been verified yet or there's no user that's signing in yet"
          listCount={unvalidatedUser.notValidatedFarmer.length}
          tableTitle="Unverfied Farmer Leaders and Farmer W/O Organization"
          tableHeaderCell={
            <>
              <th>#</th>
              <th>Name</th>
              <th>Alias</th>
              <th>Created At</th>
              <th>Verified</th>
              <th>Organization Name</th>
              <th>Organization Role</th>
              <th>Actions</th>
            </>
          }
          tableCell={
            <>
              {unvalidatedUser.notValidatedFarmer.map((farmVal, index) => (
                <tr key={farmVal.farmerId}>
                  <td>{index + 1}</td>
                  <td>{farmVal.farmerName}</td>
                  <td>{farmVal.farmerAlias}</td>
                  <td>{ReadableDateFomat(farmVal.dateCreated)}</td>
                  <td>
                    <span className="table-notice">Not verified</span>
                  </td>
                  <td>{farmVal.orgName}</td>
                  <td>{farmVal.orgRole}</td>
                  <td>
                    <div className="table-action">
                      <DynamicLink
                        baseLink="farmerUser"
                        dynamicId={farmVal.farmerId}
                        className="profile-link-button-design"
                      />

                      <ApprovedButton
                        farmerId={farmVal.farmerId}
                        verificationStatus={farmVal.verified}
                        label="Verify"
                      />

                      <DeleteUser
                        farmerId={farmVal.farmerId}
                        farmerName={farmVal.farmerName}
                        buttonLabel="Delete"
                        proceedButtonLabel="Proceed"
                        cancelButtonLabel="Cancel"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </>
          }
        />
      )}
    </>
  );
}
