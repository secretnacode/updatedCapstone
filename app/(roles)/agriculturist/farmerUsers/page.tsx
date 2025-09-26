import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { DynamicLink } from "@/component/server_component/componentForAllUser";
import { TableComponent } from "@/component/server_component/customComponent";
import { ViewAllValidatedFarmerUser } from "@/lib/server_action/farmerUser";
import { ViewAllValidatedFarmerUserReturnType } from "@/types";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";
import Link from "next/link";

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
    <>
      {!farmers.success ? (
        <RenderNotification notif={farmers.notifError} />
      ) : (
        <TableComponent
          noContentMessage="There's no user that's been verified yet or there's no user that's signing in yet"
          listCount={farmers.validatedFarmer.length}
          tableTitle="Verified Farmer Users"
          tableHeaderCell={
            <>
              <th>#</th>
              <th>Name</th>
              <th>Alias</th>
              <th>Created At</th>
              <th>Organization Name</th>
              <th>Organization Role</th>
              <th>Report Count</th>
              <th>Crop Count</th>
              <th>Actions</th>
            </>
          }
          tableCell={
            <>
              {farmers.validatedFarmer.map((farmVal, index) => (
                <tr key={farmVal.farmerId}>
                  <td>{index + 1}</td>
                  <td>{farmVal.farmerName}</td>
                  <td>{farmVal.farmerAlias}</td>
                  <td>{ReadableDateFomat(farmVal.dateCreated)}</td>
                  <td>{farmVal.orgName}</td>
                  <td>{farmVal.orgRole}</td>
                  <td>{farmVal.reportCount}</td>
                  <td>{farmVal.cropCount}</td>
                  <td>
                    <div className="table-action">
                      <DynamicLink
                        baseLink="farmerUser"
                        dynamicId={farmVal.farmerId}
                        label="Profile"
                      />

                      <Link
                        href="/"
                        className="button blue-button slimer-button text-white"
                      >
                        Reports
                      </Link>

                      <Link
                        href="/"
                        className="button submit-button slimer-button"
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
