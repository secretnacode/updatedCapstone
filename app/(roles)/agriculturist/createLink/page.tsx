import {
  CopyTextButton,
  CreateResetPassOrCreateAgriButton,
  CreateResetPasswordButton,
  DateWithTimeStamp,
  DeleteLinkButton,
  ShowIsExpired,
} from "@/component/client_component/componentForAllUser";
import {
  TableComponent,
  TableNoData,
} from "@/component/server_component/customComponent";
import { getAllLinkData } from "@/lib/server_action/link";
import { getAllLinkDataReturnType } from "@/types";
import { UnexpectedErrorMessageEnglish } from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

export default async function Page() {
  let linkData: getAllLinkDataReturnType;

  try {
    linkData = await getAllLinkData();
  } catch (error) {
    console.error((error as Error).message);

    linkData = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessageEnglish(), type: "error" }],
    };
  }

  return (
    <div className="component space-y-4">
      <div className=" flex flex-row justify-between items-center mb-4">
        <p className="table-title">List of Links</p>

        {linkData.success && linkData.work === "admin" ? (
          <CreateResetPassOrCreateAgriButton />
        ) : (
          <CreateResetPasswordButton />
        )}
      </div>

      <div>
        {linkData.success ? (
          <TableComponent
            noContentMessage="There's no link has been created yet"
            listCount={linkData.links.length}
            tableClassName="!shadow-none"
            tableHeaderCell={
              <>
                <th scope="col" className="!w-[17%]">
                  <div>Name</div>
                </th>

                <th scope="col">
                  <div>Status</div>
                </th>

                <th scope="col">
                  <div>Created At</div>
                </th>

                <th scope="col">
                  <div>Expires in</div>
                </th>

                {linkData.work === "admin" && (
                  <th scope="col">
                    <div>Url for</div>
                  </th>
                )}

                <th scope="col">
                  <div>Url</div>
                </th>

                <th scope="col" className="!w-[15%]">
                  <div>Action</div>
                </th>
              </>
            }
            tableCell={
              <>
                {linkData.links.map((linkVal) => (
                  <tr key={linkVal.linkId}>
                    <td>
                      <div className=" text-gray-900">
                        {linkVal.farmerName ? (
                          <div className="flex-1 min-w-0">
                            <h3 className="truncate">{linkVal.farmerName}</h3>

                            <p className="text-sm text-gray-500 truncate">
                              {linkVal.username}
                            </p>
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0">
                            <span className="truncate">New Agriculturist</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div>
                        <ShowIsExpired expiredAt={linkVal.dateExpired} />
                      </div>
                    </td>

                    <td>
                      <div>
                        <DateWithTimeStamp date={linkVal.dateCreated} />
                      </div>
                    </td>

                    <td>
                      <div>
                        <DateWithTimeStamp date={linkVal.dateExpired} />
                      </div>
                    </td>

                    {linkData.work === "admin" && (
                      <td>
                        {linkVal.farmerName ? (
                          <div>Farmer Reset Password</div>
                        ) : (
                          <div>Create Agri Account</div>
                        )}
                      </td>
                    )}
                    <td>
                      <div className="max-w-[200px] overflow-y-hidden">
                        <p className="link">{linkVal.link}</p>
                      </div>
                    </td>

                    <td>
                      <div className="table-action">
                        <CopyTextButton
                          textToCopy={linkVal.link}
                          className="slimer-button submit-button"
                        >
                          Copy
                        </CopyTextButton>

                        <DeleteLinkButton
                          linkId={linkVal.linkId}
                          className="slimer-button cancel-button"
                        >
                          Delete
                        </DeleteLinkButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            }
          />
        ) : (
          <TableNoData message="No data available" />
        )}
      </div>
    </div>
  );
}
