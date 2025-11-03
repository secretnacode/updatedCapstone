"use client";

import {
  changeApproveOrJustApproveReport,
  GetFarmerReportDetail,
  uploadDamageReport,
  uploadHarvestingReport,
  uploadPlantingReport,
} from "@/lib/server_action/report";
import {
  CreateUUID,
  intoFeaturePolygon,
  mapZoomValByBarangay,
  MaxDateToday,
  UnexpectedErrorMessage,
} from "@/util/helper_function/reusableFunction";
import {
  ChangeEvent,
  FC,
  FormEvent,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import Image from "next/image";
import {
  Calendar,
  CalendarArrowUp,
  Camera,
  CircleUser,
  FileText,
  Info,
  Leaf,
  Plus,
  Tractor,
  TriangleAlert,
  Upload,
  Wheat,
  X,
} from "lucide-react";
import {
  addReportComponentPropType,
  AddReportPictureType,
  allUserRoleType,
  createReportFormErrorType,
  createReportPropType,
  cropStatusType,
  EditableUserReportDetailsPropType,
  getFarmerCropNameQueryReturnType,
  GetFarmerReportDetailReturnType,
  openCamPropType,
  ReportContentPropType,
  ReportDetailType,
  reportTypeStateType,
  UserReportDetailsPropType,
  UserReportModalPropType,
  ViewUserReportTableDataPropType,
} from "@/types";
import { useLoading } from "./provider/loadingProvider";
import { createPortal } from "react-dom";
import {
  Button,
  CancelButton,
  FormCancelSubmitButton,
  FormDivLabelInput,
  FormDivLabelTextArea,
  LoadingReportModal,
  ModalLoading,
  ModalNotice,
  SubmitButton,
} from "../server_component/customComponent";
import { getFarmerCropName } from "@/lib/server_action/crop";
import { MapComponent, MapMarkerComponent } from "./mapComponent";
import { polygonCoordinates } from "@/util/helper_function/barangayCoordinates";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const AddReportComponent: FC<addReportComponentPropType> = ({
  openModal,
}) => {
  const [openReportModal, setOpenReportModal] = useState<boolean>(false);

  useEffect(() => {
    if (openModal !== undefined) setOpenReportModal(openModal);
  }, [openModal]);

  return (
    <>
      <button
        onClick={() => setOpenReportModal(true)}
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
        Mag sagawa ng ulat
      </button>

      {openReportModal && (
        <div className="modal-form">
          <div
            className="absolute inset-0"
            onClick={() => setOpenReportModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Mag sagawa ng panibagong ulat
              </h2>

              <button
                onClick={() => setOpenReportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="z-0">
              <CreateReport setOpenReportModal={setOpenReportModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CreateReport: FC<createReportPropType> = ({ setOpenReportModal }) => {
  const { handleSetNotification } = useNotification();
  const [formError, setFormError] = useState<createReportFormErrorType>(null);
  const [defaultReport, setDefaultReport] =
    useState<reportTypeStateType>("damage");
  const [cropList, setCropList] = useState<getFarmerCropNameQueryReturnType[]>(
    []
  );
  const [selectedCrop, setSelectedCrop] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const getCropInfo = async () => {
      try {
        const cropName = await getFarmerCropName();

        if (!cropName.success) {
          handleSetNotification(cropName.notifError);

          return setCropList([]);
        }

        setCropList(cropName.cropList);

        setSelectedCrop(cropName.cropList[0].cropId);

        handleSetDefaultReport(
          cropName.cropList[0].datePlanted,
          cropName.cropList[0].cropStatus
        );
      } catch (error) {
        if (!isRedirectError(error)) {
          console.log((error as Error).message);

          handleSetNotification([
            { message: UnexpectedErrorMessage(), type: "error" },
          ]);

          setOpenReportModal(false);
        }
      }
    };

    getCropInfo();
  }, [handleSetNotification, setOpenReportModal]);

  const handleSetDefaultReport = (
    datePlanted: Date,
    cropStatus: cropStatusType
  ) => {
    const planted = new Date(datePlanted);

    const planted5Months = new Date(planted.setMonth(planted.getMonth() + 3));

    switch (cropStatus) {
      case `planted`:
        if (new Date() >= planted5Months) return setDefaultReport("harvesting");

        return setDefaultReport("damage");

      case `harvested`:
        setDefaultReport("planting");

      default:
        return setDefaultReport("planting");
    }
  };

  const handleSetReportType = (type: reportTypeStateType) =>
    setDefaultReport(type);

  const handleSetSelectedCrop = (cropId: string) => {
    setSelectedCrop(cropId);
  };

  const handleFormError = useCallback(
    (formError: createReportFormErrorType) => {
      setFormError({ ...formError });
    },
    []
  );

  return (
    <>
      {cropList.length > 0 ? (
        <div className="col-span-3 bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="h-auto">
            <label htmlFor="" className="label">
              Pumili ng pananim na iyong iuulat:
            </label>

            <div className="w-full grid grid-cols-4 gap-4">
              {cropList.map((list) => (
                <div key={list.cropId}>
                  <label
                    htmlFor={list.cropId}
                    className={`button !rounded-lg border-2 ${
                      selectedCrop === list.cropId
                        ? "bg-green-50 border-green-500 shadow-lg"
                        : "bg-white border-green-200 hover:border-green-300 hover:shadow-md"
                    }`}
                    onClick={() => {
                      handleSetSelectedCrop(list.cropId);
                      handleSetDefaultReport(list.datePlanted, list.cropStatus);
                    }}
                  >
                    <h4>{list.cropName}</h4>
                  </label>
                  <input
                    name="cropList"
                    defaultValue={list.cropId}
                    className="hidden"
                  />

                  {formError?.cropId?.map((error, index) => (
                    <p key={error + index} className="p-error p">
                      {error}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="" className="label">
              Uri ng ulat na iyong gagawin:
            </label>
            <div className="flex gap-4 [&>button]:border-2 [&>button]:!rounded-lg">
              <Button
                onClick={() => handleSetReportType("planting")}
                className={
                  defaultReport === "planting"
                    ? "bg-green-50 border-green-500 shadow-lg"
                    : "bg-white border-gray-200 hover:border-green-300 hover:shadow-md"
                }
              >
                <Leaf className="text-green-500" />
                <span
                  className={`font-semibold text-gray-500 ${
                    defaultReport === "planting" && "!text-gray-700"
                  }`}
                >
                  Pag tatanim
                </span>
              </Button>

              <Button
                onClick={() => handleSetReportType("damage")}
                className={
                  defaultReport === "damage"
                    ? "bg-red-50 border-red-500 shadow-lg"
                    : "bg-white border-gray-200 hover:border-red-300 hover:shadow-md"
                }
              >
                <TriangleAlert className="text-red-500" />
                <span
                  className={`font-semibold text-gray-500 ${
                    defaultReport === "damage" && "!text-gray-700"
                  }`}
                >
                  Pagkasira
                </span>
              </Button>
              <Button
                onClick={() => handleSetReportType("harvesting")}
                className={
                  defaultReport === "harvesting"
                    ? "bg-amber-50 border-amber-500 shadow-lg"
                    : "bg-white border-gray-200 hover:border-amber-300 hover:shadow-md"
                }
              >
                <Tractor className="text-amber-300" />
                <span
                  className={`font-semibold text-gray-500 ${
                    defaultReport === "harvesting" && "!text-gray-700"
                  }`}
                >
                  Pag aani
                </span>
              </Button>
            </div>

            {formError?.cropId?.map((error, index) => (
              <p key={error + index} className="p-error p">
                {error}
              </p>
            ))}
          </div>

          {selectedCrop && defaultReport === "planting" && (
            <PlantingReport
              selectedCrop={selectedCrop}
              reportType={defaultReport}
              handleFormError={handleFormError}
              setOpenReportModal={setOpenReportModal}
            />
          )}

          {selectedCrop && defaultReport === "damage" && (
            <DamageReport
              selectedCrop={selectedCrop}
              reportType={defaultReport}
              handleFormError={handleFormError}
              setOpenReportModal={setOpenReportModal}
            />
          )}

          {selectedCrop && defaultReport === "harvesting" && (
            <HarvestingReport
              selectedCrop={selectedCrop}
              reportType={defaultReport}
              handleFormError={handleFormError}
              setOpenReportModal={setOpenReportModal}
            />
          )}
        </div>
      ) : (
        <LoadingReportModal />
      )}
    </>
  );
};

const DamageReport: FC<ReportContentPropType> = ({
  selectedCrop,
  reportType,
  handleFormError,
  setOpenReportModal,
}) => {
  const { handleSetNotification } = useNotification();
  const pickFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<AddReportPictureType>([]);
  const [isPassing, startPassing] = useTransition();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [state, formAction] = useActionState(uploadDamageReport, {
    success: null,
    notifError: null,
    formError: null,
  });

  useEffect(() => {
    if (state.notifError) handleSetNotification(state.notifError);
  }, [handleSetNotification, state.notifError]);

  useEffect(() => {
    if (state.formError)
      handleFormError({
        cropId: state.formError.cropId,
        reportType: state.formError.reportType,
      });
  }, [handleFormError, state.formError]);

  useEffect(() => {
    if (!isPassing) handleDoneLoading();
  }, [isPassing, handleDoneLoading]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile((prev) => [
        ...prev,
        ...Array.from(e.target.files as FileList).map((file) => ({
          picId: CreateUUID(),
          file: file,
        })),
      ]);
    }
  };

  const handleRemovePicture = (picId: string) => {
    setSelectedFile((prev) => prev.filter((file) => file.picId !== picId));
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleIsLoading("Ipinapasa na ang iyong ulat");

    const formData = new FormData(e.currentTarget);

    formData.append("cropId", selectedCrop);

    formData.append("reportType", reportType);

    selectedFile.forEach((image) => {
      formData.append("file", image.file);
    });

    startPassing(() => formAction(formData));
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 ">
      <div className="space-y-4">
        <FormDivLabelInput
          labelMessage="Pamagat ng ulat:"
          inputName={"reportTitle"}
          formError={state.formError?.reportTitle}
          inputRequired
          inputPlaceholder="Hal: Mga nasirang palay sa dayap"
          inputClassName="input-red-ring"
        />

        <FormDivLabelInput
          labelMessage="Araw na ito ay naganap:"
          inputName={"dateHappen"}
          formError={state.formError?.dateHappen}
          inputType="date"
          inputMax={MaxDateToday()}
          inputRequired
          inputClassName="input-red-ring"
        />

        <FormDivLabelTextArea
          labelMessage="Karagdagang detalye:"
          name={"reportDescription"}
          formError={state.formError?.reportDescription}
          required
          placeholder="Hal: May mga bahagyang nasirang palay sa kagagawan ng mga insekto"
          className="input-red-ring"
        />

        <div>
          <label htmlFor="reportPicture" className="label">
            Mag lagay ng larawan ng mga nasira
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={isPassing}
              onClick={() => pickFileRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer hover-green-button"
            >
              <Upload className="h-5 w-5" />

              <span className="font-medium">Pumili ng larawan</span>
            </button>

            <input
              multiple
              type="file"
              ref={pickFileRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            <OpenCam setSelectedFile={setSelectedFile} isPassing={isPassing} />
          </div>

          {selectedFile.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {selectedFile.length}{" "}
              {selectedFile.length === 1 ? "larawan" : "mga larawan"} ang napili
            </p>
          )}

          {!state.success &&
            state.formError?.reportPicture?.map((err, index) => (
              <p key={err + index} className="p p-error">
                {err}
              </p>
            ))}
        </div>
      </div>

      {selectedFile.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {selectedFile.map((image, index) => (
            <div
              key={image.picId + index}
              className="relative aspect-square group"
            >
              <Image
                src={URL.createObjectURL(image.file)}
                alt={`Larawan ${index + 1} ng gagawing ulat`}
                fill
                unoptimized
                className="object-cover rounded-lg"
              />

              <button
                onClick={() => handleRemovePicture(image.picId)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="z-20 relative" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={isPassing}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isPassing ? "Ipinapasa..." : "Ipasa ang Ulat"}
        </button>
      </div> */}
      <FormCancelSubmitButton
        submitButtonLabel={isPassing ? "Ipinapasa..." : "Ipasa ang Ulat"}
        cancelButtonLabel={"Kanselahin"}
        cancelOnClick={() => setOpenReportModal}
      />
    </form>
  );
};

const PlantingReport: FC<ReportContentPropType> = ({
  selectedCrop,
  reportType,
  setOpenReportModal,
  handleFormError,
}) => {
  const { handleSetNotification } = useNotification();
  const pickFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<AddReportPictureType>([]);
  const [isPassing, startPassing] = useTransition();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [state, formAction] = useActionState(uploadPlantingReport, {
    success: null,
    notifError: null,
    formError: null,
  });

  useEffect(() => {
    if (state.success) setOpenReportModal(false);

    if (state.notifError) handleSetNotification(state.notifError);

    if (state.formError)
      handleFormError({
        cropId: state.formError.cropId,
        reportType: state.formError.reportType,
      });
  }, [handleSetNotification, handleFormError, setOpenReportModal, state]);

  useEffect(() => {
    if (!isPassing) handleDoneLoading();
  }, [isPassing, handleDoneLoading]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile((prev) => [
        ...prev,
        ...Array.from(e.target.files as FileList).map((file) => ({
          picId: CreateUUID(),
          file: file,
        })),
      ]);
    }
  };

  const handleRemovePicture = (picId: string) => {
    setSelectedFile((prev) => prev.filter((file) => file.picId !== picId));
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleIsLoading("Ipinapasa na ang iyong ulat");

    const formData = new FormData(e.currentTarget);

    formData.append("cropId", selectedCrop);

    formData.append("reportType", reportType);

    selectedFile.forEach((image) => {
      formData.append("file", image.file);
    });

    startPassing(() => formAction(formData));
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormDivLabelInput
          labelMessage="Pamagat ng ulat ng pagtatanim:"
          inputName={"reportTitle"}
          formError={state.formError?.reportTitle}
          inputRequired
          inputPlaceholder="Hal: Bagong tanim na palay sa dayap"
          inputClassName="input-green-ring"
        />

        <FormDivLabelInput
          labelMessage="Araw ng pagtatanim:"
          inputName={"dateHappen"}
          formError={state.formError?.dateHappen}
          inputRequired
          inputType="date"
          inputMax={MaxDateToday()}
          inputClassName="input-green-ring"
        />

        <FormDivLabelInput
          labelMessage="Dami ng binhi na ginamit (kg):"
          inputName={"totalCropPlanted"}
          formError={state.formError?.totalCropPlanted}
          inputRequired
          inputType="number"
          inputPlaceholder="Hal: 500"
          inputClassName="input-green-ring"
          step={"any"}
        />

        <FormDivLabelTextArea
          labelMessage="Karagdagang detalye:"
          name={"reportDescription"}
          formError={state.formError?.reportDescription}
          required
          placeholder="Hal: Naitanim na ang mga palay dine sa lamot 1"
          className="input-green-ring"
        />

        <div>
          <label
            htmlFor="reportPicture"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Mag lagay ng larawan ng lugar na tinaniman:
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={isPassing}
              onClick={() => pickFileRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer hover-green-button"
            >
              <Upload className="h-5 w-5" />
              <span className="font-medium">Pumili ng larawan</span>
            </button>

            <input
              multiple
              type="file"
              ref={pickFileRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            <OpenCam setSelectedFile={setSelectedFile} isPassing={isPassing} />
          </div>

          {selectedFile.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {selectedFile.length}{" "}
              {selectedFile.length === 1 ? "larawan" : "mga larawan"} ang napili
            </p>
          )}

          {!state.success &&
            state.formError?.reportPicture?.map((err, index) => (
              <p key={err + index} className="p p-error">
                {err}
              </p>
            ))}
        </div>
      </div>

      {selectedFile.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {selectedFile.map((image, index) => (
            <div
              key={image.picId + index}
              className="relative aspect-square group"
            >
              <Image
                src={URL.createObjectURL(image.file)}
                alt={`Larawan ${index + 1} ng gagawing ulat`}
                fill
                unoptimized
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemovePicture(image.picId)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="z-20 relative" />
              </button>
            </div>
          ))}
        </div>
      )}

      <FormCancelSubmitButton
        submitButtonLabel={isPassing ? "Ipinapasa..." : "Ipasa ang Ulat"}
        cancelButtonLabel={"Kanselahin"}
        cancelOnClick={() => setOpenReportModal}
      />
    </form>
  );
};

const HarvestingReport: FC<ReportContentPropType> = ({
  selectedCrop,
  reportType,
  handleFormError,
  setOpenReportModal,
}) => {
  const { handleSetNotification } = useNotification();
  const pickFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<AddReportPictureType>([]);
  const [isPassing, startPassing] = useTransition();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [state, formAction] = useActionState(uploadHarvestingReport, {
    success: null,
    notifError: null,
    formError: null,
  });

  useEffect(() => {
    if (state.notifError) handleSetNotification(state.notifError);
  }, [handleSetNotification, state.notifError]);

  useEffect(() => {
    if (state.formError)
      handleFormError({
        cropId: state.formError.cropId,
        reportType: state.formError.reportType,
      });
  }, [handleFormError, state.formError]);

  useEffect(() => {
    if (!isPassing) handleDoneLoading();
  }, [isPassing, handleDoneLoading]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile((prev) => [
        ...prev,
        ...Array.from(e.target.files as FileList).map((file) => ({
          picId: CreateUUID(),
          file: file,
        })),
      ]);
    }
  };

  const handleRemovePicture = (picId: string) => {
    setSelectedFile((prev) => prev.filter((file) => file.picId !== picId));
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleIsLoading("Ipinapasa na ang iyong ulat");

    const formData = new FormData(e.currentTarget);

    formData.append("cropId", selectedCrop);

    formData.append("reportType", reportType);

    selectedFile.forEach((image) => {
      formData.append("file", image.file);
    });

    startPassing(() => formAction(formData));
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormDivLabelInput
          labelMessage="Pamagat ng ulat ng pag-aani:"
          inputName={"reportTitle"}
          formError={state.formError?.reportTitle}
          inputRequired
          inputPlaceholder="Hal: Pag aani sa taniman sa may lamot 1"
          inputClassName="input-amber-ring"
        />

        <FormDivLabelInput
          labelMessage="Araw ng pag-aani:"
          inputName={"dateHappen"}
          formError={state.formError?.dateHappen}
          inputRequired
          inputType="date"
          inputMax={MaxDateToday()}
          inputClassName="input-amber-ring"
        />

        <FormDivLabelInput
          labelMessage="Dami ng naaning ani (kg):"
          inputName={"totalHarvest"}
          formError={state.formError?.totalHarvest}
          inputRequired
          inputType="decimal"
          inputPlaceholder="Hal: 500"
          inputClassName="input-amber-ring"
        />

        <FormDivLabelTextArea
          labelMessage="Karagdagang detalye:"
          name={"reportDescription"}
          formError={state.formError?.reportDescription}
          required
          placeholder="Hal: Naani na ang mga palay dine sa may lamot 1, at handa nang ipag benta"
          className="input-amber-ring"
        />

        <div>
          <label
            htmlFor="reportPicture"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Mag lagay ng larawan ng ani:
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={isPassing}
              onClick={() => pickFileRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer hover-green-button"
            >
              <Upload className="h-5 w-5" />
              <span className="font-medium">Pumili ng larawan</span>
            </button>

            <input
              multiple
              type="file"
              ref={pickFileRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            <OpenCam setSelectedFile={setSelectedFile} isPassing={isPassing} />
          </div>

          {selectedFile.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {selectedFile.length}{" "}
              {selectedFile.length === 1 ? "larawan" : "mga larawan"} ang napili
            </p>
          )}

          {!state.success &&
            state.formError?.reportPicture?.map((err, index) => (
              <p key={err + index} className="p p-error">
                {err}
              </p>
            ))}
        </div>
      </div>

      {selectedFile.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {selectedFile.map((image, index) => (
            <div
              key={image.picId + index}
              className="relative aspect-square group"
            >
              <Image
                src={URL.createObjectURL(image.file)}
                alt={`Larawan ${index + 1} ng gagawing ulat`}
                fill
                unoptimized
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemovePicture(image.picId)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="z-20 relative" />
              </button>
            </div>
          ))}
        </div>
      )}

      <FormCancelSubmitButton
        submitButtonLabel={isPassing ? "Ipinapasa..." : "Ipasa ang Ulat"}
        cancelButtonLabel={"Kanselahin"}
        cancelOnClick={() => setOpenReportModal}
      />
    </form>
  );
};

const OpenCam: FC<openCamPropType> = ({ setSelectedFile, isPassing }) => {
  const { handleSetNotification } = useNotification();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [openCam, setOpenCam] = useState<boolean>(false);

  useEffect(() => {
    if (videoRef.current && openCam) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream, openCam]);

  const handleStartCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
      return handleSetNotification([
        {
          message:
            "Ang browser mo ay hindi supported ang pag gamit ng camera mo",
          type: "warning",
        },
      ]);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setOpenCam(true);
      setStream(mediaStream);
    } catch (error) {
      const err = error as Error;
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      )
        handleSetNotification([
          {
            message:
              "Mag bigay ng pahintulot na gamitin ang iyong camera para mag patuloy",
            type: "warning",
          },
        ]);
      else if (err.name === "NotFoundError")
        handleSetNotification([
          {
            message: "Hindi ma detect and iyong camera",
            type: "error",
          },
        ]);
      else
        handleSetNotification([
          {
            message: `May hindi inaasahang error na nangyari: ${err.message}`,
            type: "error",
          },
        ]);
    }
  };

  const handleStopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((tracks) => tracks.stop());
      setStream(null);
    }

    setOpenCam(false);
  }, [stream]);

  useEffect(() => {
    return () => {
      if (openCam) handleStopCamera();
    };
  });

  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setSelectedFile((prev) => [
                ...prev,
                {
                  picId: CreateUUID(),
                  file: new File([blob], `captureImage.jpg`, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  }),
                },
              ]);
              handleSetNotification([
                {
                  message: "Matagumpay na nakakuha ng larawan",
                  type: "success",
                },
              ]);
            } else {
              handleSetNotification([
                {
                  message: "Hindi matagumpay na nakuha ang larawan",
                  type: "warning",
                },
              ]);
            }

            handleStopCamera();
          },
          "images/jpeg",
          0.9
        );
      } else {
        handleSetNotification([
          {
            message: "Hindi matagumpay na nakuha ang larawan",
            type: "warning",
          },
        ]);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={openCam || isPassing}
        onClick={handleStartCamera}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer hover-blue-button"
      >
        <Camera className="h-5 w-5" />
        <span className="font-medium">Gamitin ang camera</span>
      </button>

      <canvas ref={canvasRef} className="hidden" />

      {openCam && (
        <div className="fixed inset-0 bg-black z-50">
          <div className="relative h-full flex flex-col">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full"
            ></video>

            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/75 to-transparent">
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleCaptureImage}
                  className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100"
                >
                  Kunan ng Larawan
                </button>
                <button
                  type="button"
                  onClick={handleStopCamera}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
                >
                  Kanselahin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ViewUserReportButton: FC<ViewUserReportTableDataPropType> = ({
  label = "Tingnan ang ulat",
  className = "",
  reportId,
  farmerName,
  myReport = false,
}) => {
  const [viewReport, setViewReport] = useState<boolean>(false);
  return (
    <>
      <SubmitButton
        type="button"
        onClick={() => setViewReport(true)}
        className={className}
      >
        {label}
      </SubmitButton>

      {viewReport &&
        createPortal(
          <UserReportModal
            reportId={reportId}
            closeModal={() => setViewReport(false)}
            farmerName={farmerName}
            myReport={myReport}
          />,

          document.body
        )}
    </>
  );
};

export const UserReportModal: FC<UserReportModalPropType> = ({
  reportId,
  closeModal,
  farmerName,
  myReport = false,
}) => {
  const { handleSetNotification } = useNotification();
  const [userReport, setUserReport] = useState<ReportDetailType>();
  const [userWork, setUserWork] = useState<allUserRoleType>("farmer");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  });

  useEffect(() => {
    const report = async () => {
      let report: GetFarmerReportDetailReturnType;

      try {
        report = await GetFarmerReportDetail(reportId);

        if (report.success) {
          setUserReport(report.reportDetail);
          setUserWork(report.work);
        } else {
          handleSetNotification(report.notifError);
          closeModal();
        }
      } catch (error) {
        const err = error as Error;
        handleSetNotification([{ message: err.message, type: "error" }]);
      }
    };

    report();
  }, [reportId, handleSetNotification, closeModal]);

  const ComponentToRender = () => {
    if (!userReport) return <ModalLoading />;

    if (userWork === "leader" && !myReport)
      return (
        <EditableUserReportDetails
          closeModal={closeModal}
          userReport={userReport}
          reportId={reportId}
          farmerName={farmerName}
          myReport={myReport}
        />
      );
    else
      return (
        <UserReportDetails
          closeModal={closeModal}
          userReport={userReport}
          isView={true}
          work={userWork}
          farmerName={farmerName}
          myReport={myReport}
        />
      );
  };

  return (
    <div className="modal-form">
      <ComponentToRender />
    </div>
  );
};

export const EditableUserReportDetails: FC<
  EditableUserReportDetailsPropType
> = ({ userReport, reportId, farmerName, closeModal, myReport }) => {
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();
  const [newDesc, setNewDesc] = useState<string>(userReport.description);
  const [isChange, setIsChanged] = useState<boolean>(false);
  const [showNotifModal, setShowNotifModal] = useState<boolean>(false);

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewDesc(e.target.value);
    setIsChanged(true);
  };

  const backDefault = () => {
    setNewDesc(userReport.description);
    setIsChanged(false);
  };

  console.log(reportId);

  const handleChangeApproveOrJustApprove = async () => {
    try {
      handleIsLoading(
        isChange
          ? "Binabago at inaaprubahan na ang ulat..."
          : "Inaaprubahan na ang ulat..."
      );

      const res = await changeApproveOrJustApproveReport({
        isChange,
        reportId,
        newDesc,
      });

      handleSetNotification(res.notifMessage);
    } catch (error) {
      console.error((error as Error).message);
      handleSetNotification([
        { message: UnexpectedErrorMessage(), type: "error" },
      ]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <>
      <UserReportDetails
        myReport={myReport}
        userReport={userReport}
        closeModal={closeModal}
        isView={false}
        work="leader"
        textAreaOnChange={onChange}
        textAreaValue={newDesc}
        isChange={isChange}
        backDefault={backDefault}
        proceedOnClick={
          isChange
            ? () => setShowNotifModal(true)
            : handleChangeApproveOrJustApprove
        }
        farmerName={farmerName}
      />

      {showNotifModal && (
        <ModalNotice
          type={"warning"}
          title={`Baguhin ang ulat ni ${farmerName}?`}
          message={
            <>
              Babaguhin mo ang deskripsyon na ipinasang ulat ni {farmerName}.
              <br />
              Pag ito ay iyong binago hindi na ito muling maibabalik
            </>
          }
          onClose={() => setShowNotifModal(false)}
          onProceed={handleChangeApproveOrJustApprove}
          proceed={{ label: "Mag patuloy" }}
          showCancelButton={true}
          cancel={{ label: "Bumalik" }}
        />
      )}
    </>
  );
};

export const UserReportDetails: FC<UserReportDetailsPropType> = ({
  userReport,
  farmerName,
  closeModal,
  isView,
  work,
  textAreaOnChange = () => {},
  proceedOnClick = () => {},
  backDefault = () => {},
  textAreaValue,
  isChange,
  myReport,
}) => {
  const isEnglish: boolean = work === "admin" || work === "agriculturist";

  const reportStatus = () => {
    if (work === "leader" || work === "farmer") {
      return userReport.verificationStatus === "false"
        ? "Hindi pa naaprubahan"
        : "Naaprubahan na";
    }

    // work is admin or agriculturist
    return userReport.verificationStatus === "false"
      ? "Not yet validated"
      : "Validated";
  };

  console.log(userReport.verificationStatus);

  return (
    <>
      <div className="absolute inset-0" onClick={closeModal} />

      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className=" border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            <FileText className="logo" />
            <h2 className="text-lg font-semibold">{userReport.title}</h2>
          </div>

          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="logo text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <label htmlFor="" className="label">
              {isEnglish ? "Location of the crop:" : "Lokasyon ng taniman:"}
            </label>
            <MapComponent
              mapHeight={200}
              cityToHighlight={intoFeaturePolygon(
                polygonCoordinates[userReport.cropLocation]
              )}
              initialViewState={{
                longitude: userReport.cropLng,
                latitude: userReport.cropLat,
                zoom: mapZoomValByBarangay(userReport.cropLocation),
              }}
            >
              {userReport.cropLat && userReport.cropLng && (
                <MapMarkerComponent
                  markerLng={userReport.cropLng}
                  markerLat={userReport.cropLat}
                />
              )}
            </MapComponent>
          </div>

          <div className="space-y-5">
            <div
              className={`px-3 py-1 w-fit rounded-lg text-sm tracking-wide font-semibold ${
                userReport.verificationStatus === "false"
                  ? "bg-yellow-100 text-yellow-900"
                  : "bg-green-100 text-green-900"
              }`}
            >
              {reportStatus()}
            </div>

            <div className="grid grid-cols-2 gap-6 [&_.date-report]:flex [&_.date-report]:flex-row [&_.date-report]:justify-start [&_.date-report]:items-center [&_.date-report]:gap-2 [&_.date-report]:[&>svg]:text-gray-500 [&_.date-report]:[&>p]:text-sm [&_.date-report]:[&>p]:text-gray-600 [&_.date-report]:[&>p]:tracking-wide [&>div]:p-3 [&>div]:bg-gray-100 [&>div]:rounded-lg [&>div]:[&>p]:font-semibold">
              {!myReport && (
                <div className="space-y-1">
                  <div className="date-report">
                    <CircleUser className="logo" />
                    <p>
                      {isEnglish ? "Farmer name" : "Pangalan ng mag sasaka"}
                    </p>
                  </div>
                  <p className="font-medium">{farmerName}</p>
                </div>
              )}

              <div className="space-y-1">
                <div className="date-report">
                  <Wheat className="logo" />
                  <p>{isEnglish ? "Crop name" : "Pangalang ng pananim"}</p>
                </div>
                <p className="font-medium">{userReport.cropName}</p>
              </div>

              <div className="space-y-1">
                <div className="date-report">
                  <Calendar className="logo" />
                  <p>{isEnglish ? "Day it happen" : "Araw ng kaganapan"}</p>
                </div>
                <p className="font-medium">
                  {userReport.dayHappen.toDateString()}
                </p>
              </div>

              <div className="space-y-1">
                <div className="date-report">
                  <CalendarArrowUp className="logo" />
                  <p>{isEnglish ? "Day it was reported" : "Araw na ipinasa"}</p>
                </div>
                <p className="font-medium">
                  {userReport.dayReported.toDateString()}
                </p>
              </div>
            </div>

            <div>
              {!isView && userReport.verificationStatus !== "pending" ? (
                <FormDivLabelTextArea
                  labelMessage={`${
                    isEnglish ? "Report description:" : "Deskripsyon ng ulat:"
                  }`}
                  name="reportDescription"
                  value={textAreaValue}
                  onChange={textAreaOnChange}
                  disabled={false}
                />
              ) : (
                <FormDivLabelTextArea
                  labelMessage={`${
                    isEnglish ? "Report description:" : "Deskripsyon ng ulat:"
                  }`}
                  name="reportDescription"
                  defaultValue={userReport.description}
                  disabled={true}
                />
              )}
              {isChange && (
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2 py-1 px-2 bg-blue-100 rounded-md">
                    <span>
                      <Info className="logo !size-5 text-blue-600" />
                    </span>
                    <p className="text-blue-800 font-medium very-small-text">
                      Binago mo ang ulat na ginawa ng iba
                    </p>
                  </div>

                  <CancelButton
                    className="slimer-button !bg-red-100 !text-black outline outline-red-800 hover:!bg-red-600 hover:!text-white hover:outline-none hover:shadow-md "
                    onClick={backDefault}
                  >
                    Ibalik sa dati
                  </CancelButton>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="" className="label">
                {isEnglish ? "Evidence Photo:" : "Larawan ng ebidensya:"}
              </label>

              <div className="grid grid-cols-2 gap-4">
                {userReport.pictures.map((pic, index) => (
                  <div key={pic + index} className="relative aspect-video">
                    -
                    <Image
                      src={pic}
                      alt={`Larawan ${index + 1} ng gagawing ulat`}
                      fill
                      unoptimized
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 [&>div]:!p-4">
          {!isView && userReport.verificationStatus !== "pending" ? (
            <FormCancelSubmitButton
              submitButtonLabel={"Aprubahan"}
              submitOnClick={proceedOnClick}
              cancelButtonLabel={"Bumalik"}
              cancelOnClick={closeModal}
            />
          ) : (
            <div className="flex justify-end items-center ">
              <CancelButton onClick={closeModal}>
                {isEnglish ? "Close" : "Bumalik"}
              </CancelButton>
            </div>
          )}
        </div>

        {/* <div className="p-6 space-y-6">
          <div className="grid gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Nang yari ang kaganapan</p>
                <p className="font-medium">
                  {userReport.dayHappen.toDateString()}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Araw na ipinasa ang ulat:{" "}
                </p>
                <p className="font-medium">
                  {userReport.dayReported.toDateString()}
                </p>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  userReport.verificationStatus === "false"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {reportStatus()}
              </div>
            </div>

            <div className="prose max-w-none">
              <p>{userReport.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {userReport.pictures.map((pic, index) => (
              <div key={pic + index} className="relative aspect-video">
                -
                <Image
                  src={pic}
                  alt={`Larawan ${index + 1} ng gagawing ulat`}
                  fill
                  unoptimized
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
};
