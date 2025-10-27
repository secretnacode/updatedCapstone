import {
  CopyTextButton,
  CreateResetPassOrCreateAgriButton,
  CreateResetPasswordButton,
  DeleteLinkButton,
  ShowIsExpired,
} from "@/component/client_component/componentForAllUser";
import {
  TableComponent,
  TableNoData,
} from "@/component/server_component/customComponent";
import { getAllLinkData } from "@/lib/server_action/link";
import { getAllLinkDataReturnType } from "@/types";
import {
  ReadableDateFomat,
  UnexpectedErrorMessageEnglish,
} from "@/util/helper_function/reusableFunction";

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

  console.log(linkData);

  const tableCount = (): number => {
    if (!linkData.success) return 0;

    if (linkData.work === "admin" && linkData.createAgriLink)
      return linkData.createAgriLink.length;

    return linkData.resetPassLink.length;
  };

  return (
    <div className="p-4 shadow-sm rounded-xl bg-white">
      <div className=" flex flex-row justify-between items-center mb-4">
        <p className="title !text-2xl !font-bold">List of Links</p>

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
            listCount={tableCount()}
            tableClassName="!shadow-none"
            tableHeaderCell={
              <>
                <th>Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Expires in</th>
                {linkData.work === "admin" && <th>Url for</th>}
                <th>Url</th>
                <th>Action</th>
              </>
            }
            tableCell={
              <>
                {linkData.resetPassLink.map((linkVal) => (
                  <tr key={linkVal.linkId}>
                    <td>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {linkVal.farmerName}
                          </h3>
                        </div>

                        <p className="text-sm text-gray-500 truncate">
                          {linkVal.username}
                        </p>
                      </div>
                    </td>
                    <td>
                      <ShowIsExpired expiredAt={linkVal.dateExpired} />
                    </td>
                    <td>{ReadableDateFomat(linkVal.dateCreated)}</td>
                    <td>{ReadableDateFomat(linkVal.dateExpired)}</td>
                    {linkData.work === "admin" && <td>Reset Password</td>}
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
                {linkData.work === "admin" &&
                  linkData.createAgriLink.map((agriLink) => (
                    <tr key={agriLink.linkId}>
                      <td>New Agriculturist</td>
                      <td>
                        <ShowIsExpired expiredAt={agriLink.dateExpired} />
                      </td>
                      <td>{ReadableDateFomat(agriLink.dateCreated)}</td>
                      <td>{ReadableDateFomat(agriLink.dateExpired)}</td>
                      {linkData.work === "admin" && (
                        <td>Create Agri Account</td>
                      )}
                      <td>
                        <div className="max-w-[200px] overflow-y-hidden">
                          <p className="link">{agriLink.link}</p>
                        </div>
                      </td>
                      <td>
                        <div className="table-action">
                          <CopyTextButton
                            textToCopy={agriLink.link}
                            className="slimer-button submit-button"
                          >
                            Copy
                          </CopyTextButton>

                          <DeleteLinkButton
                            linkId={agriLink.linkId}
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
