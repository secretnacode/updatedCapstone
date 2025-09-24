"use client";

import {
  DeleteUserCropInfo,
  GetFarmerCropInfo,
  UpdateUserCropInfo,
} from "@/lib/server_action/crop";
import {
  ChangeEvent,
  FC,
  FormEvent,
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
  FarmerSecondDetailFormType,
  FormErrorType,
  barangayType,
  intoFeatureCollectionDataParam,
  DeleteUserCropInfoReturnType,
  FarmerCropPageHandleOpenModalParamType,
} from "@/types";
import { useLoading } from "./provider/loadingProvider";
import { ClipboardPlus, X } from "lucide-react";
import {
  getBrgyCoordinate,
  intoFeatureCollection,
  mapZoomValByBarangay,
  pickBrgyFirst,
  pointIsInsidePolygon,
  ReadableDateFomat,
  UnexpectedErrorMessage,
} from "@/util/helper_function/reusableFunction";
import {
  CancelButton,
  CropForm,
  FormCancelSubmitButton,
  ModalNotice,
  SubmitButton,
  TableComponent,
} from "../server_component/customComponent";
import { MapComponent, MapMarkerComponent } from "./mapComponent";
import { polygonCoordinates } from "@/util/helper_function/barangayCoordinates";
import { MapMouseEvent, MapRef } from "@vis.gl/react-maplibre";

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
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();
  const [cropIdToModify, setCropIdToModify] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<FarmerCropPageShowModalStateType>({
    addModal: false,
    editModal: false,
    deleteModal: false,
    cropHasReportModal: false,
  });

  const handleViewCrop = (lng: number, lat: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], duration: 2000, zoom: 15 });

    document
      .getElementById("Map")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpenModal = (
    openModal: FarmerCropPageHandleOpenModalParamType
  ) => {
    setShowModal((prev) => ({ ...prev, [openModal.modalName]: true }));

    if ("cropId" in openModal) setCropIdToModify(openModal.cropId);
  };

  const handleCloseModal = (modal: keyof FarmerCropPageShowModalStateType) => {
    setShowModal((prev) => ({ ...prev, [modal]: false }));
    setCropIdToModify(null);
  };

  // make this to avoid multiple layer in the map because the crop info can have multiple same location
  const handleCityToLight = (): intoFeatureCollectionDataParam[] => {
    return myCropInfoList.reduce(
      (acc: intoFeatureCollectionDataParam[], info) => {
        if (acc.some((val) => val.name === info.cropLocation)) {
          return acc;
        }

        return [
          ...acc,
          {
            type: "polygon",
            coordinates: polygonCoordinates[info.cropLocation],
            name: info.cropLocation,
          },
        ] as intoFeatureCollectionDataParam[];
      },
      []
    );
  };

  const handleDeleteCrop = async () => {
    try {
      handleCloseModal("deleteModal");
      handleIsLoading("Tinatanggal na ang iyong pananim");

      let deleteCrop: DeleteUserCropInfoReturnType;

      if (cropIdToModify) deleteCrop = await DeleteUserCropInfo(cropIdToModify);
      else throw new Error("No cropId was passed in the server action");

      if (!deleteCrop.success && deleteCrop.openNotifModal)
        handleOpenModal({ modalName: "cropHasReportModal" });

      handleSetNotification(deleteCrop.notifMessage);
    } catch (error) {
      console.log((error as Error).message);
      handleSetNotification([
        { message: UnexpectedErrorMessage(), type: "error" },
      ]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <MapComponent
          id="Map"
          mapHeight={400}
          ref={mapRef}
          cityToHighlight={intoFeatureCollection(handleCityToLight())}
        >
          {myCropInfoList[0].cropLat &&
            myCropInfoList[0].cropLat &&
            myCropInfoList.map((coor) => (
              <MapMarkerComponent
                key={coor.cropId}
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
              <th>#</th>
              <th>Pangalan</th>
              <th>Lokasyon</th>
              <th>Sukat(HA)</th>
              <th></th>
            </>
          }
          tableCell={myCropInfoList.map((crop, index) => (
            <tr key={crop.cropId}>
              <td className="text-color">{index + 1}</td>
              <td className="text-color">{crop.cropName}</td>
              <td className="text-color">{crop.cropLocation}</td>
              <td className="text-color">{crop.farmAreaMeasurement}</td>
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
                    className="slimer-button blue-button"
                    onClick={() =>
                      handleOpenModal({
                        modalName: "editModal",
                        cropId: crop.cropId,
                      })
                    }
                  >
                    Baguhin
                  </SubmitButton>

                  <CancelButton
                    className="slimer-button"
                    onClick={() =>
                      handleOpenModal({
                        modalName: "deleteModal",
                        cropId: crop.cropId,
                      })
                    }
                  >
                    Tanggalin
                  </CancelButton>
                </div>
              </td>
            </tr>
          ))}
        />
      </div>

      {showModal.editModal ? (
        <EditCropModal
          myCropInfoList={myCropInfoList.find(
            (crop) => crop.cropId === cropIdToModify
          )}
          hideEditCropModal={() => handleCloseModal("editModal")}
          setCropIdToModify={setCropIdToModify}
        />
      ) : showModal.deleteModal ? (
        <ModalNotice
          type="warning"
          title="Tanggalin ang pananim?"
          message={
            <>
              Sigurado ka bang tatanggalin mo ang pananim{" "}
              <span className="font-bold">
                {
                  myCropInfoList.find((crop) => crop.cropId === cropIdToModify)!
                    .cropName
                }
              </span>
              ? Pag ito ay tinaggal, hindi na ito maibabalik.
            </>
          }
          onClose={() => handleCloseModal("deleteModal")}
          onProceed={handleDeleteCrop}
          showCancelButton={true}
          proceed={{ label: "Tanggalin" }}
          cancel={{ label: "Kanselahin" }}
        />
      ) : undefined}
    </div>
  );
};

const EditCropModal: FC<EditCropModalPropType> = ({
  myCropInfoList,
  hideEditCropModal,
}) => {
  const mapRef = useRef<MapRef>(null);
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();
  const [formError, setFormError] =
    useState<FormErrorType<FarmerSecondDetailFormType>>(null);
  const [cropVal, setCropVal] = useState<FarmerSecondDetailFormType>({
    cropId: myCropInfoList?.cropId ?? "",
    cropName: myCropInfoList?.cropName ?? "",
    cropFarmArea: myCropInfoList?.farmAreaMeasurement ?? "",
    farmAreaMeasurement: "ha",
    cropBaranggay: myCropInfoList?.cropLocation ?? "",
    cropCoor: {
      lat: myCropInfoList?.cropLat ?? 0,
      lng: myCropInfoList?.cropLng ?? 0,
    },
  });

  // check if the myCropInfoList exist, if not it will hide the modal because .find() also return undefined
  useEffect(() => {
    if (!myCropInfoList) hideEditCropModal();
  }, [myCropInfoList, hideEditCropModal]);

  const handleChangeVal = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCropVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (e.target.name === "cropBaranggay") {
      mapRef.current?.flyTo({
        center: getBrgyCoordinate(e.target.value as barangayType),
        duration: 2000,
        zoom: mapZoomValByBarangay(e.target.value as barangayType),
      });

      document
        .getElementById("mapCanvas")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });

      setCropVal((prev) => ({ ...prev, cropCoor: { lat: 0, lng: 0 } }));
    }
  };

  const handleSetLngLat = useCallback(
    (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      if (
        pointIsInsidePolygon(lng, lat, cropVal.cropBaranggay as barangayType)
      ) {
        setCropVal((prev) => ({
          ...prev,
          cropCoor: { lng: lng, lat: lat },
        }));

        if (formError?.cropCoor)
          setFormError((prev) => ({ ...prev, cropCoor: [] }));
      } else
        setFormError((prev) => ({
          ...prev,
          cropCoor: [
            "Ang pwede mo lang lagyan ng marka ay ang mga lugar na may kulay",
          ],
        }));
    },
    [cropVal.cropBaranggay, formError?.cropCoor]
  );

  const handleSetBrgyFirst = () => {
    setFormError((prev) => ({ ...prev, cropBaranggay: [pickBrgyFirst()] }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleIsLoading("Inuupdate na ang iyong pananim");
    try {
      const updateCrop = await UpdateUserCropInfo(cropVal);

      if (
        updateCrop.success ||
        (!updateCrop.success && updateCrop.closeModal)
      ) {
        hideEditCropModal();
      } else if (updateCrop.formError) setFormError(updateCrop.formError);

      handleSetNotification(updateCrop.notifMessage);
    } catch (error) {
      console.log((error as Error).message);

      handleSetNotification([
        { message: UnexpectedErrorMessage(), type: "error" },
      ]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center  z-40"
      onClick={() => hideEditCropModal()}
    >
      <div
        className=" bg-white rounded-lg w-1/2"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <form onSubmit={handleFormSubmit}>
          <h1 className="title p-5 !m-0 font-bold">
            Baguhin ang impormasyon ng iyong pananim
          </h1>

          <div className="max-h-[500px] overflow-y-auto border-2 border-gray-400 border-x-0 p-4">
            <CropForm
              currentCrops={cropVal}
              handleChangeVal={handleChangeVal}
              mapOnClick={
                cropVal.cropBaranggay ? handleSetLngLat : handleSetBrgyFirst
              }
              mapRef={mapRef}
              mapHeight={"300px"}
              formError={formError}
            />
          </div>

          <FormCancelSubmitButton
            submitButtonLabel="Baguhin"
            cancelButtonLabel="Kanselahin"
            cancelOnClick={() => hideEditCropModal()}
            divClassName="p-4 pt-0"
            submitClassName="slimer-button"
            cancelClassName="slimer-button"
          />
        </form>
      </div>
    </div>
  );
};
