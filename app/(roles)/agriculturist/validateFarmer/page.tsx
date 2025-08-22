import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { ApprovedButton } from "@/component/client_component/farmerLeaderComponent";
import { TableComponent } from "@/component/server_component/customComponent";
import { ViewAllUnvalidatedFarmer } from "@/lib/server_action/farmerUser";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";
import Link from "next/link";

export default async function Page() {
  const unvalidatedUser = await ViewAllUnvalidatedFarmer();
  return (
    <>
      {!unvalidatedUser.success ? (
        <RenderNotification notif={unvalidatedUser.notifError} />
      ) : (
        <TableComponent
          noContentMessage="There's no user that's been verified yet or there's no user that's signing in yet"
          listCount={unvalidatedUser.notValidatedFarmer.length}
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
                      <Link
                        href="/"
                        className="table-link bg-orange-300 hover:bg-orange-400 active:ring-orange-800"
                      >
                        Profile
                      </Link>

                      <ApprovedButton
                        farmerId={farmVal.farmerId}
                        verificationStatus={farmVal.verified}
                      />

                      <Link
                        href="/"
                        className="table-link bg-green-300 hover:bg-green-400 active:ring-green-800"
                      >
                        Crops
                      </Link>
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
