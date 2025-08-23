import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { UserProfileLink } from "@/component/server_component/componentForAllUser";
import { TableComponent } from "@/component/server_component/customComponent";
import { GetAllOrganization } from "@/lib/server_action/org";
import { GetAllOrganizationReturnType } from "@/types";

export default async function Page() {
  let availableOrgs: GetAllOrganizationReturnType;
  try {
    availableOrgs = await GetAllOrganization();
  } catch (error) {
    availableOrgs = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  return (
    <>
      {!availableOrgs.success ? (
        <RenderNotification notif={availableOrgs.notifError} />
      ) : (
        <TableComponent
          noContentMessage="There's no organization that was listed yet"
          listCount={availableOrgs.orgList.length}
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
              {availableOrgs.orgList.map((orgVal, index) => (
                <tr key={orgVal.orgId}>
                  <td>{index + 1}</td>
                  <td>{orgVal.orgName}</td>
                  <td>{orgVal.orgName}</td>
                  <td>{orgVal.totalMember}</td>
                  <td>
                    <div className="table-action">
                      <UserProfileLink
                        farmerId={farmVal.farmerId}
                        className="table-link"
                        label="Profile"
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
