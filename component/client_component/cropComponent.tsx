"use client";

import { GetFarmerCropInfo } from "@/lib/server_action/crop";
import {
  FC,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useNotification } from "./provider/notificationProvider";
import {
  FarmerCropPagePropType,
  FarmerCropPageShowModalStateType,
  GetFarmerCropInfoQueryReturnType,
  EditCropModalPropType,
  ViewCropModalButtonPropType,
} from "@/types";
import { useLoading } from "./provider/loadingProvider";
import { ClipboardPlus, X } from "lucide-react";
import {
  DateToYYMMDD,
  intoFeatureCollection,
  ReadableDateFomat,
} from "@/util/helper_function/reusableFunction";
import {
  CancelButton,
  FormCancelSubmitButton,
  SubmitButton,
  TableComponent,
} from "../server_component/customComponent";
import { MapComponent, MapMarkerComponent } from "./mapComponent";
import { polygonCoordinates } from "@/util/helper_function/barangayCoordinates";
import { MapRef } from "@vis.gl/react-maplibre";

export const ViewCropModalButton: FC<ViewCropModalButtonPropType> = ({
  cropInfo,
  isViewing,
}) => {
  const [viewCrop, setViewCrop] = useState<boolean>(false);
  const [cropIdToView, setCropIdToView] = useState<string | null>(null);

  const handleViewCrop = (cropId: string) => {
    setViewCrop(true);
    setCropIdToView(cropId);
  };

  const handleCancelViewCrop = useCallback(() => {
    setViewCrop(true);
    setCropIdToView(null);
  }, []);

  return (
    <>
      {cropInfo.length > 0 ? (
        cropInfo.map((crop) => (
          <SubmitButton
            key={crop.cropId}
            type="button"
            onClick={() => handleViewCrop(crop.cropId)}
            className="!w-full!px-3 !py-2 !text-sm !bg-green-50 !hover:bg-green-100 !text-green-700 rounded-lg transition-colors"
          >
            {crop.cropName}
          </SubmitButton>
        ))
      ) : (
        <p>Wala ka pang pananim</p>
      )}

      {viewCrop &&
        cropIdToView &&
        createPortal(
          <MemoViewCropModal
            cropId={cropIdToView}
            removeModal={handleCancelViewCrop}
            isViewing={isViewing}
          />,
          document.body
        )}
    </>
  );
};

export const ViewCropModal: FC<{
  cropId: string;
  removeModal: () => void;
  isViewing: boolean;
}> = ({ cropId, removeModal, isViewing }) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [isDoneFetching, setIsDoneFetching] = useState<boolean>(false);
  const [cropInfo, setCropInfo] = useState<GetFarmerCropInfoQueryReturnType>({
    dayPlanted: new Date(),
    cropLocation: "",
    farmAreaMeasurement: "",
  });

  useEffect(() => {
    const GetCrop = async (cropId: string, isViewing: boolean) => {
      try {
        handleIsLoading("Kinukuha ang impormasyon ng pananim....");
        const res = await GetFarmerCropInfo(cropId, isViewing);

        if (!res.success) {
          removeModal();
          handleSetNotification(res.notifError);
        }

        if (res.success && res.cropData) setCropInfo(res.cropData);

        setIsDoneFetching(true);
      } catch (error) {
        const err = error as Error;
        handleSetNotification([{ message: err.message, type: "error" }]);
        removeModal();
      } finally {
        handleDoneLoading();
      }
    };

    GetCrop(cropId, isViewing);
  }, [
    cropId,
    isViewing,
    handleSetNotification,
    handleIsLoading,
    handleDoneLoading,
    removeModal,
  ]);

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
                onClick={() => removeModal()}
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
                onClick={() => removeModal()}
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

