import { CreateResetPassOrCreateAgriButton } from "@/component/client_component/componentForAllUser";
import {
  FormCancelSubmitButton,
  TableComponent,
} from "@/component/server_component/customComponent";

export default function Page() {
  const tableData = [
    {
      id: 1,
      name: "John Doe",
      status: "Active",
      createdAt: "2024-10-15",
      expiresIn: "30 days",
      urlFor: "Profile Access",
      url: "https://example.com/profile/johndoe",
      action: "Edit",
    },
    {
      id: 2,
      name: "Jane Smith",
      status: "Pending",
      createdAt: "2024-10-14",
      expiresIn: "15 days",
      urlFor: "Document Verification",
      url: "https://example.com/verify/janesmith",
      action: "Approve",
    },
    {
      id: 3,
      name: "Mike Johnson",
      status: "Expired",
      createdAt: "2024-09-01",
      expiresIn: "Expired",
      urlFor: "Registration Link",
      url: "https://example.com/register/mikejohnson",
      action: "Renew",
    },
    {
      id: 4,
      name: "Sarah Williams",
      status: "Active",
      createdAt: "2024-10-10",
      expiresIn: "45 days",
      urlFor: "Dashboard Access",
      url: "https://example.com/dashboard/sarahwilliams",
      action: "View",
    },
    {
      id: 5,
      name: "David Brown",
      status: "Inactive",
      createdAt: "2024-08-20",
      expiresIn: "N/A",
      urlFor: "Reset Password",
      url: "https://example.com/reset/davidbrown",
      action: "Delete",
    },
  ];

  return (
    <div className="p-4 shadow-sm rounded-xl bg-white">
      <div className=" flex flex-row justify-between items-center mb-4">
        <p className="title !text-2xl !font-bold">List of Links</p>

        <CreateResetPassOrCreateAgriButton />
      </div>

      <div>
        <TableComponent
          noContentMessage="There's no link has been created yet"
          listCount={tableData.length}
          tableClassName="!shadow-none"
          tableHeaderCell={
            <>
              <th>Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Expires in</th>
              {/*make this table col disappear if its the agriculturist that will view*/}
              <th>Url for</th>
              <th>Url</th>
              <th>Action</th>
            </>
          }
          tableCell={
            <>
              {tableData.map((farmVal) => (
                <tr key={farmVal.id}>
                  <td>{farmVal.name}</td>
                  <td>{farmVal.status}</td>
                  <td>{farmVal.createdAt}</td>
                  <td>{farmVal.expiresIn}</td>
                  <td>{farmVal.urlFor}</td>
                  <td>{farmVal.url}</td>
                  <td>
                    <div className="table-action">
                      <FormCancelSubmitButton
                        divClassName="!pt-0 !gap-2"
                        submitType="button"
                        submitButtonLabel={"Copy"}
                        submitClassName="slimer-button"
                        cancelButtonLabel={"Delete"}
                        cancelClassName="slimer-button"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </>
          }
        />
      </div>
    </div>
  );
}
