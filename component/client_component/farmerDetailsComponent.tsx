"use client";

import {
  CheckCropListReturnType,
  CropFormErrorsType,
  EditCropListType,
  FarmerDetailCropType,
  FarmerFirstDetailFormType,
  FarmerSecondDetailFormType,
  FormErrorType,
  QueryAvailableOrgReturnType,
} from "@/types";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  memo,
  ReactElement,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import { useLoading } from "./provider/loadingProvider";
import {
  baranggayList,
  CreateUUID,
  DateToYYMMDD,
} from "@/util/helper_function/reusableFunction";
import {
  AddFirstFarmerDetails,
  AddSecondFarmerDetails,
} from "@/lib/server_action/farmerDetails";
import { AlertTriangle, ClipboardPlus } from "lucide-react";
import {
  CancelButton,
  FormCancelSubmitButton,
  FormDivLabelInput,
  FormDivLabelSelect,
  SubmitButton,
} from "../server_component/customComponent";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const FarmerDetailForm: FC<{
  orgList: QueryAvailableOrgReturnType[];
}> = ({ orgList }) => {
  const [nextStep, setNextStep] = useState<boolean>(true);

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 lg:gap-12 mb-10">
        <div
          className={`flex-1 h-2 rounded-full ${
            nextStep ? "bg-green-500" : "bg-green-200"
          }`}
        />
        <div
          className={`flex-1 h-2 rounded-full ${
            nextStep ? "bg-green-200" : "bg-gray-200"
          }`}
        />
      </div>

      <div className="flex justify-center items-center w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full m-4 sm:m-0 sm:w-2/3 md:w-1/2">
          {!nextStep ? (
            <FarmereDetailFirstStep
              setNextStep={setNextStep}
              orgList={orgList}
            />
          ) : (
            <FarmerDetailSecondStep />
          )}
        </div>
      </div>
    </div>
  );
};

