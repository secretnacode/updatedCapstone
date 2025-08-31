"use client";

import {
  AvailableOrgReturnType,
  CheckCropListReturnType,
  CropErrorFormType,
  EditCropListType,
  ErrorResponseType,
  FarmerDetailCropType,
  FarmerSecondDetailFormType,
  FormActionBaseType,
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
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import { AvailableOrg } from "@/lib/server_action/org";
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
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AlertTriangle } from "lucide-react";
import {
  FormDivLabelInput,
  FormDivLabelSelect,
  SubmitButton,
} from "../server_component/customComponent";

export const FarmerDetailForm: FC = () => {
  const [nextStep, setNextStep] = useState<boolean>(false);
  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
      {/* First Step */}
      <div className={`${nextStep ? "opacity-50" : ""} transition-opacity`}>
        <div
          className={`flex-1 h-2 rounded-full mb-8 ${
            nextStep ? "bg-green-500" : "bg-green-200"
          }`}
        />
        <FarmereDetailFirstStep setNextStep={setNextStep} />
      </div>

      {/* Second Step */}
      <div
        className={`${
          !nextStep ? "opacity-50 pointer-events-none" : ""
        } transition-opacity`}
      >
        <div
          className={`flex-1 h-2 rounded-full mb-8 ${
            nextStep ? "bg-green-200" : "bg-gray-200"
          }`}
        />
        <FarmerDetailSecondStep />
      </div>
    </div>
  );
};

