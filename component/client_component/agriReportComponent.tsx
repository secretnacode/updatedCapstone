"use client";

import { FC } from "react";
import { ViewUserReportTableData } from "./reportComponent";

export const AgriFarmerReportAction: FC<{ reportId: string }> = ({
  reportId,
}) => {
  return (
    <>
      <ViewUserReportTableData reportId={reportId} />
    </>
  );
};
