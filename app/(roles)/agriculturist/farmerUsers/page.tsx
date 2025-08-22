import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { TableComponent } from "@/component/server_component/customComponent";
import { ViewAllValidatedFarmerUser } from "@/lib/server_action/farmerUser";
import { FarmerUserPageTableListType } from "@/types";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";
import Link from "next/link";

export default async function Page() {
  const farmers = await ViewAllValidatedFarmerUser();

  return (
    <>
      {!farmers.success ? (
        <RenderNotification notif={farmers.notifError} />
      ) : (
        <TableComponent
          noContentMessage="There's no user that's been verified yet or there's no user that's signing in yet"
          listCount={farmers.validatedFarmer.length}
          tableHeaderCell={
            <>
              <th>#</th>
              <th>Name</th>
              <th>Alias</th>
              <th>Created At</th>
              <th>Verified</th>
              <th>Role</th>
              <th>Organization Name</th>
              <th>Actions</th>
            </>
          }
          tableCell={
            <>
              {farmers.validatedFarmer.map((farmVal, index) => (
                <tr key={farmVal.farmerId}>
                  <td>{index + 1}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </>
          }
          action={
            <>
              <Link
                href="/"
                className="table-link bg-orange-300 hover:bg-orange-400 active:ring-orange-800"
              >
                Profile
              </Link>

              <Link
                href="/"
                className="table-link bg-blue-300 hover:bg-blue-400 active:ring-blue-800"
              >
                Reports
              </Link>

              <Link
                href="/"
                className="table-link bg-green-300 hover:bg-green-400 active:ring-green-800"
              >
                Crops
              </Link>
            </>
          }
        />
      )}
    </>
  );
}
