"use client";

import { FC } from "react";
import { ViewUserReportTableData } from "./reportComponent";
import { useLoading } from "./provider/loadingProvider";
import { useNotification } from "./provider/notificationProvider";
import { ErrorResponseType } from "@/types";
import { ApprovedOrgMember } from "@/lib/server_action/report";
import { ApprovedOrgFarmerAcc } from "@/lib/server_action/farmerUser";
import { useRouter } from "next/navigation";

export const ViewMemberReport: FC<{
  reportId: string;
}> = ({ reportId }) => {
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();

  const handleApprovedMember = async () => {
    try {
      handleIsLoading("Inaabprubahan");
      const res = await ApprovedOrgMember(reportId);

      if (!res.success) throw { errors: res.notifError };
    } catch (error) {
      const err = error as ErrorResponseType;
      console.log(err.errors);
      handleSetNotification(err.errors);
      handleDoneLoading();
    }
  };

  return (
    <>
      <button className="cursor-pointer" onClick={handleApprovedMember}>
        Apprubahan
      </button>
      <ViewUserReportTableData reportId={reportId} />
    </>
  );
};

export const FarmerOrgMemberAction: FC<{
  farmerId: string;
  verificationStatus: boolean;
}> = ({ farmerId, verificationStatus }) => {
  const router = useRouter();
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleApproveFarmerAcc = async () => {
    try {
      handleIsLoading(`Inaaprubahan na ang account!!!`);

      const approveAcc = await ApprovedOrgFarmerAcc(farmerId);

      handleSetNotification(approveAcc.notifMessage);
      if (approveAcc.refresh) router.refresh();
    } catch (error) {
      const err = error as Error;
      console.log(`Error in approving the farmer account: ${err.message}`);
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      handleDoneLoading();
    }
  };
  return (
    <div>
      <button className="cursor-pointer">Tingnan</button>
      <button
        className="cursor-pointer"
        disabled={verificationStatus}
        onClick={handleApproveFarmerAcc}
      >
        Aprubahan
      </button>
      <button className="cursor-pointer">Tanggalin</button>
    </div>
  );
};
