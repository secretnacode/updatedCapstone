import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { DynamicLink } from "@/component/server_component/componentForAllUser";
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
              <th>Farmer Leader Name</th>
              <th>Organization Name</th>
              <th>Total Member</th>
              <th>Actions</th>
            </>
          }
          tableCell={
            <>
              {availableOrgs.orgList.map((orgVal, index) => (
                <tr key={orgVal.orgId}>
                  <td>{index + 1}</td>
                  <td>{orgVal.farmerLeaderName}</td>
                  <td>{orgVal.orgName}</td>
                  <td>{orgVal.totalMember}</td>
                  <td>
                    <div className="table-action">
                      <DynamicLink
                        baseLink="farmerUser"
                        dynamicId={orgVal.farmerId}
                        label="View Leader"
                        className="profile-link-button-design"
                      />

                      <DynamicLink
                        baseLink="agriculturist/organizations"
                        dynamicId={orgVal.orgId}
                        label="View Org"
                        className="submit-button"
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