export const FarmerCropPage: FC<FarmerCropPagePropType> = ({
  myCropInfoList,
}) => {
  const mapRef = useRef<MapRef>(null);
  const [cropIdToModify, setCropIdToModify] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<FarmerCropPageShowModalStateType>({
    addModal: false,
    editModal: false,
    deleteModal: false,
  });

  const handleViewCrop = (lng: number, lat: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], duration: 2000, zoom: 15 });

    document
      .getElementById("Map")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCloseModal = (modal: keyof FarmerCropPageShowModalStateType) => {
    setShowModal((prev) => ({ ...prev, [modal]: false }));
    setCropIdToModify(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <MapComponent
          id="Map"
          mapHeight={400}
          ref={mapRef}
          cityToHighlight={intoFeatureCollection(
            myCropInfoList.map((brgy) => ({
              type: "polygon",
              coordinates: polygonCoordinates[brgy.cropLocation],
              name: brgy.cropName,
            }))
          )}
        >
          {myCropInfoList[0].cropLat &&
            myCropInfoList[0].cropLat &&
            myCropInfoList.map((coor) => (
              <MapMarkerComponent
                key={coor.cropName}
                markerLng={coor.cropLng}
                markerLat={coor.cropLat}
              />
            ))}
        </MapComponent>
      </div>

      <div className="p-4 bg-white rounded-lg">
        <div className="mb-4 flex flex-row justify-between items-center">
          <p className="text-gray-500 font-semibold text-lg">
            Impormasyon ng iyong mga pananim
          </p>

          <SubmitButton
            type="button"
            className="flex flex-row justify-center items-center !px-4 !rounded-lg"
          >
            <ClipboardPlus className="logo !size-5" />
            <span>Magdagdag ng pananim</span>
          </SubmitButton>
        </div>

        <TableComponent
          noContentMessage={
            "Wala ka pang nakalista na impormasyon ng iyong pananim"
          }
          tableClassName="!shadow-none"
          listCount={myCropInfoList.length}
          tableHeaderCell={
            <>
              <th>Pangalan</th>
              <th>Lokasyon</th>
              <th>Sukat(HA)</th>
              <th>Araw na itinanim</th>
              <th>inaasahang araw ng pag-aani</th>
              <th></th>
            </>
          }
          tableCell={myCropInfoList.map((crop) => (
            <tr key={crop.cropName}>
              <td>{crop.cropName}</td>
              <td>{crop.cropLocation}</td>
              <td>{crop.farmAreaMeasurement}</td>
              <td>{DateToYYMMDD(new Date())}</td>
              <td>{DateToYYMMDD(new Date())}</td>
              <td>
                <div className="flex flex-row gap-1">
                  <SubmitButton
                    type="button"
                    className="slimer-button"
                    onClick={() => handleViewCrop(crop.cropLng, crop.cropLat)}
                  >
                    Tingnan
                  </SubmitButton>

                  <SubmitButton
                    type="button"
                    className="slimer-button !bg-blue-500 hover:!bg-blue-700"
                    onClick={() => {
                      setShowModal((prev) => ({ ...prev, editModal: true }));
                      setCropIdToModify(crop.cropId);
                    }}
                  >
                    Baguhin
                  </SubmitButton>

                  <CancelButton
                    className="slimer-button"
                    onClick={() => {
                      setShowModal((prev) => ({ ...prev, deleteModal: true }));
                      setCropIdToModify(crop.cropId);
                    }}
                  >
                    Tanggalin
                  </CancelButton>
                </div>
              </td>
            </tr>
          ))}
        />
      </div>
      {showModal.editModal && (
        <EditCropModal
          myCropInfoList={myCropInfoList.find(
            (crop) => crop.cropId === cropIdToModify
          )}
          hideEditCropModal={handleCloseModal}
          setCropIdToModify={setCropIdToModify}
        />
      )}
    </div>
  );
};

const EditCropModal: FC<EditCropModalPropType> = ({
  myCropInfoList,
  hideEditCropModal,
}) => {
  // check if the myCropInfoList exist, if not it will hide the modal because .find() also return undefined
  if (!myCropInfoList) hideEditCropModal("editModal");

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40"
      onClick={() => hideEditCropModal("editModal")}
    >
      <div
        className="p-4 bg-white rounded-lg w-1/2"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <form action="">
          <MapComponent mapHeight={250} />
          <div>
            <p>
              WORK IN PROGRESS: iniintay kung lalagyan ba ng function kung san
              mag rerequeset si farmer para makapag edit/dagdag ng panibagong
              set ng pananim
            </p>
          </div>
          <div>
            <FormCancelSubmitButton
              submitButtonLabel="Baguhin"
              cancelButtonLabel="Baguhin"
              cancelOnClick={() => hideEditCropModal("editModal")}
              submitType="button"
              submitClassName="slimer-button"
              cancelClassName="slimer-button"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
