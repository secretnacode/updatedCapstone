"use client";

import { FC, useState } from "react";
import { ViewUserReportTableData } from "./reportComponent";
import { useLoading } from "./provider/loadingProvider";
import { ApprovedOrgMember } from "@/lib/server_action/report";
import { ApprovedOrgFarmerAcc } from "@/lib/server_action/farmerUser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteModalNotif } from "./componentForAllUser";
import { createPortal } from "react-dom";
import { useNotification } from "./provider/notificationProvider";
import {
  ApprovedButtonPropType,
  ErrorResponseType,
  UserProfileLinkPropType,
} from "@/types";

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
  farmerName: string;
}> = ({ farmerId, verificationStatus, farmerName }) => {
  const [userDelete, setUserDelete] = useState<boolean>(false);
  return (
    <div>
      <UserProfileLink farmerId={farmerId} />

      <ApprovedButton
        farmerId={farmerId}
        verificationStatus={verificationStatus}
      />
      <button className="cursor-pointer" onClick={() => setUserDelete(true)}>
        Tanggalin
      </button>

      {userDelete &&
        createPortal(
          <DeleteModalNotif
            farmerId={farmerId}
            farmerName={farmerName}
            setShowDeleteModal={setUserDelete}
          />,
          document.body
        )}
    </div>
  );
};

export const ApprovedButton: FC<ApprovedButtonPropType> = ({
  farmerId,
  verificationStatus,
  label = "Aprubahan",
}) => {
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
    <button
      className="button submit-button"
      disabled={verificationStatus}
      onClick={handleApproveFarmerAcc}
    >
      {label}
    </button>
  );
};

export const UserProfileLink: FC<UserProfileLinkPropType> = ({
  farmerId,
  label = "Tingnan",
  className = "",
}) => {
  return (
    <Link
      className={`profile-link ${className}`}
      href={`/farmerUser/${farmerId}`}
    >
      {label}
    </Link>
  );
};
