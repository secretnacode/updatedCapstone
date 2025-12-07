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
  GetAllCropInfoQueryReturnType,
  profileButtonIdType,
} from "@/types";
import { useLoading } from "./provider/loadingProvider";
import { ClipboardPlus, WheatOff } from "lucide-react";
import {
  accountStatusStyle,
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

export const ViewCropModalButton: FC<ViewCropModalButtonPropType> = ({
  isViewing,
  isEnglish,
  authStatus,
}) => {
  const handleGoToComponent = (id: profileButtonIdType) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

  const borderHover = () => {
    switch (authStatus) {
      case "active":
        return `hover:border-green-700`;
      case "block":
        return `hover:border-amber-700`;
      case "delete":
        return `hover:border-red-700`;
    }
  };

  return (
    <div className="grid gap-5 [&_button]:shadow-sm [&_button]:hover:shadow-md [&_button]:!px-0 [&_button]:!rounded-sm  text-gray-700 text-sm ">
      <Button
        onClick={() => handleGoToComponent("profile-user-info")}
        className={`${accountStatusStyle(authStatus)} ${borderHover}`}
      >
        {isEnglish ? "Personal Information" : "Personal na Impormasyon"}
      </Button>

      <Button
        onClick={() => handleGoToComponent("profile-org-info")}
        className={`${accountStatusStyle(authStatus)} ${borderHover}`}
      >
        {isEnglish ? "Organization" : "Organisasyon"}
      </Button>

      {!isViewing && (
        <Button
          onClick={() => handleGoToComponent("profile-change-pass")}
          className={`${accountStatusStyle(authStatus)} ${borderHover}`}
        >
          Magpalit ng password
        </Button>
      )}
    </div>
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
        <div className="mb-4 flex flex-row justify-between items-center gap-4">
          <p className="table-title">Impormasyon ng iyong mga pananim</p>

          <SubmitButton
            type="button"
            className="flex flex-row justify-center items-center !px-4 !rounded-lg"
            onClick={() => handleOpenModal({ modalName: "addModal" })}
          >
            <ClipboardPlus className="logo !size-5" />
            <span className="hidden sm:inline">Magdagdag ng pananim</span>
            <span className="inline sm:hidden">Magdagdag</span>
          </SubmitButton>
        </div>

        <TableComponent
          noContentlogo={WheatOff}
          noContentMessage={
            "Wala ka pang nakalistang impormasyon patungkol sa iyong pananim"
          }
          tableClassName="!shadow-none"
          listCount={myCropInfoList.length}
          tableHeaderCell={
            <>
              <th scope="col">
                <div>
                  <p>Pangalan</p>
                </div>
              </th>

              <th scope="col" className="hidden lg:table-cell">
                <div>
                  <p>Lokasyon</p>
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Sukat(HA)</p>
                </div>
              </th>

              <th scope="col" className="hidden sm:table-cell">
                <div>
                  <p>Estado ng pananim</p>
                </div>
              </th>

              <th scope="col" className="hidden lg:table-cell">
                <div>
                  <p>Araw ng kaganapan</p>
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Aksyon</p>
                </div>
              </th>
            </>
          }
          tableCell={myCropInfoList.map((crop) => {
            const { className, status } = determineCropStatus({
              cropStatus: crop.cropStatus,
              datePlanted: crop.datePlanted,
              dateHarvested: crop.dateHarvested,
              isEnglish: false,
            });

            return (
              <tr key={crop.cropId}>
                <td className="text-color">
                  <div>
                    <p>{crop.cropName}</p>
                  </div>
                </td>

                <td className="text-color hidden lg:table-cell">
                  <div>
                    <p>{crop.cropLocation}</p>
                  </div>
                </td>

                <td className="text-color">
                  <div>
                    <p>{crop.farmAreaMeasurement}</p>
                  </div>
                </td>

                <td className="text-color hidden sm:table-cell">
                  <div>
                    <p
                      className={`py-1 px-3 rounded-2xl w-fit very-very-small-text ${className}`}
                    >
                      {status}
                    </p>
                  </div>
                </td>

                <td className="text-color hidden lg:table-cell">
                  <div>
                    <p>
                      {!crop.cropStatus
                        ? "Wala pang ulat"
                        : ReadableDateFormat(
                            crop.cropStatus === "planted"
                              ? crop.datePlanted
                              : crop.dateHarvested
                          )}
                    </p>
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
            );
          })}
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

      ViewCrop(coor[0], coor[1], e.target.value as barangayType, mapRef, false);

      // restart the coordinates(no mark in the map yet)
      setCropVal((prev) => ({ ...prev, cropCoor: { lat: 0, lng: 0 } }));

      document
        .getElementById("mapFormComponent")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
                new Set(
                  cropInfo.map((val) => val.cropStatus).filter((val) => val)
                )
              ),
              cropLocation: Array.from(
                new Set(cropInfo.map((val) => val.cropLocation))
              ),
            },

            handleFilterLabel: {
              cropStatus: (status) => capitalizeFirstLetter(status),
              cropLocation: (val) => capitalizeFirstLetter(val),
            },
          }}
          table={
            <TableComponent
              noContentlogo={WheatOff}
              noContentMessage={
                cropInfo.length > 0
                  ? "No match found for your search"
                  : "There's no farmer crop was listed yet"
              }
              listCount={tableList.length}
              tableHeaderCell={
                <>
                  <th scope="col">
                    <div
                      onClick={() => handleSortCol("farmerName")}
                      className="cursor-pointer"
                    >
                      Farmer Name
                      <SortType col={"farmerName"} />
                    </div>
                  </th>

                  <th scope="col">
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

                  <th scope="col">
                    <div>Action</div>
                  </th>
                </>
              }
              tableCell={
                <>
                  {tableList.map((crop) => {
                    const { className, status } = determineCropStatus({
                      cropStatus: crop.cropStatus,
                      dateHarvested: crop.dateHarvested,
                      datePlanted: crop.datePlanted,
                      isEnglish: true,
                    });

                    return (
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
                              className={`py-1 px-3 rounded-2xl very-very-small-text ${className}`}
                            >
                              {status}
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
                    );
                  })}
                </>
              }
            />
          }
        />
      </div>
    </div>
  );
};
