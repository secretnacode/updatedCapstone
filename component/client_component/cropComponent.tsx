"use client";

import {
  AddUserCropInfo,
  GetFarmerCropInfo,
  UpdateUserCropInfo,
} from "@/lib/server_action/crop";
import {
  ChangeEvent,
  FC,
  FormEvent,
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
  FarmerCropPageHandleOpenModalParamType,
  FormCropModalPropType,
  AddCropModalPropType,
  AllFarmerCropPropType,
  cropStatusType,
  determineCropStatusReturnType,
  GetAllCropInfoQueryReturnType,
} from "@/types";
import { useLoading } from "./provider/loadingProvider";
import { ClipboardPlus, X } from "lucide-react";
import {
  capitalizeFirstLetter,
  determineCropStatus,
  intoFeatureCollection,
  pickBrgyFirst,
  pointIsInsidePolygon,
  ReadableDateFormat,
  UnexpectedErrorMessage,
  ViewCrop,
} from "@/util/helper_function/reusableFunction";
import {
  CropForm,
  FormCancelSubmitButton,
  SubmitButton,
  TableComponent,
} from "../server_component/customComponent";
import { MapComponent, MapMarkerComponent } from "./mapComponent";
import {
  pointCoordinates,
  polygonCoordinates,
} from "@/util/helper_function/barangayCoordinates";
import { MapMouseEvent, MapRef } from "@vis.gl/react-maplibre";
import { DynamicLink } from "../server_component/componentForAllUser";
import { useSearchParam, useSortColumnHandler } from "./customHook";
import { SortColBy, TableWithFilter } from "./componentForAllUser";

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
          <ViewCropModal
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
  const [cropInfo, setCropInfo] = useState<GetFarmerCropInfoQueryReturnType>();

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
      {cropInfo && (
        <div className="modal-form">
          <div className="absolute inset-0" onClick={removeModal} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Impormasyon ng Pananim
              </h2>
              <button
                onClick={removeModal}
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
                      ? ReadableDateFormat(cropInfo.dayPlanted)
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
                onClick={removeModal}
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

export const FarmerCropPage: FC<FarmerCropPagePropType> = ({
  myCropInfoList,
  addCrop,
}) => {
  const mapRef = useRef<MapRef>(null);
  const { deleteParams } = useSearchParam();
  const [cropIdToModify, setCropIdToModify] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<FarmerCropPageShowModalStateType>({
    addModal: false,
    editModal: false,
  });

  const paramName = "addCrop";

  useEffect(() => {
    if (addCrop) handleOpenModal({ modalName: "addModal" });
  }, [addCrop]);

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

  const cropStatus = (
    status: cropStatusType,
    datePlanted: Date,
    dateHarvested: Date
  ): determineCropStatusReturnType =>
    determineCropStatus({
      cropStatus: status,
      dateHarvested: dateHarvested,
      datePlanted: datePlanted,
      isEnglish: false,
    });

  const handleCloseAddModal = () => {
    deleteParams(paramName);

    handleCloseModal("addModal");
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        {myCropInfoList.length > 0 ? (
          <MapComponent
            mapHeight={400}
            ref={mapRef}
            cityToHighlight={intoFeatureCollection(handleCityToLight())}
          >
            {myCropInfoList[0] &&
              myCropInfoList.map((coor) => (
                <MapMarkerComponent
                  key={coor.cropId}
                  markerLng={coor.cropLng}
                  markerLat={coor.cropLat}
                />
              ))}
          </MapComponent>
        ) : (
          <MapComponent mapHeight={400} ref={mapRef} />
        )}
      </div>

      <div className="component">
        <div className="mb-4 flex flex-row justify-between items-center">
          <p className="table-title">Impormasyon ng iyong mga pananim</p>

          <SubmitButton
            type="button"
            className="flex flex-row justify-center items-center !px-4 !rounded-lg"
            onClick={() => handleOpenModal({ modalName: "addModal" })}
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
              <th scope="col" className="!w-[15%]">
                <div>Pangalan</div>
              </th>

              <th scope="col">
                <div>Lokasyon</div>
              </th>

              <th scope="col">
                <div>Sukat(HA)</div>
              </th>

              <th scope="col">
                <div>Estado ng pananim</div>
              </th>

              <th scope="col">
                <div>Araw ng kaganapan</div>
              </th>

              <th scope="col" className="!w-[21.5%]">
                Aksyon
              </th>
            </>
          }
          tableCell={myCropInfoList.map((crop) => (
            <tr key={crop.cropId}>
              <td className="text-color">
                <div>{crop.cropName}</div>
              </td>

              <td className="text-color">
                <div>{crop.cropLocation}</div>
              </td>

              <td className="text-color">
                <div>{crop.farmAreaMeasurement}</div>
              </td>

              <td className="text-color ">
                <div>
                  <span
                    className={`py-1 px-3 rounded-2xl very-very-small-text ${
                      cropStatus(
                        crop.cropStatus,
                        crop.datePlanted,
                        crop.dateHarvested
                      ).className
                    }`}
                  >
                    {
                      cropStatus(
                        crop.cropStatus,
                        crop.datePlanted,
                        crop.dateHarvested
                      ).status
                    }
                  </span>
                </div>
              </td>

              <td className="text-color">
                <div>
                  {!crop.cropStatus
                    ? "Wala pang ulat"
                    : ReadableDateFormat(
                        crop.cropStatus === "planted"
                          ? crop.datePlanted
                          : crop.dateHarvested
                      )}
                </div>
              </td>

              <td>
                <div className="flex justify-center flex-row gap-2">
                  <SubmitButton
                    type="button"
                    className="slimer-button"
                    onClick={() =>
                      ViewCrop(
                        crop.cropLng,
                        crop.cropLat,
                        crop.cropLocation,
                        mapRef
                      )
                    }
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
                </div>
              </td>
            </tr>
          ))}
        />
      </div>

      {showModal.addModal && (
        <AddCropModal hideAddCropModal={handleCloseAddModal} />
      )}

      {showModal.editModal && (
        <EditCropModal
          myCropInfoList={
            myCropInfoList.find((crop) => crop.cropId === cropIdToModify)!
          }
          hideEditCropModal={() => handleCloseModal("editModal")}
          setCropIdToModify={setCropIdToModify}
        />
      )}
    </div>
  );
};

/**
 * component for editing and adding crop
 * @returns form components
 */
const FormCropModal: FC<FormCropModalPropType> = ({
  hideCropModal,
  formSubmit,
  formTitle,
  buttonLabel,
  cropVal,
  error,
}) => {
  const mapRef = useRef<MapRef>(null);
  const [formError, setFormError] = useState<
    FormErrorType<FarmerSecondDetailFormType>
  >(error ? { ...error } : null);
  const [crop, setCropVal] = useState<FarmerSecondDetailFormType>({
    cropId: cropVal?.cropId ?? "",
    cropName: cropVal?.cropName ?? "",
    cropFarmArea: cropVal?.farmAreaMeasurement ?? "",
    farmAreaMeasurement: cropVal?.farmAreaMeasurement ? "ha" : "",
    cropBaranggay: cropVal?.cropLocation ?? "",
    cropCoor: {
      lat: cropVal?.cropLat ?? 0,
      lng: cropVal?.cropLng ?? 0,
    },
  });

  useEffect(() => {
    if (error) setFormError(error);
  }, [error]);

  const handleChangeVal = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCropVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    console.log(document.getElementById("mapCanvas"));

    if (e.target.name === "cropBaranggay") {
      const coor = pointCoordinates[e.target.value as barangayType];

      ViewCrop(coor[0], coor[1], e.target.value as barangayType, mapRef);

      // restart the coordinates(no mark in the map yet)
      setCropVal((prev) => ({ ...prev, cropCoor: { lat: 0, lng: 0 } }));
    }
  };

  const handleSetLngLat = useCallback(
    (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      if (pointIsInsidePolygon(lng, lat, crop.cropBaranggay as barangayType)) {
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
    [crop.cropBaranggay, formError?.cropCoor]
  );

  const handleSetBrgyFirst = () => {
    setFormError((prev) => ({ ...prev, cropBaranggay: [pickBrgyFirst()] }));
  };

  return (
    <div className="modal-form">
      <div className="absolute inset-0 " onClick={hideCropModal} />

      <div className="relative bg-white rounded-lg w-1/2">
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => formSubmit(e, crop)}>
          <h1 className="title p-5 !m-0 font-bold">{formTitle}</h1>

          <div className="max-h-[500px] overflow-y-auto border-2 border-gray-400 border-x-0 p-4">
            <CropForm
              currentCrops={crop}
              handleChangeVal={handleChangeVal}
              mapOnClick={
                crop.cropBaranggay ? handleSetLngLat : handleSetBrgyFirst
              }
              mapRef={mapRef}
              mapHeight={"300px"}
              formError={formError}
            />
          </div>

          <FormCancelSubmitButton
            submitButtonLabel={buttonLabel.submit}
            cancelButtonLabel={buttonLabel.cancel}
            cancelOnClick={hideCropModal}
            divClassName="p-4 pt-0"
            submitClassName="slimer-button"
            cancelClassName="slimer-button"
          />
        </form>
      </div>
    </div>
  );
};

const AddCropModal: FC<AddCropModalPropType> = ({ hideAddCropModal }) => {
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();
  const [formError, setFormError] =
    useState<FormErrorType<FarmerSecondDetailFormType>>(null);

  const handleFormSubmit = useCallback(
    async (
      e: FormEvent<HTMLFormElement>,
      cropInfo: FarmerSecondDetailFormType
    ) => {
      e.preventDefault();
      handleIsLoading("Dinadagdag na ang iyong pananim");
      try {
        const addCrop = await AddUserCropInfo(cropInfo);

        if (addCrop.success) hideAddCropModal();

        if (!addCrop.success && addCrop.formError)
          setFormError(addCrop.formError);

        handleSetNotification(addCrop.notifMessage);
      } catch (error) {
        console.log((error as Error).message);

        handleSetNotification([
          { message: UnexpectedErrorMessage(), type: "error" },
        ]);
      } finally {
        handleDoneLoading();
      }
    },
    [
      handleIsLoading,
      handleSetNotification,
      handleDoneLoading,
      hideAddCropModal,
    ]
  );

  return (
    <FormCropModal
      hideCropModal={hideAddCropModal}
      formSubmit={handleFormSubmit}
      formTitle="Ilagay ang impormasyon ng iyong bagong taniman"
      error={formError}
      buttonLabel={{ submit: "Idagdag", cancel: "Bumalik" }}
    />
  );
};

const EditCropModal: FC<EditCropModalPropType> = ({
  myCropInfoList,
  hideEditCropModal,
}) => {
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();
  const [formError, setFormError] =
    useState<FormErrorType<FarmerSecondDetailFormType>>(null);

  const handleFormSubmit = useCallback(
    async (
      e: FormEvent<HTMLFormElement>,
      cropInfo: FarmerSecondDetailFormType
    ) => {
      e.preventDefault();
      handleIsLoading("Inuupdate na ang iyong pananim");
      try {
        const updateCrop = await UpdateUserCropInfo(cropInfo);

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
    },
    [
      handleDoneLoading,
      handleIsLoading,
      handleSetNotification,
      hideEditCropModal,
    ]
  );

  return (
    <FormCropModal
      hideCropModal={hideEditCropModal}
      formSubmit={handleFormSubmit}
      formTitle="Baguhin ang impormasyon ng iyong pananim"
      cropVal={myCropInfoList}
      error={formError}
      buttonLabel={{ submit: "Baguhin", cancel: "Kanselahin" }}
    />
  );
};

export const AllFarmerCrop: FC<AllFarmerCropPropType> = ({ cropInfo }) => {
  const mapRef = useRef<MapRef>(null);

  const { sortCol, setSortCol, handleSortCol } =
    useSortColumnHandler<GetAllCropInfoQueryReturnType>();
  const [tableList, setTableList] =
    useState<GetAllCropInfoQueryReturnType[]>(cropInfo);

  const SortType: FC<{ col: keyof GetAllCropInfoQueryReturnType }> = ({
    col,
  }) => (
    <SortColBy<GetAllCropInfoQueryReturnType> sortCol={sortCol} col={col} />
  );
  const cityToHighlight = (): intoFeatureCollectionDataParam[] => {
    return cropInfo.reduce((acc: intoFeatureCollectionDataParam[], crop) => {
      if (acc.some((cropVal) => cropVal.name === crop.cropLocation)) return acc;

      return [
        ...acc,
        {
          type: "polygon",
          name: crop.cropLocation,
          coordinates: polygonCoordinates[crop.cropLocation as barangayType],
        },
      ] as intoFeatureCollectionDataParam[];
    }, []);
  };

  const cropStatus = (
    status: cropStatusType,
    datePlanted: Date,
    dateHarvested: Date
  ): determineCropStatusReturnType =>
    determineCropStatus({
      cropStatus: status,
      dateHarvested: dateHarvested,
      datePlanted: datePlanted,
      isEnglish: true,
    });

  return (
    <div className="flex flex-col gap-5">
      {cropInfo.length > 0 ? (
        <MapComponent
          mapHeight={400}
          ref={mapRef}
          cityToHighlight={intoFeatureCollection(cityToHighlight())}
        >
          {cropInfo[0] &&
            cropInfo.map((coor) => (
              <MapMarkerComponent
                key={coor.cropId}
                markerLng={coor.cropLng}
                markerLat={coor.cropLat}
              />
            ))}
        </MapComponent>
      ) : (
        <MapComponent mapHeight={400} ref={mapRef} divClassName="shadow-sm" />
      )}

      <div className="component space-y-4">
        <div>
          <h1 className="table-title">Farmer&apos;s Crop</h1>
        </div>

        <TableWithFilter<GetAllCropInfoQueryReturnType>
          setTableList={setTableList}
          sortCol={sortCol}
          setSortCol={setSortCol}
          obj={cropInfo}
          additionalFilter={{
            filterBy: {
              cropStatus: Array.from(
                new Set(cropInfo.map((val) => val.cropLocation))
              ),
              cropLocation: Array.from(
                new Set(cropInfo.map((val) => val.cropLocation))
              ),
            },

            handleFilterLabel: {
              cropLocation: (val) => capitalizeFirstLetter(val),
            },
          }}
          table={
            <TableComponent
              noContentMessage="There's no crop"
              listCount={cropInfo.length}
              tableHeaderCell={
                <>
                  <th scope="col" className="!w-[22%]">
                    <div
                      onClick={() => handleSortCol("farmerName")}
                      className="cursor-pointer"
                    >
                      Farmer Name
                      <SortType col={"farmerName"} />
                    </div>
                  </th>

                  <th scope="col" className="!w-[13%]">
                    <div
                      onClick={() => handleSortCol("farmerAlias")}
                      className="cursor-pointer"
                    >
                      Alias
                      <SortType col={"farmerAlias"} />
                    </div>
                  </th>

                  <th scope="col">
                    <div>Location</div>
                  </th>

                  <th scope="col">
                    <div
                      onClick={() => handleSortCol("farmAreaMeasurement")}
                      className="cursor-pointer"
                    >
                      Area(Ha)
                      <SortType col={"farmAreaMeasurement"} />
                    </div>
                  </th>

                  <th scope="col">
                    <div
                      onClick={() => handleSortCol("farmAreaMeasurement")}
                      className="cursor-pointer"
                    >
                      Crop Status
                      <SortType col={"farmAreaMeasurement"} />
                    </div>
                  </th>

                  <th scope="col" className="!w-[18.5%]">
                    <div>Action</div>
                  </th>
                </>
              }
              tableCell={
                <>
                  {tableList.map((crop) => (
                    <tr key={crop.cropId}>
                      <td className=" text-gray-900 font-medium ">
                        <div>{crop.farmerName}</div>
                      </td>

                      <td className="text-gray-500">
                        <div>{crop.farmerAlias}</div>
                      </td>

                      <td className="text-gray-500">
                        <div>{crop.cropLocation}</div>
                      </td>

                      <td className="text-gray-500">
                        <div>{crop.farmAreaMeasurement}</div>
                      </td>

                      <td className="text-color ">
                        <div>
                          <span
                            className={`py-1 px-3 rounded-2xl very-very-small-text ${
                              cropStatus(
                                crop.cropStatus,
                                crop.datePlanted,
                                crop.dateHarvested
                              ).className
                            }`}
                          >
                            {
                              cropStatus(
                                crop.cropStatus,
                                crop.datePlanted,
                                crop.dateHarvested
                              ).status
                            }
                          </span>
                        </div>
                      </td>

                      <td className="text-center">
                        <div className="flex flex-row justify-center items-centers gap-2">
                          <SubmitButton
                            type="button"
                            className="slimer-button"
                            onClick={() =>
                              ViewCrop(
                                crop.cropLng,
                                crop.cropLat,
                                crop.cropLocation as barangayType,
                                mapRef
                              )
                            }
                          >
                            View
                          </SubmitButton>
                          <DynamicLink
                            baseLink="farmerUser"
                            dynamicId={crop.farmerId}
                            label="Profile"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              }
            />
          }
        />
      </div>
    </div>
  );
};
