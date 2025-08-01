"use client";

import { PostFarmerReport } from "@/lib/server_action/report";
import {
  CurrentDate,
  FourDaysBefore,
} from "@/util/helper_function/reusableFunction";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import Image from "next/image";

export const AddReportComponent: FC = () => {
  const [addReport, setAddReport] = useState<boolean>(true);

  return (
    <>
      {addReport && <AddingReport setAddReport={setAddReport} />}
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
  const [capturedImageBlob, setCapturedImageBlob] = useState<Blob | null>(null);
  const [openCam, setOpenCam] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [state, formAction, isPending] = useActionState(PostFarmerReport, {
    success: null,
    notifError: null,
    formError: null,
    fieldValues: {
      reportTitle: "",
      reportDescription: "",
      dateHappen: new Date(),
      reportPicture: [],
    },
  });

  useEffect(() => {
    if (videoRef.current) {
      console.log("start play");
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [videoRef, stream]);

  const handleStartCamera = async () => {
    setCapturedImageBlob(null);

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
      setStream(mediaStream);
      setOpenCam(true);
    } catch (error: any) {
      const err = error as Error;
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      )
        handleSetNotification([
          {
            message:
              "Mag bigay ng pahintulot na gamitin ang iyong camera para mag patuloy",
            type: "warning",
          },
        ]);
      else if (error.name === "NotFoundError")
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

  const handleStopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((tracks) => tracks.stop());
      setStream(null);
    }

    setOpenCam(false);
  };

  console.log(stream);
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
              setCapturedImageBlob(blob);
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
      setSelectedFile((prev) => [...prev, ...(e.target.files as FileList)]);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    selectedFile.forEach((file) => {
      formData.append("reportPicture", file);
    });

    formAction(formData);
  };

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
          max={CurrentDate()}
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
          <button type="button" onClick={() => pickFileRef.current?.click()}>
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
          <button type="button" onClick={handleStartCamera}>
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

      {/* previewing the image using the blob that was created using the capture image */}
      {capturedImageBlob && (
        <div>
          <h1>Image preview:</h1>
          <div>
            <Image
              src={URL.createObjectURL(capturedImageBlob)}
              alt="image preview"
              fill // Use fill to make it responsive to the container
              style={{
                objectFit: "contain",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
              // Critical for local Blob URLs, prevents Next.js from trying to optimize local URLs
            />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>
      <div>
        <button type="submit">Ipasa ang ulat</button>
        <button type="button" onClick={() => setAddReport(false)}>
          Ikansela ang pag papasa ng ulat
        </button>
      </div>
    </form>
  );
};
