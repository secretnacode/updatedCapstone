import { RenderNotification } from "@/component/client_component/fallbackComponent";
import {
  Button,
  Caption,
  Div,
  Logo,
  P,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title,
} from "@/component/server_component/elementComponent";
import { ViewAllFarmerUser } from "@/lib/server_action/farmerUser";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";
import { ClipboardX } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const farmers = await ViewAllFarmerUser();

  return (
    <Div>
      {!farmers.success && <RenderNotification notif={farmers.notifError} />}
      <Div className="max-w-7xl mx-auto space-y-6">
        <Div className="flex justify-between items-center">
          <Title className="table-title-text">Farmers</Title>
        </Div>

        {farmers.success && farmers.farmerInfo.length === 0 ? (
          <Div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Div className="space-y-3">
              <Logo logo={ClipboardX} className="table-no-content" />
              <P className="text-gray-500 !text-xl">
                Wala ka pang naisusumiteng ulat. Magdagdag ng bagong ulat upang
                masimulan.
              </P>
            </Div>
          </Div>
        ) : (
          <Div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Div className="overflow-x-auto">
              <Table>
                <Caption>Ang iyong mga report</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell scope="col">#</TableHeaderCell>

                    <TableHeaderCell scope="col">Farmer Name</TableHeaderCell>

                    <TableHeaderCell scope="col">Farmer Alias</TableHeaderCell>

                    <TableHeaderCell scope="col">Date Created</TableHeaderCell>

                    <TableHeaderCell scope="col">
                      Organization Role
                    </TableHeaderCell>

                    <TableHeaderCell scope="col">
                      Organization Name
                    </TableHeaderCell>

                    <TableHeaderCell scope="col">
                      Overall Report
                    </TableHeaderCell>

                    <TableHeaderCell scope="col">Overall Crop</TableHeaderCell>

                    <TableHeaderCell scope="col">View Action</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmers.success &&
                    farmers.farmerInfo.map((farmerVal, index) => (
                      <TableRow key={farmerVal.farmerId}>
                        <TableCell>{index + 1}</TableCell>

                        <TableCell className=" !text-gray-900 font-medium">
                          {farmerVal.farmerName}
                        </TableCell>

                        <TableCell>{farmerVal.farmerAlias}</TableCell>

                        <TableCell className="text-wra">
                          {ReadableDateFomat(farmerVal.dateCreated)}
                        </TableCell>

                        <TableCell>{farmerVal.orgRole}</TableCell>

                        <TableCell>{farmerVal.orgName}</TableCell>

                        <TableCell>{farmerVal.reportCount}</TableCell>

                        <TableCell>{farmerVal.cropCount}</TableCell>

                        <TableCell className="flex flex-row gap-2 !p-2">
                          <Link
                            href="/"
                            className="table-link bg-green-300 hover:bg-green-400 active:ring-green-800"
                          >
                            Crops
                          </Link>

                          <Link
                            href="/"
                            className="table-link bg-blue-300 hover:bg-blue-400 active:ring-blue-800"
                          >
                            Reports
                          </Link>

                          <Link
                            href="/"
                            className="table-link bg-orange-300 hover:bg-orange-400 active:ring-orange-800"
                          >
                            Profile
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
