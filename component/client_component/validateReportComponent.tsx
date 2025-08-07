"use client";

import { FC } from "react";
import { ViewUserReportTableData } from "./reportComponent";
import { useLoading } from "./provider/loadingProvider";
import { useNotification } from "./provider/notificationProvider";
import { ErrorResponseType } from "@/types";
import { ApprovedOrgMember } from "@/lib/server_action/report";

export const ViewMemberReport: FC<{ reportId: string }> = ({ reportId }) => {
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