export const FarmereDetailFirstStep: FC<{
  setNextStep: Dispatch<SetStateAction<boolean>>;
}> = ({ setNextStep }): ReactElement => {
  const { handleSetNotification } = useNotification();
  const { handleDoneLoading, handleIsLoading } = useLoading();
  const [state, formAction, isPending] = useActionState(AddFirstFarmerDetails, {
    success: null,
    formError: null,
    notifError: null,
    fieldValues: {
      firstName: "",
      // middleName: "",
      lastName: "",
      // extensionName: "",
      alias: "",
      mobileNumber: "",
      birthdate: new Date().toISOString().split("T")[0],
      farmerBarangay: "",
      // countFamilyMember: "",
      // organization: "",
    },
  });

  useEffect(() => {
    if (state.success === false && state.notifError) {
      handleSetNotification(state.notifError);
    }

    if (state.success) {
      setNextStep(true);
    }

    if (isPending) {
      handleIsLoading("passing your information");
    } else {
      handleDoneLoading();
    }
  }, [
    state,
    handleSetNotification,
    setNextStep,
    isPending,
    handleIsLoading,
    handleDoneLoading,
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="form-title title">Personal na Impormasyon</h2>
      <form action={formAction} className="space-y-6">
        <FormDivLabelInput
          labelMessage="Unang Pangalan:"
          inputName="firstName"
          inputPlaceholder="Hal. Juan"
          inputDefaultValue={state.fieldValues.firstName}
          formError={state.formError?.firstName}
        />

        <FormDivLabelInput
          labelMessage="Gitnang Pangalan:"
          inputName="middleName"
          inputPlaceholder="Hal. Luna"
          // inputDefaultValue={state.fieldValues.middleName}
          // formError={state.formError?.middleName}
        />

        <FormDivLabelInput
          labelMessage="Apelyido:"
          inputName="lastName"
          inputPlaceholder="Hal. Dela Cruz"
          inputDefaultValue={state.fieldValues.lastName}
          formError={state.formError?.lastName}
        />

        <FormDivLabelInput
          labelMessage="Karagdagang Pagkakilanlan"
          inputName="extensionName"
          inputPlaceholder="Hal. Jr."
          // inputDefaultValue={state.fieldValues.extensionName}
          // formError={state.formError?.extensionName}
        />

        <FormDivLabelInput
          labelMessage="Alyas:"
          inputName="alias"
          inputPlaceholder="Hal. Mang. Kanor"
          inputDefaultValue={state.fieldValues.alias ?? ""}
          formError={state.formError?.alias}
        />

        <FormDivLabelInput
          labelMessage="Mobile Number:"
          inputName="mobileNumber"
          inputPlaceholder="Hal. 09*******32 / +639*******32"
          inputDefaultValue={state.fieldValues.mobileNumber}
          formError={state.formError?.mobileNumber}
        />

        <FormDivLabelInput
          labelMessage="Araw ng kapanganakan:"
          inputName="birthdate"
          inputType="date"
          inputMax={new Date().toISOString().split("T")[0]}
          inputDefaultValue={
            state.fieldValues.birthdate instanceof Date
              ? DateToYYMMDD(state.fieldValues.birthdate)
              : ""
          }
          formError={state.formError?.birthdate}
        />

        <FormDivLabelSelect<string>
          labelMessage="Baranggay na iyong tinitirhan:"
          selectDefaultValue={state.fieldValues.farmerBarangay}
          selectName={"farmerBarangay"}
          optionList={baranggayList}
          optionLabel={(baranggay) => baranggay}
          optionValue={(baranggay) =>
            baranggay.charAt(0).toUpperCase() + baranggay.slice(1)
          }
          optionDefaultValueLabel={{
            value: "",
            label: "--Pumili--Ng--Baranggay--",
          }}
        />

        <FormDivLabelSelect<string>
          labelMessage="Organisasyon na Iyong Kabilang:"
          selectDefaultValue={state.fieldValues.farmerBarangay}
          selectName={"farmerBarangay"}
          selectOrganization={true}
          optionList={[]}
          optionLabel={(baranggay) => baranggay}
          optionValue={(baranggay) =>
            baranggay.charAt(0).toUpperCase() + baranggay.slice(1)
          }
          optionDefaultValueLabel={{
            value: "",
            label: "--Pumili--Ng--Organisasyon--",
          }}
        />

        <FormDivLabelInput
          labelMessage="Bilang ng iyong pamilya"
          inputName="countFamilyMember"
          inputPlaceholder="Hal. 5"
          // inputDefaultValue={state.fieldValues.extensionName}
          // formError={state.formError?.extensionName}
        />

        <div>
          <SubmitButton>{isPending ? "Ipinapasa...." : "Ipasa"}</SubmitButton>
        </div>
      </form>
    </div>
  );
};

export const FarmerDetailSecondStep: FC = () => {
  const { handleSetNotification } = useNotification();
  const { handleDoneLoading, handleIsLoading } = useLoading();
  const [otherOrg, setOtherOrg] = useState(false);
  const [availOrg, setAvailOrg] = useState<QueryAvailableOrgReturnType[]>([]);
  const [resubmit, setResubmit] = useState(false);
  const [cropList, setCropList] = useState<FarmerDetailCropType[]>([]);
  const [cancelProceed, setCancelProceed] = useState<boolean>(false);
  const [formErrorList, setFormErrorList] = useState<CropErrorFormType>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [editCropId, setEditCropId] = useState<EditCropListType>({
    editing: false,
    cropId: null,
    listNum: null,
  });
  const [currentCrops, setCurrentCrops] = useState({
    cropId: "",
    organization: "",
    otherOrg: "",
    cropFarmArea: "",
    farmAreaMeasurement: "",
    cropBaranggay: "",
  });
  const [error, setError] = useState<
    FormActionBaseType<FarmerSecondDetailFormType>
  >({ success: null, formError: null, notifError: null });

  // getting all the available orgs in the database when the component mount
  useEffect(() => {
    const GetAvailableOrg = async () => {
      try {
        handleIsLoading(`Loading`);
        const AvailOrg: AvailableOrgReturnType = await AvailableOrg();

        handleDoneLoading();

        if (AvailOrg.success) return setAvailOrg(AvailOrg.data);
        else throw AvailOrg;
      } catch (error) {
        const err = error as ErrorResponseType;
        console.log(error);
        handleSetNotification(err.errors);
      }
    };

    GetAvailableOrg();
  }, [handleSetNotification, handleIsLoading, handleDoneLoading]);

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
    if (e.target.name === "organization") {
      if (e.target.value === "other") setOtherOrg(true);
      else {
        if (currentCrops.otherOrg)
          setCurrentCrops((prev) => ({ ...prev, otherOrg: "" }));

        setOtherOrg(false);
      }
    }

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
  const handleValidateCurrentCrops = ():
    | { [v in keyof FarmerSecondDetailFormType]?: string[] }
    | null => {
    let err: { [v in keyof FarmerSecondDetailFormType]?: string[] } = {};
    for (const [key, value] of Object.entries(currentCrops)) {
      if (key === "otherOrg" && currentCrops.organization !== "other") continue;

      if (value === "") {
        switch (key) {
          case "organization":
            err = {
              ...err,
              organization: ["Pumili ng organisasyon na ikaw ay kasali"],
            };
            break;
          case "otherOrg":
            err = {
              ...err,
              otherOrg: [
                "Ilagay ang organisasyon na ikaw ay kasali pero wala sa listahan",
              ],
            };
            break;
          case "cropFarmArea":
            err = {
              ...err,
              cropFarmArea: [
                "Ilagay kung gaano ka laki ang lote ng iyong pinagtataniman",
              ],
            };
            break;
          case "farmAreaMeasurement":
            err = {
              ...err,
              farmAreaMeasurement: [
                "Pumili kung anong uri ng sukat ang nailagay mo sa laki ng iyong lote",
              ],
            };
            break;
          case "cropBaranggay":
            err = {
              ...err,
              cropBaranggay: [
                "Pumili ng barangay kung saan ang lokasyon ng iyong pinag tataniman",
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
      return setError({
        success: false,
        notifError: null,
        formError: validate,
      });
    }

    handleSaveListAndBackDefault();
  };

  /**
   * setting the state of editCropId into editing and appending the value into the currentCrops state the comes from the children component
   */
  const handleEditCrop = useMemo(() => {
    return (cropToEdit: FarmerDetailCropType, index: number) => {
      setEditCropId({
        editing: true,
        cropId: cropToEdit.cropId,
        listNum: index,
      });
      setCurrentCrops({ ...cropToEdit, otherOrg: cropToEdit.otherOrg ?? "" });
    };
  }, []);

  /**
   * seting the value of the state editCropId into a default value
   */
  const handleDefaultEditState = () => {
    setEditCropId({ editing: false, cropId: null, listNum: null });
  };

  /**
   * executing handleSaveListAndBackDefault and handleDefaultEdiState
   */
  const handleDoneEditingCrop = () => {
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
   * setting the state of otherOrg, error, and currentCrops into their default value
   */
  const handleBackDefault = () => {
    setOtherOrg(false);
    setError({ success: null, notifError: null, formError: null });
    setCurrentCrops({
      cropId: "",
      organization: "",
      otherOrg: "",
      cropFarmArea: "",
      farmAreaMeasurement: "",
      cropBaranggay: "",
    });
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
      setError({ success: false, formError: formError, notifError: null });
  };

  /**
   * checks the value of cropList and currentCrops value before passing the final value in the backenf
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
        valid: false,
        error: {
          success: false,
          formError: hasCurrentCrop,
          notifError: [
            {
              message:
                "Mag lagay ng impormasyon tungkol sa iyong itinatanim bago mag pasa",
              type: "warning",
            },
          ],
        },
      };

    if (
      cropList.length > 0 &&
      hasCurrentCrop &&
      Object.entries(hasCurrentCrop).length > 0 &&
      handleCurrentCropHasVal()
    )
      return {
        valid: false,
        showModal: true,
        error: { success: false, formError: null, notifError: null },
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

  const handleFinalizeCropList = () => {
    handleIsLoading("Loading");
    const validateCrop = handleCheckCropList();
    if (!validateCrop.valid) {
      if (validateCrop.showModal) {
        setCancelProceed(true);
        handleDoneLoading();
        return;
      }
      handleSetNotification(
        validateCrop.error.notifError ?? [
          { message: "Unkown error", type: "warning" },
        ]
      );
      setError(validateCrop.error);
      handleDoneLoading();
      return;
    }

    setResubmit(true);
  };

  const handleBackendValidateFormError = (err: CropErrorFormType) => {
    if (!err)
      return handleSetNotification([
        { message: "No err value", type: "warning" },
      ]);

    setFormErrorList(err);
    setError({ success: false, formError: err[0].formError, notifError: null });

    const firstErr = cropList.filter((crop) => {
      if (crop.cropId === err[0].cropId)
        return {
          cropId: crop.cropId ?? "",
          organization: crop.organization ?? "",
          otherOrg: crop.otherOrg ?? "",
          cropFarmArea: crop.cropFarmArea ?? "",
          farmAreaMeasurement: crop.farmAreaMeasurement ?? "",
          cropBaranggay: crop.cropBaranggay ?? "",
        };
    })[0];

    handleEditCrop(
      { ...firstErr, otherOrg: firstErr.otherOrg ?? "" },
      cropList.findIndex((crop) => crop.cropId === firstErr.cropId)
    );
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await AddSecondFarmerDetails(cropList);
      if (!res.success) {
        handleSetNotification(res.notifError);
        if (res.cropErrors) handleBackendValidateFormError(res.cropErrors);
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {editCropId.editing && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium">
          Binabago ang taniman {editCropId.listNum + 1}
        </div>
      )}

      <form onSubmit={handleFormSubmit} ref={formRef} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="organization"
            className="block text-sm font-medium text-gray-700"
          >
            Organisasyon na kabilang:
          </label>
          <select
            name="organization"
            id=""
            onChange={handleChangeVal}
            value={currentCrops.organization}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">--Pumili--Ng--Organisasyon</option>
            {availOrg.map((org, index) => (
              <option key={index} value={org.orgId}>
                {org.orgName}
              </option>
            ))}

            <option value="other">Mag Lagay ng iba</option>
            <option value="none">Wala</option>
          </select>

          {error.success === false &&
            error.formError?.organization?.map((error, key) => (
              <p key={key + error} className="text-red-500 text-sm">
                {error}
              </p>
            ))}
        </div>

        {otherOrg && (
          <div className="space-y-2">
            <label
              htmlFor="otherOrg"
              className="block text-sm font-medium text-gray-700"
            >
              Ilagay ang Organisasyon na kinabibilangan:
            </label>
            <input
              type="text"
              name="otherOrg"
              onChange={handleChangeVal}
              value={currentCrops.otherOrg}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {error.success === false &&
              error.formError?.otherOrg?.map((error, key) => (
                <p key={key + error} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="cropFarmArea"
              className="block text-sm font-medium text-gray-700"
            >
              Sukat ng lote na iyong Pinagtataniman:
            </label>
            <input
              type="text"
              name="cropFarmArea"
              onChange={handleChangeVal}
              value={currentCrops.cropFarmArea}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {error.success === false &&
              error.formError?.cropFarmArea?.map((error, key) => (
                <p key={key + error} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}

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

              {error.success === false &&
                error.formError?.farmAreaMeasurement?.map((error, key) => (
                  <p key={key + error} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="cropBaranggay"
            className="block text-sm font-medium text-gray-700"
          >
            Lugar ng Iyong pinagtataniman:
          </label>
          <select
            name="cropBaranggay"
            id=""
            onChange={handleChangeVal}
            value={currentCrops.cropBaranggay}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">--Pumili--Ng--Lugar</option>
            {baranggayList.map((brgy, index) => (
              <option key={index} value={brgy}>
                {brgy.charAt(0).toUpperCase() + brgy.slice(1)}
              </option>
            ))}
          </select>

          {error.success === false &&
            error.formError?.cropBaranggay?.map((error, key) => (
              <p key={key + error} className="text-red-500 text-sm">
                {error}
              </p>
            ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={
              editCropId.editing ? handleDoneEditingCrop : handleAddNewCrop
            }
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            {editCropId.editing
              ? "Kumpiramhin ang pag babago"
              : "Mag dagdag ng pananim"}
          </button>

          {editCropId.editing && (
            <>
              <br />
              <button
                type="button"
                onClick={handleCancelEditCrop}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Kanselahin ang pag babago
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleFinalizeCropList}
          disabled={editCropId.editing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ipasa
        </button>
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
        availOrg={availOrg}
        cropError={formErrorList.map((crop) => crop.cropId)}
        handleEditCrop={handleEditCrop}
      />
    </div>
  );
};

const CropsValComponent: FC<{
  cropList: FarmerDetailCropType[];
  availOrg: QueryAvailableOrgReturnType[];
  cropError: string[];
  handleEditCrop: (cropToEdit: FarmerDetailCropType, index: number) => void;
}> = ({ cropList, availOrg, cropError, handleEditCrop }) => {
  const handleOrg = (currentOrg: string, otherOrg: string | null): string => {
    const name = availOrg.filter((org) => currentOrg === org.orgId);
    if (name.length > 0) return name[0].orgName;

    if (currentOrg === "other" && otherOrg) return otherOrg;

    if (currentOrg === "none") return "Wala";

    return "Wala sa pamimilian ang iyong napili";
  };

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
        const isError = cropError.includes(crop.cropId);

        return (
          <div
            key={index}
            onClick={() => handleEditCrop(crop, index)}
            className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md
              ${
                isError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-white hover:border-green-300"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Taniman {index + 1}</h3>
              {isError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Baguhin ito</span>
                </div>
              )}
            </div>
            <dl className="grid gap-1 text-sm">
              <div>
                <dt className="text-gray-500">Organisasyon:</dt>
                <dd className="font-medium">
                  {handleOrg(crop.organization, crop.otherOrg)}
                </dd>
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
