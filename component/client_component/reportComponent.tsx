"use client";

import {
  GetFarmerReportDetail,
  PostFarmerReport,
} from "@/lib/server_action/report";
import {
  CreateUUID,
  FourDaysBefore,
  MaxDateToday,
} from "@/util/helper_function/reusableFunction";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import Image from "next/image";
import { Camera, Plus, Upload, X } from "lucide-react";
import {
  AddReportPictureType,
  GetFarmerReportDetailReturnType,
  ReportDetailType,
  ViewUserReportTableDataPropType,
} from "@/types";
import { useLoading } from "./provider/loadingProvider";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../server_component/customComponent";

export const AddReportComponent: FC = () => {
  const [addReport, setAddReport] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setAddReport(true)}
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
        Mag sagawa ng ulat
      </button>

      {addReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Bagong Ulat</h2>
              <button
                onClick={() => setAddReport(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AddingReport setAddReport={setAddReport} />
          </div>
        </div>
      )}
    </>
  );
};

const AddingReport: FC<{
  setAddReport: Dispatch<SetStateAction<boolean>>;
}> = ({ setAddReport }) => {
  const router = useRouter();
  const { handleSetNotification } = useNotification();
  const pickFileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [openCam, setOpenCam] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<AddReportPictureType>([]);
  const [isPassing, startPassing] = useTransition();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [state, formAction] = useActionState(PostFarmerReport, {
    success: null,
    notifError: null,
    formError: null,
  });

  useEffect(() => {
    if (videoRef.current && openCam) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream, openCam]);

  useEffect(() => {
    if (state.success) {
      setAddReport(false);
      router.refresh();
    }
  }, [state.success, router, setAddReport]);

  useEffect(() => {
    if (state.notifError) handleSetNotification(state.notifError);
  }, [handleSetNotification, state.notifError]);

  useEffect(() => {
    if (!isPassing) handleDoneLoading();
  }, [isPassing, handleDoneLoading]);

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

    selectedFile.forEach((image) => {
      formData.append("file", image.file);
    });

    startPassing(() => formAction(formData));
  };

  useEffect(() => {
    return () => {
      if (openCam) handleStopCamera();
    };
  });

  return (
    <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="reportTitle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pamagat ng ulat:
          </label>
          <input
            type="text"
            name="reportTitle"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {!state.success &&
            state.formError?.reportTitle?.map((err, index) => (
              <p key={err + index} className="mt-1 text-sm text-red-600">
                {err}
              </p>
            ))}
        </div>

        <div>
          <label
            htmlFor="reportDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ilarawan ang ulat:
          </label>
          <textarea
            name="reportDescription"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          {!state.success &&
            state.formError?.reportDescription?.map((err, index) => (
              <p key={err + index} className="mt-1 text-sm text-red-600">
                {err}
              </p>
            ))}
        </div>

        <div>
          <label
            htmlFor="dateHappen"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Araw na ito ay naganap:
          </label>
          <input
            type="date"
            name="dateHappen"
            min={FourDaysBefore()}
            max={MaxDateToday()}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {!state.success &&
            state.formError?.dateHappen?.map((err, index) => (
              <p key={err + index} className="mt-1 text-sm text-red-600">
                {err}
              </p>
            ))}
        </div>

        <div>
          <label
            htmlFor="reportPicture"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Mag lagay ng larawan ng mga nasira
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={isPassing}
              onClick={() => pickFileRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
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

            <button
              type="button"
              disabled={openCam || isPassing}
              onClick={handleStartCamera}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Camera className="h-5 w-5" />
              <span className="font-medium">Gamitin ang camera</span>
            </button>
          </div>

          {selectedFile.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {selectedFile.length}{" "}
              {selectedFile.length === 1 ? "larawan" : "mga larawan"} ang napili
            </p>
          )}

          {!state.success &&
            state.formError?.reportPicture?.map((err, index) => (
              <p key={err + index} className="mt-1 text-sm text-red-600">
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

      {/* turning the captured picture into a canvas, then turning canvas into a blob(file) */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={isPassing}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isPassing ? "Ipinapasa..." : "Ipasa ang Ulat"}
        </button>
        <button
          type="button"
          onClick={() => setAddReport(false)}
          disabled={isPassing}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Kanselahin
        </button>
      </div>

      {/* view for viewing the cam */}
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
    </form>
  );
};

export const ViewUserReportTableData: FC<ViewUserReportTableDataPropType> = ({
  label = "Tingnan ang ulat",
  className = "",
  reportId,
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
          <UserReportDetails
            reportId={reportId}
            setViewReport={setViewReport}
          />,
          document.body
        )}
    </>
  );
};

export const UserReportDetails: FC<{
  reportId: string;
  setViewReport: Dispatch<SetStateAction<boolean>>;
}> = ({ reportId, setViewReport }) => {
  const { handleSetNotification } = useNotification();
  const [userReport, setUserReport] = useState<ReportDetailType>();

  useEffect(() => {
    const report = async () => {
      let report: GetFarmerReportDetailReturnType;

      try {
        report = await GetFarmerReportDetail(reportId);

        if (report.success) setUserReport(report.reportDetail);
        else {
          handleSetNotification(report.notifError);
          setViewReport(false);
        }
      } catch (error) {
        const err = error as Error;
        handleSetNotification([{ message: err.message, type: "error" }]);
      }
    };

    report();
  }, [reportId, handleSetNotification, setViewReport]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={() => setViewReport(false)} />
      {userReport && (
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">{userReport.title}</h2>
            <button
              onClick={() => setViewReport(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid gap-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Pamgat ng ulat</p>
                  <p className="font-medium">{userReport.title}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Nang yari ang kaganapan
                  </p>
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

                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Pananim</p>
                  <p className="font-medium">{userReport.cropIdReported}</p>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    userReport.verificationStatus === "false"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {userReport.verificationStatus === "false"
                    ? "kinukumpirma pa"
                    : "Ipinasa na"}
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
          </div>
        </div>
      )}
    </div>
  );
};
