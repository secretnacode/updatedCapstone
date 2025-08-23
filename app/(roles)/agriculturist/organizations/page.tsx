import { RenderNotification } from "@/component/client_component/fallbackComponent";
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
                      <UserProfileLink
                        farmerId={farmVal.farmerId}
                        className="table-link"
                        label="Profile"
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
