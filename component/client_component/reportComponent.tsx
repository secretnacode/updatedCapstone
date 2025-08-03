"use client";

import { PostFarmerReport } from "@/lib/server_action/report";
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
  memo,
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
import { X } from "lucide-react";
import { AddReportPictureType } from "@/types";
import { useLoading } from "./provider/loadingProvider";

export const AddReportComponent: FC = () => {
  const [addReport, setAddReport] = useState<boolean>(true);

  return (
    <>
      {addReport && <MemoizedAddingReport setAddReport={setAddReport} />}
      <button onClick={() => setAddReport(true)}>Mag sagawa ng ulat</button>
    </>
  );
};

const AddingReport: FC<{
  setAddReport: Dispatch<SetStateAction<boolean>>;
}> = ({ setAddReport }) => {
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
    if (!state.success && !isPassing) handleDoneLoading();
  }, [state.success, isPassing, handleDoneLoading]);

  console.log(selectedFile);

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
              console.log(`failes to make it blob`);
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
        console.log(`failes to make it 2d`);
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

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      console.log(`stopping the camera`);
      if (openCam) handleStopCamera();
    };
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="reportTitle">Pamagat ng ulat:</label>
        <input type="text" name="reportTitle" />
        {!state.success &&
          state.formError?.reportTitle?.map((err, index) => (
            <p key={err + index}>{err}</p>
          ))}
      </div>

      <div>
        <label htmlFor="reportDescription">Ilarawan ang ulat:</label>
        <textarea name="reportDescription" />
        {!state.success &&
          state.formError?.reportDescription?.map((err, index) => (
            <p key={err + index}>{err}</p>
          ))}
      </div>

      <div>
        <label htmlFor="dateHappen">Araw na ito ay naganap:</label>
        <input
          type="date"
          name="dateHappen"
          min={FourDaysBefore()}
          max={MaxDateToday()}
        />
        {!state.success &&
          state.formError?.dateHappen?.map((err, index) => (
            <p key={err + index}>{err}</p>
          ))}
      </div>

      <div>
        <label htmlFor="reportPicture">
          Mag lagay ng larawan ng mga nasira
        </label>

        <div>
          <button
            type="button"
            disabled={isPassing}
            onClick={() => pickFileRef.current?.click()}
          >
            Pumili ng larawan
          </button>

          <input
            multiple
            type="file"
            ref={pickFileRef}
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>

        <div>
          <button
            type="button"
            disabled={openCam || isPassing}
            onClick={handleStartCamera}
          >
            Gamitin ang camera
          </button>
        </div>
        {!state.success &&
          state.formError?.reportPicture?.map((err, index) => (
            <p key={err + index}>{err}</p>
          ))}
      </div>

      {/* view for viewing the cam */}
      {openCam && (
        <>
          <video
            ref={videoRef}
            playsInline
            muted
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              borderRadius: "8px",
              background: "#000",
            }}
          ></video>
          <div>
            <button type="button" onClick={handleCaptureImage}>
              Capture Photo
            </button>
            <button type="button" onClick={handleStopCamera}>
              Stop Camera
            </button>
          </div>
        </>
      )}

      {selectedFile && (
        <div className="grid grid-cols-3">
          {selectedFile.map((image, index) => (
            <div key={image.picId + index}>
              <div className="relative h-[200px] w-[200px]">
                <X
                  onClick={() => handleRemovePicture(image.picId)}
                  className="z-20 relative"
                />
                <Image
                  src={URL.createObjectURL(image.file)}
                  alt={`image report ${index + 1}`}
                  fill
                  unoptimized
                  className="absolute z-0"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* turning the captured picture into a canvas, then turning canvas into a blob(file) */}
      <canvas ref={canvasRef} className="hidden" />
      <div>
        <button type="submit" disabled={isPassing}>
          Mag pasa ng ulat
        </button>
        <button
          type="button"
          onClick={() => setAddReport(false)}
          disabled={isPassing}
        >
          Kanselahin ang pagpapasa
        </button>
      </div>
    </form>
  );
};

const MemoizedAddingReport = memo(AddingReport);
