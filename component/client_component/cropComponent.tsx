"use client";

import { AddUserCropInfo, UpdateUserCropInfo } from "@/lib/server_action/crop";
import {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import {
  FarmerCropPagePropType,
  FarmerCropPageShowModalStateType,
  EditCropModalPropType,
  ViewCropModalButtonPropType,
  FarmerSecondDetailFormType,
  FormErrorType,
  barangayType,
  FarmerCropPageHandleOpenModalParamType,
  FormCropModalPropType,
  AddCropModalPropType,
  AllFarmerCropPropType,
  cropStatusType,
  determineCropStatusReturnType,
  GetAllCropInfoQueryReturnType,
  profileButtonIdType,
} from "@/types";
import { useLoading } from "./provider/loadingProvider";
import { ClipboardPlus } from "lucide-react";
import {
  capitalizeFirstLetter,
  cityToHighLightInMap,
  determineCropStatus,
  pickBrgyFirst,
  pointIsInsidePolygon,
  ReadableDateFormat,
  UnexpectedErrorMessage,
  ViewCrop,
} from "@/util/helper_function/reusableFunction";
import {
  Button,
  CropForm,
  FormCancelSubmitButton,
  SubmitButton,
  TableComponent,
} from "../server_component/customComponent";
import { MapComponent, MapMarkerComponent } from "./mapComponent";
import { pointCoordinates } from "@/util/helper_function/barangayCoordinates";
import { MapMouseEvent, MapRef } from "@vis.gl/react-maplibre";
import { DynamicLink } from "../server_component/componentForAllUser";
import { useSearchParam, useSortColumnHandler } from "./customHook";
import { SortColBy, TableWithFilter } from "./componentForAllUser";
import { useWindowStore } from "@/store/useWindowStore";

export const ViewCropModalButton: FC<ViewCropModalButtonPropType> = ({
  isViewing,
}) => {
  const handleGoToComponent = (id: profileButtonIdType) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="grid gap-5 [&_button]:shadow-sm [&_button]:hover:shadow-md [&_button]:!px-0 [&_button]:!rounded-sm [&_button]:bg-green-50 [&_button]:border [&_button]:border-green-400 [&_button]:hover:bg-green-200 [&_button]:hover:border-green-700 text-gray-700 text-sm ">
      <Button onClick={() => handleGoToComponent("profile-user-info")}>
        Personal na impormasyon
      </Button>

      <Button onClick={() => handleGoToComponent("profile-org-info")}>
        Organisasyon
      </Button>

      <Button onClick={() => handleGoToComponent("profile-crop-info")}>
        Mga Pananim
      </Button>

      {!isViewing && (
        <Button onClick={() => handleGoToComponent("profile-change-pass")}>
          Mag palit ng password
        </Button>
      )}
    </div>
  );
};
//   cropId: string;
//   removeModal: () => void;
//   isViewing: boolean;
// }> = ({ cropId, removeModal, isViewing }) => {
//   const mapRef = useRef<MapRef>(null);
//   const { handleSetNotification } = useNotification();
//   const [cropInfo, setCropInfo] = useState<GetFarmerCropInfoQueryReturnType>();

//   useEffect(() => {
//     const GetCrop = async (cropId: string, isViewing: boolean) => {
//       try {
//         const res = await GetFarmerCropInfo(cropId, isViewing);

//         if (!res.success) {
//           removeModal();
//           return handleSetNotification(res.notifError);
//         }

//         setCropInfo(res.cropData);

//         ViewCrop(
//           res.cropData.cropLng,
//           res.cropData.cropLat,
//           res.cropData.cropLocation,
//           mapRef
//         );
//       } catch (error) {
//         const err = error as Error;
//         handleSetNotification([{ message: err.message, type: "error" }]);
//         removeModal();
//       }
//     };

//     GetCrop(cropId, isViewing);
//   }, [cropId, isViewing, handleSetNotification, removeModal]);

//   let cropStatus: determineCropStatusReturnType = { className: "", status: "" };

//   if (cropInfo)
//     cropStatus = determineCropStatus({
//       cropStatus: cropInfo.cropStatus,
//       datePlanted: cropInfo.datePlanted,
//       dateHarvested: cropInfo.dateHarvested,
//       isEnglish: false,
//     });

//   return (
//     <div>
//       {cropInfo ? (
//         <div className="modal-form">
//           <div className="absolute inset-0" onClick={removeModal} />

