import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { TableComponent } from "@/component/server_component/customComponent";
import { ViewAllFarmerUser } from "@/lib/server_action/farmerUser";
import { FarmerUserPageTableListType } from "@/types";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";
import Link from "next/link";

export default async function Page() {
  const farmers = await ViewAllFarmerUser();

  return (
    <>
      {!farmers.success ? (
        <RenderNotification notif={farmers.notifError} />
      ) : (
        farmers.success && (
          <TableComponent<FarmerUserPageTableListType>
            noContentMessage="There's no user that's been verified yet or there's no user that's signing in yet"
            tableList={farmers.farmerInfo.map((info) => ({
              farmerName: info.farmerName,
              farmerAlias: info.farmerAlias,
              dateCreated: ReadableDateFomat(info.dateCreated),
              orgName: info.orgName,
              orgRole: info.orgRole,
              reportCount: String(info.reportCount),
              cropCount: String(info.cropCount),
            }))}
            tableHeader={{
              farmerName: "Name",
              farmerAlias: "Alias",
              dateCreated: "Created at",
              orgName: "Organization Name",
              orgRole: "Organization Role",
              reportCount: "Amount Report",
              cropCount: "Amount Crop",
            }}
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
        )
      )}
    </>
  );
}