export const FarmereDetailFirstStep: FC<{
  setNextStep: Dispatch<SetStateAction<boolean>>;
  orgList: QueryAvailableOrgReturnType[];
}> = ({ setNextStep, orgList }): ReactElement => {
  const { handleSetNotification } = useNotification();
  const { handleDoneLoading, handleIsLoading } = useLoading();
  const [newOrg, setNewOrg] = useState<boolean>(false);
  const [formError, setFormError] =
    useState<FormErrorType<FarmerFirstDetailFormType>>(null);
  const [newUserVal, setNewUserVal] = useState<FarmerFirstDetailFormType>({
    firstName: "",
    middleName: "",
    lastName: "",
    extensionName: "",
    alias: "",
    mobileNumber: "",
    birthdate: new Date(),
    farmerBarangay: "",
    countFamilyMember: "",
    organization: "",
    newOrganization: "",
  });

  const handleChangeVal = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewUserVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (e.target.name === "organization") {
      if (e.target.value === "other") setNewOrg(true);
      else {
        setNewOrg(false);
        setNewUserVal((prev) => ({ ...prev, newOrganization: "" }));
      }
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      handleIsLoading("Isinusumite na ang iyong impormasyon");

      const res = await AddFirstFarmerDetails(newUserVal);

      if (res.success) setNextStep(true);
      else {
        if (res.formError) setFormError(res.formError);

        handleSetNotification(res.notifError);
      }
    } catch (error) {
      console.log((error as Error).message);
      handleSetNotification([
        {
          message:
            "May hindi inaasahang nang yari sa pag papasa ng iyong impormasyon",
          type: "error",
        },
      ]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <div>
      <h2 className="form-title title">Personal na Impormasyon</h2>
      <form onSubmit={handleFormSubmit} className="form">
        <FormDivLabelInput
          labelMessage="Unang Pangalan:"
          inputName="firstName"
          inputValue={newUserVal.firstName}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Juan"
          inputRequired={true}
          formError={formError?.firstName}
        />

        <FormDivLabelInput
          labelMessage="Gitnang Pangalan:"
          inputName="middleName"
          inputValue={newUserVal.middleName}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Luna"
          inputRequired={true}
          // formError={formError?.middleName}
        />

        <FormDivLabelInput
          labelMessage="Apelyido:"
          inputName="lastName"
          inputValue={newUserVal.lastName}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Dela Cruz"
          inputRequired={true}
          formError={formError?.lastName}
        />

        <FormDivLabelInput
          labelMessage="Karagdagang Pagkakilanlan"
          inputName="extensionName"
          inputValue={newUserVal.extensionName ?? ""}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Jr."
          inputRequired={true}
          // formError={formError?.extensionName}
        />

        <FormDivLabelInput
          labelMessage="Alyas:"
          inputName="alias"
          inputValue={newUserVal.alias ?? ""}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Mang. Kanor"
          inputRequired={true}
          formError={formError?.alias}
        />

        <FormDivLabelInput
          labelMessage="Mobile Number:"
          inputName="mobileNumber"
          inputValue={newUserVal.mobileNumber}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. 09*******32 / +639*******32"
          inputRequired={true}
          formError={formError?.mobileNumber}
        />

        <FormDivLabelInput
          labelMessage="Araw ng kapanganakan:"
          inputName="birthdate"
          inputValue={
            newUserVal.birthdate instanceof Date
              ? DateToYYMMDD(newUserVal.birthdate)
              : newUserVal.birthdate
          }
          onChange={handleChangeVal}
          inputType="date"
          inputMax={new Date().toISOString().split("T")[0]}
          inputRequired={true}
          formError={formError?.birthdate}
        />

        <FormDivLabelSelect<string>
          labelMessage="Baranggay na iyong tinitirhan:"
          selectName={"farmerBarangay"}
          selectValue={newUserVal.farmerBarangay}
          onChange={handleChangeVal}
          optionList={baranggayList}
          selectRequired={true}
          formError={formError?.farmerBarangay}
          optionLabel={(baranggay) => baranggay}
          optionValue={(baranggay) =>
            baranggay.charAt(0).toUpperCase() + baranggay.slice(1)
          }
          optionDefaultValueLabel={{
            value: "",
            label: "--Pumili--Ng--Baranggay--",
          }}
        />

        {/* wala pa yung organisasyon na pamimilian */}
        <FormDivLabelSelect<QueryAvailableOrgReturnType>
          labelMessage="Organisasyon na Iyong Kabilang:"
          selectName={"organization"}
          selectValue={newUserVal.organization}
          onChange={handleChangeVal}
          selectOrganization={true}
          optionList={orgList}
          selectRequired={true}
          formError={formError?.organization}
          optionLabel={(baranggay) =>
            baranggay.orgName.charAt(0).toUpperCase() +
            baranggay.orgName.slice(1)
          }
          optionValue={(baranggay) => baranggay.orgId}
          optionDefaultValueLabel={{
            value: "",
            label: "--Pumili--Ng--Organisasyon--",
          }}
        />

        {newOrg && (
          <FormDivLabelInput
            labelMessage="Organisasyon na iyong gagawin"
            inputName="newOrganization"
            inputValue={newUserVal.newOrganization ?? ""}
            onChange={handleChangeVal}
            inputPlaceholder="Hal. 5"
            inputRequired={true}
            // formError={formError?.newOrganization}
          />
        )}

        <FormDivLabelInput
          labelMessage="Bilang ng iyong pamilya"
          inputName="countFamilyMember"
          inputValue={newUserVal.countFamilyMember}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. 5"
          inputRequired={true}
          // formError={formError?.countFamilyMember}
        />

        <div>
          <SubmitButton>Ipasa</SubmitButton>
        </div>
      </form>
    </div>
  );
};

export const FarmerDetailSecondStep: FC = () => {
  const { handleSetNotification } = useNotification();
  const { handleDoneLoading, handleIsLoading } = useLoading();
  const [resubmit, setResubmit] = useState(false);
  const [cropList, setCropList] = useState<FarmerDetailCropType[]>([]);
  const [formErrorList, setFormErrorList] = useState<CropFormErrorsType>([]);
  const [cancelProceed, setCancelProceed] = useState<boolean>(false);
  const [formError, setFormError] =
    useState<FormErrorType<FarmerSecondDetailFormType>>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [editCropId, setEditCropId] = useState<EditCropListType>({
    editing: false,
    cropId: null,
  });
  const [currentCrops, setCurrentCrops] = useState({
    cropId: "",
    cropName: "",
    cropFarmArea: "",
    farmAreaMeasurement: "",
    cropBaranggay: "",
  });

  /**
   * use effect for only resubmiting()
   */
  useEffect(() => {
    if (resubmit) {
      if (formRef.current) {
        formRef.current.requestSubmit();
        setResubmit(false);
      }
    }
  }, [resubmit]);

  const handleChangeVal = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCurrentCrops((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * simple validation for the currentCrops,
   * it detects if a single value of currentCrops has a empty value
   * @returns err that is an array of objects that containst the error of each value in the form,
   * if value in the form is valid then it returns an empty array
   */
  const handleValidateCurrentCrops =
    (): FormErrorType<FarmerSecondDetailFormType> => {
      let err: FormErrorType<FarmerSecondDetailFormType> = {};

      for (const [key, value] of Object.entries(currentCrops)) {
        if (value === "") {
          switch (key) {
            case "cropName":
              err = {
                ...err,
                cropName: [
                  "Mag lagay ng pangalan na sumisimbulo sa pananim nato",
                ],
              };
              break;
            case "cropFarmArea":
              err = {
                ...err,
                cropFarmArea: ["Mag lagay ng lawak ng iyong pinag tataniman"],
              };
              break;
            case "farmAreaMeasurement":
              err = {
                ...err,
                farmAreaMeasurement: ["Pumili ng unit ng lupain"],
              };
              break;
            case "cropBaranggay":
              err = {
                ...err,
                cropBaranggay: [
                  "Pumili ng baranggay kung saan ang lugar ng iyong pinagtataniman",
                ],
              };
              break;
          }
        }
      }

      return err;
    };

  /**
   * performing a simple validation for the currentCrops before executing handleSaveListAndBackDefault
   * @returns a error for the form to use if the simple validation fails
   */
  const handleAddNewCrop = () => {
    const validate = handleValidateCurrentCrops();
    if (validate && Object.entries(validate).length > 0) {
      return handleSetFormError({ ...validate, cropId: [currentCrops.cropId] });
    }

    handleSaveListAndBackDefault();
  };
  console.log(cropList);

  const handleRemoveCropFromList = (cropId: string) => {
    setCropList((prev) => prev.filter((crop) => cropId !== crop.cropId));
  };

  /**
   * seting the value of the state editCropId into a default value
   */
  const handleDefaultEditState = () => {
    setEditCropId({ editing: false, cropId: null });
  };

  /**
   * executing handleSaveListAndBackDefault and handleDefaultEdiState
   */
  const handleDoneEditingCrop = () => {
    if (handleIsExistingName()) return handleSetFormErrorChangeCropName();

    setCropList((prev) =>
      prev.map((crop) =>
        crop.cropId === currentCrops.cropId ? { ...currentCrops } : crop
      )
    );
    handleBackDefault();
    handleDefaultEditState();
  };

  /**
   * executing handleDefaultEdiState and handleBackDefault to make a default value for
   * editCropId, otherOrg, error, and currentCrops into their default value
   */
  const handleCancelEditCrop = () => {
    handleDefaultEditState();
    handleBackDefault();
  };

  /**
   * executing the function handleSaveList and handleBackDefault
   * if the current cropName already exist in the cropList,
   * it wouldnt execute the handleBackDefault function
   */
  const handleSaveListAndBackDefault = () => {
    handleSaveList();
    handleBackDefault();
  };

  /**
   * appending the value of the currentCrops while adding a unique id for that crop list
   */
  const handleSaveList = () => {
    setCropList((prev) => [...prev, { ...currentCrops, cropId: CreateUUID() }]);
  };

  /**
   * function for checking the current crop name is already existing in the cropList, the cropName should be the same as in the cropList and its id is not listed in the editCropId to be considered existing
   * @returns boolean vaye
   */
  const handleIsExistingName = (): boolean => {
    return cropList.some(
      (crop) =>
        crop.cropName === currentCrops.cropName &&
        crop.cropId !== editCropId.cropId
    );
  };

  const handleSetFormErrorChangeCropName = () => {
    setFormError({
      cropName: ["Baguhin ang pangalan dahil ito ay may kagaya na"],
    });
  };

  /**
   * setting the state of otherOrg, error, and currentCrops into their default value
   */
  const handleBackDefault = () => {
    setCurrentCrops({
      cropId: "",
      cropName: "",
      cropFarmArea: "",
      farmAreaMeasurement: "",
      cropBaranggay: "",
    });
    setFormError(null);
  };

  /**
   * checks every value of the currentCrops variable if it has a value or not
   * @returns returns true if the value is not equals to ""(default value, an empty string), and false otherwise
   */
  const handleCurrentCropHasVal = (): boolean => {
    for (const val of Object.values(currentCrops)) {
      if (val !== "") return true;
    }

    return false;
  };

  /**
   * setting all back to default value and setting the reSubmit into true, after the renders it will trigger the useEffect for the re submitting of the form
   */
  const handleForceProceed = () => {
    handleBackDefault();
    setCancelProceed(false);
    setResubmit(true);
    handleIsLoading("Loading");
  };

  const handleCancelProceed = () => {
    setCancelProceed(false);

    const formError = handleValidateCurrentCrops();

    if (formError && Object.entries(formError).length > 0)
      handleSetFormError({ ...formError, cropId: [currentCrops.cropId] });
  };

  const handleSetFormError = (obj: FormErrorType<FarmerDetailCropType>) => {
    setFormError(obj);
  };

  /**
   * checks the value of cropList and currentCrops value before passing the final value in the backend
   * @returns an object, if the valid object value is false then it means both cropList and currentCrops doesnt have a value
   * but if the valid object is true then it comes with cropList object where all the value is
   */
  const handleCheckCropList = (): CheckCropListReturnType => {
    const hasCropList = cropList.length > 0;

    const hasCurrentCrop = handleValidateCurrentCrops();

    if (
      hasCurrentCrop &&
      Object.entries(hasCurrentCrop).length > 0 &&
      !hasCropList
    )
      return {
        showModal: false,
        success: false,
        valid: false,
        formError: hasCurrentCrop,
        notifError: [
          {
            message:
              "Mag lagay ng impormasyon tungkol sa iyong itinatanim bago mag pasa",
            type: "warning",
          },
        ],
      };

    if (
      cropList.length > 0 &&
      hasCurrentCrop &&
      Object.entries(hasCurrentCrop).length > 0 &&
      handleCurrentCropHasVal()
    )
      return {
        showModal: true,
        valid: false,
        success: false,
        formError: hasCurrentCrop,
        notifError: null,
      };

    if (hasCurrentCrop && Object.entries(hasCurrentCrop).length === 0) {
      handleBackDefault();
      setCropList((prev) => [
        ...prev,
        { ...currentCrops, cropId: CreateUUID() },
      ]);
      return { valid: true };
    }

    return { valid: true };
  };

  /**
   * last function to be called after the submission of the form
   * @returns or exit the function if the validation is not met
   */
  const handleFinalizeCropList = () => {
    handleIsLoading("Loading");
    const validateCrop = handleCheckCropList();
    if (!validateCrop.valid) {
      if (validateCrop.showModal) {
        setCancelProceed(true);
        return;
      }

      handleSetNotification(
        validateCrop.notifError ?? [
          { message: "Unkown error", type: "warning" },
        ]
      );

      setFormError(validateCrop.formError);
      handleDoneLoading();
      return;
    }

    setResubmit(true);
  };

  /**
   * setting the state of editCropId into editing and appending the value into the currentCrops state the comes from the children component
   */
  const handleEditCrop = useMemo(() => {
    return (cropToEdit: FarmerDetailCropType) => {
      setEditCropId({
        editing: true,
        cropId: cropToEdit.cropId,
      });
      setCurrentCrops({ ...cropToEdit });
    };
  }, []);

  /**
   * function for handling the response formError of the server action
   * @param formList list of formError that comes from server action
   */
  const handleBackendValidateFormError = (formList: CropFormErrorsType) => {
    if (!formList)
      return handleSetNotification([
        { message: "No err value", type: "warning" },
      ]);

    setFormErrorList(formList);

    const firstErr = cropList.find(
      (crop) => crop.cropId === formList[0].cropId
    );

    if (firstErr) handleEditCrop(firstErr);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await AddSecondFarmerDetails(cropList);

      if (res && !res.success) {
        // handleSetNotification(res.notifError);

        if (res.formList) handleBackendValidateFormError(res.formList);

        handleDoneLoading();
        return;
      }
    } catch (error) {
      if (!isRedirectError(error)) {
        const err = error as Error;
        handleSetNotification([{ message: err.message, type: "error" }]);
      }
    }

    handleDoneLoading();
  };

  return (
    <div>
      <div className={`flex flex-row justify-between items-center mb-4 gap-4`}>
        {editCropId.editing ? (
          <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium w-full text-center">
            Binabago ang taniman{" "}
            <span className="font-bold">
              {
                cropList.find((crop) => crop.cropId === currentCrops.cropId)
                  ?.cropName
              }
            </span>
          </div>
        ) : (
          <>
            <h1 className="title form-title !mb-0 ">
              Impormasyon ng iyong pananim
            </h1>
            <SubmitButton
              type="button"
              onClick={handleAddNewCrop}
              className={`!p-2 !rounded-lg ${
                editCropId.editing && "!cursor-not-allowed hover:!bg-green-600"
              }`}
              disabled={editCropId.editing}
            >
              <ClipboardPlus className="logo !size-5" />
            </SubmitButton>
          </>
        )}
      </div>

      <form onSubmit={handleFormSubmit} ref={formRef} className="form">
        <FormDivLabelInput
          labelMessage="Pangalanan ng taniman:"
          inputName="cropName"
          onChange={handleChangeVal}
          inputValue={currentCrops.cropName}
          inputRequired={true}
          formError={formError?.cropName}
        />

        <FormDivLabelInput
          labelMessage="Sukat ng lote na iyong Pinagtataniman:"
          inputName="cropFarmArea"
          onChange={handleChangeVal}
          inputValue={currentCrops.cropFarmArea}
          inputRequired={true}
          formError={formError?.cropFarmArea}
        />

        <div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Ektarya (Hectares)", value: "ha" },
              { label: "Akre (Acres)", value: "ac" },
              { label: "Talampakang Kuwadrado (Square Feet)", value: "sqft" },
              { label: "Metrong Kuwadrado (Square Meter)", value: "sqm" },
            ].map((measurement) => (
              <div key={measurement.label}>
                <input
                  type="radio"
                  name="farmAreaMeasurement"
                  value={measurement.value}
                  checked={
                    currentCrops.farmAreaMeasurement === measurement.value
                  }
                  onChange={handleChangeVal}
                  className="text-green-600 focus:ring-green-500 cursor-pointer"
                  required
                />
                <label
                  htmlFor="farmAreaMeasurement"
                  className="text-sm text-gray-700 cursor-pointer"
                  onClick={() =>
                    setCurrentCrops((prev) => ({
                      ...prev,
                      farmAreaMeasurement: measurement.value,
                    }))
                  }
                >
                  {measurement.label}
                </label>
              </div>
            ))}
          </div>
          {formError?.farmAreaMeasurement &&
            formError?.farmAreaMeasurement?.map((error) => (
              <p key={error} className="text-red-500 text-sm">
                {error}
              </p>
            ))}
        </div>

        <FormDivLabelSelect<string>
          labelMessage="Lugar ng Iyong pinagtataniman:"
          selectName="cropBaranggay"
          onChange={handleChangeVal}
          selectValue={currentCrops.cropBaranggay}
          formError={formError?.cropBaranggay}
          optionList={baranggayList}
          selectRequired={true}
          optionValue={(branggay) => branggay}
          optionLabel={(branggay) => branggay}
          optionDefaultValueLabel={{
            label: "--Pumili--Ng--Lugar--",
            value: "",
          }}
        />

        {editCropId.editing ? (
          <FormCancelSubmitButton
            submitButtonLabel="Baguhin"
            submitType="button"
            submitOnClick={handleDoneEditingCrop}
            cancelButtonLabel="Kanselahin"
            cancelOnClick={handleCancelEditCrop}
            divClassName="!grid grid-cols-2 !pt-0 pb-6"
          />
        ) : (
          <SubmitButton
            onClick={handleFinalizeCropList}
            disabled={editCropId.editing}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ipasa
          </SubmitButton>
        )}
      </form>

      {cancelProceed && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Mag patuloy padin sa pag papasa?
            </h3>
            <p className="text-gray-600">
              May kulang na impormasyon kang hindi panailalagay, mag patuloy
              padin at baliwalain itong kasalukuyang inilalagay mo?
            </p>
            <button
              onClick={handleForceProceed}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Mag patuloy
            </button>
            <button
              onClick={handleCancelProceed}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Bumalik
            </button>
          </div>
        </div>
      )}

      <MemoizedCropsValComponent
        cropList={cropList}
        cropErrors={formErrorList?.map((error) => error.cropId)}
        handleEditCrop={handleEditCrop}
        handleRemoveCropFromList={handleRemoveCropFromList}
      />
    </div>
  );
};

