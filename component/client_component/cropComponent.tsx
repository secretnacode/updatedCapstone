"use client";

import { GetFarmerCropInfo } from "@/lib/server_action/crop";
import {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useNotification } from "./provider/notificationProvider";
import { GetFarmerCropInfoQueryReturnType } from "@/types";
import { useLoading } from "./provider/loadingProvider";
import { X } from "lucide-react";
import { ReadableDateFomat } from "@/util/helper_function/reusableFunction";

export const ViewCropModalButton: FC<{
  cropId: string;
  isViewing: boolean;
}> = ({ cropId, isViewing }) => {
  const [viewCrop, setViewCrop] = useState<boolean>(false);
  console.log(cropId);

  const handleSplitCropId = cropId.split(", ");

  return (
    <>
      {handleSplitCropId.length > 0 ? (
        <button
          onClick={() => setViewCrop(true)}
          className="w-full px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
        >
          {cropId}
        </button>
      ) : (
        <p>Wala ka pang pananim</p>
      )}

      {viewCrop &&
        createPortal(
          <MemoViewCropModal
            cropId={cropId}
            setViewCrop={setViewCrop}
            isViewing={isViewing}
          />,
          document.body
        )}
    </>
  );
};

export const ViewCropModal: FC<{
  cropId: string;
  setViewCrop: Dispatch<SetStateAction<boolean>>;
  isViewing: boolean;
}> = ({ cropId, setViewCrop, isViewing }) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [isDoneFetching, setIsDoneFetching] = useState<boolean>(false);
  const [cropInfo, setCropInfo] = useState<GetFarmerCropInfoQueryReturnType>({
    dayPlanted: new Date(),
    cropLocation: "",
    farmAreaMeasurement: "",
  });

  const GetCrop = useCallback(
    async (cropId: string, isViewing: boolean) => {
      try {
        handleIsLoading("Kinukuha ang impormasyon ng pananim....");
        const res = await GetFarmerCropInfo(cropId, isViewing);

        if (!res.success) {
          setViewCrop(false);
          handleSetNotification(res.notifError);
        }

        if (res.success && res.cropData) setCropInfo(res.cropData);

        setIsDoneFetching(true);
      } catch (error) {
        const err = error as Error;
        handleSetNotification([{ message: err.message, type: "error" }]);
        setViewCrop(false);
      } finally {
        handleDoneLoading();
      }
    },
    [handleSetNotification, handleIsLoading, handleDoneLoading, setViewCrop]
  );

  useEffect(() => {
    GetCrop(cropId, isViewing);
  }, [GetCrop, cropId, isViewing]);

  return (
    <>
      {isDoneFetching && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Impormasyon ng Pananim
              </h2>
              <button
                onClick={() => setViewCrop(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">
                    Lokasyon ng Pananim
                  </label>
                  <p className="font-medium">{cropInfo.cropLocation}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-500">Araw Itinanim</label>
                  <p className="font-medium">
                    {cropInfo.dayPlanted
                      ? ReadableDateFomat(cropInfo.dayPlanted)
                      : "Hindi pa naitala"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-500">
                    Sukat ng Taniman
                  </label>
                  <p className="font-medium">
                    {cropInfo.farmAreaMeasurement} ektarya
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewCrop(false)}
                className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Isara
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MemoViewCropModal = memo(ViewCropModal);