//           <div className="relative bg-white rounded-xl shadow-xl flex">
//             <MapComponent
//               mapHeight={"100%"}
//               mapWidth={"600px"}
//               ref={mapRef}
//               divClassName="flex-1"
//               cityToHighlight={cityToHighLightInMap([cropInfo.cropLocation])}
//             >
//               <MapMarkerComponent
//                 markerLng={cropInfo.cropLng}
//                 markerLat={cropInfo.cropLat}
//               />
//             </MapComponent>

//             <div>
//               <div className="flex items-center justify-between gap-4 p-4 border-b">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Impormasyon ng Pananim
//                 </h2>
//                 <button
//                   onClick={removeModal}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>

//               <div className="p-6">
//                 <div
//                   className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${cropStatus.className}  border border-current/20`}
//                 >
//                   <span className="text-sm font-semibold">
//                     {cropStatus.status}
//                   </span>
//                 </div>

//                 <div className="grid gap-3 mt-6">
//                   <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
//                     <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         Lokasyon
//                       </p>
//                       <p className="text-sm font-semibold text-gray-900 truncate">
//                         {cropInfo.cropLocation}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
//                     <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         Araw Itinanim
//                       </p>
//                       <p className="text-sm font-semibold text-gray-900">
//                         {ReadableDateFormat(cropInfo.datePlanted) ||
//                           "Hindi pa naitala"}
//                       </p>
//                     </div>
//                   </div>

//                   {cropInfo.cropStatus === "harvested" && (
//                     <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
//                       <Wheat className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                           Araw Inani
//                         </p>
//                         <p className="text-sm font-semibold text-gray-900">
//                           {ReadableDateFormat(cropInfo.dateHarvested)}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
//                     <Ruler className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         Sukat ng Taniman
//                       </p>
//                       <p className="text-sm font-semibold text-gray-900">
//                         {cropInfo.farmAreaMeasurement} ektarya
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={removeModal}
//                   className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
//                 >
//                   Isara
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <ModalLoading />
//       )}
//     </div>
//   );
// };

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
  // const handleCityToLight = (): intoFeatureCollectionDataParam[] => {
  //   return myCropInfoList.reduce(
  //     (acc: intoFeatureCollectionDataParam[], info) => {
  //       if (acc.some((val) => val.name === info.cropLocation)) {
  //         return acc;
  //       }

  //       return [
  //         ...acc,
  //         {
  //           type: "polygon",
  //           coordinates: polygonCoordinates[info.cropLocation],
  //           name: info.cropLocation,
  //         },
  //       ] as intoFeatureCollectionDataParam[];
  //     },
  //     []
  //   );
  // };

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

  const currentWindowWidth = useWindowStore((state) => state.width);

  return (
    <div className="flex flex-col gap-4">
      <div>
        {myCropInfoList.length > 0 ? (
          <MapComponent
            mapHeight={400}
            ref={mapRef}
            cityToHighlight={cityToHighLightInMap(
              myCropInfoList.map((val) => val.cropLocation)
            )}
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
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
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

              <th scope="col" className="!w-[20%]">
                <div>
                  {currentWindowWidth >= 870 ? "Estado ng pananim" : "Estado"}
                </div>
              </th>

              <th scope="col">
                <div>
                  {" "}
                  {currentWindowWidth >= 870
                    ? "Araw ng kaganapan"
                    : "Kaganapan"}
                </div>
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
                  <p
                    className={`py-1 px-3 rounded-2xl w-fit very-very-small-text ${
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
                  </p>
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
                <div className="flex justify-center flex-col 2xl:flex-row gap-2">
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

  // const cityToHighlight = (): intoFeatureCollectionDataParam[] => {
  //   return cropInfo.reduce((acc: intoFeatureCollectionDataParam[], crop) => {
  //     if (acc.some((cropVal) => cropVal.name === crop.cropLocation)) return acc;

  //     return [
  //       ...acc,
  //       {
  //         type: "polygon",
  //         name: crop.cropLocation,
  //         coordinates: polygonCoordinates[crop.cropLocation as barangayType],
  //       },
  //     ] as intoFeatureCollectionDataParam[];
  //   }, []);
  // };

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
          cityToHighlight={cityToHighLightInMap(
            cropInfo.map((val) => val.cropLocation)
          )}
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