const CropsValComponent: FC<{
  cropList: FarmerDetailCropType[];
  cropErrors: string[];
  handleEditCrop: (cropToEdit: FarmerDetailCropType) => void;
  handleRemoveCropFromList: (cropId: string) => void;
}> = ({ cropList, cropErrors, handleEditCrop, handleRemoveCropFromList }) => {
  const convertMeasurement = (measure: string) => {
    switch (measure) {
      case "ha":
        return "Ektarya(Hectares)";
      case "ac":
        return "Akre(Acres)";
      case "sqft":
        return "Talampakang Kuwadrado(Square Feet)";
      case "sqm":
        return "Metrong Kuwadrado(Square Meter)";
      default:
        return "";
    }
  };

  return (
    <div className=" grid gap-4 mt-6">
      {cropList?.map((crop, index) => {
        const isError = cropErrors.includes(crop.cropId);

        return (
          <div
            key={index}
            onClick={() => handleEditCrop(crop)}
            className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md
              ${
                isError
                  ? "border-red-300 bg-red-50 hover:border-green-400"
                  : "border-gray-200 bg-white hover:border-green-300"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  Pangalan ng taniman: {crop.cropName}
                </h3>
              </div>

              {isError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Baguhin ito</span>
                </div>
              )}
            </div>
            <dl className="grid gap-1 text-sm space-y-1">
              <div>
                <dt className="text-gray-500">Crop name:</dt>
                <dd className="font-medium">{crop.cropName}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Lote:</dt>
                <dd className="font-medium">
                  {crop.cropFarmArea}{" "}
                  {convertMeasurement(crop.farmAreaMeasurement)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Lokasyon:</dt>
                <dd className="font-medium">{crop.cropBaranggay}</dd>
              </div>
            </dl>
          </div>
        );
      })}
    </div>
  );
};

const MemoizedCropsValComponent = memo(CropsValComponent);
