"use client";

import {
  AvailableOrgReturnType,
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
import { AddFirstFarmerDetails } from "@/lib/server_action/farmerDetails";

export const FarmerDetailForm: FC = () => {
  console.log(`farmer details form`);

  const [nextStep, setNextStep] = useState<boolean>(true);
  return (
    <div>
      {nextStep ? (
        <FarmerDetailSecondStep />
      ) : (
        <FarmereDetailFirstStep setNextStep={setNextStep} />
      )}
    </div>
  );
};

export const FarmereDetailFirstStep: FC<{
  setNextStep: Dispatch<SetStateAction<boolean>>;
}> = ({ setNextStep }): ReactElement => {
  console.log(`farmer 1st detail form`);
  const { handleSetNotification } = useNotification();
  const { handleDoneLoading, handleIsLoading } = useLoading();
  const [state, formAction, isPending] = useActionState(AddFirstFarmerDetails, {
    success: null,
    formError: null,
    notifError: null,
    fieldValues: {
      firstName: "",
      lastName: "",
      alias: "",
      mobileNumber: "",
      birthdate: new Date(),
      farmerBarangay: "",
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
    <div>
      <form action={formAction}>
        <div>
          <label htmlFor="firstName">Unang Pangalan:</label>
          <input
            type="text"
            name="firstName"
            defaultValue={state.fieldValues.firstName}
          />
          {!state.success &&
            state.formError?.firstName?.map((err, index) => (
              <p key={err + index}>{err}</p>
            ))}
        </div>

        <div>
          <label htmlFor="lastName">Apelyido:</label>
          <input
            type="text"
            name="lastName"
            defaultValue={state.fieldValues.lastName}
          />
          {!state.success &&
            state.formError?.lastName?.map((err, index) => (
              <p key={err + index}>{err}</p>
            ))}
        </div>

        <div>
          <label htmlFor="alias">Alyas</label>
          <input
            type="text"
            name="alias"
            defaultValue={state.fieldValues.alias ?? ""}
          />
        </div>

        <div>
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="text"
            name="mobileNumber"
            defaultValue={state.fieldValues.mobileNumber}
          />
          {!state.success &&
            state.formError?.mobileNumber?.map((err, index) => (
              <p key={err + index}>{err}</p>
            ))}
        </div>

        <div>
          <label htmlFor="birthdate">Araw ng kapanganakan:</label>
          <input
            type="date"
            name="birthdate"
            defaultValue={
              state.success === false &&
              state.fieldValues.birthdate instanceof Date &&
              !isNaN(Number(state.fieldValues.birthdate))
                ? DateToYYMMDD(state.fieldValues.birthdate)
                : ""
            }
            max={new Date().toISOString().split("T")[0]}
          />
          {!state.success &&
            state.formError?.birthdate?.map((err, index) => (
              <p key={err + index}>{err}</p>
            ))}
        </div>

        <div>
          <label htmlFor="farmerBarangay">Baranggay na iyong tinitirhan:</label>
          <select
            name="farmerBarangay"
            defaultValue={state.fieldValues.farmerBarangay}
          >
            <option value="">--Pumili--Ng--Baranggay--</option>
            {baranggayList.map((baranggay, index) => (
              <option key={index} value={baranggay}>
                {baranggay.charAt(0).toUpperCase() + baranggay.slice(1)}
              </option>
            ))}
          </select>
          {!state.success &&
            state.formError?.farmerBarangay?.map((err, index) => (
              <p key={err + index}>{err}</p>
            ))}
        </div>

        <div>
          <button type="submit">{isPending ? "Ipinapasa...." : "Ipasa"}</button>
        </div>
      </form>
    </div>
  );
};

export const FarmerDetailSecondStep: FC = () => {
  console.log(`farmer 2nd detail form`);
  const { handleSetNotification } = useNotification();
  const { handleDoneLoading, handleIsLoading } = useLoading();
  const [otherOrg, setOtherOrg] = useState(false);
  const [availOrg, setAvailOrg] = useState<QueryAvailableOrgReturnType>([]);
  const [cropList, setCropList] = useState<FarmerDetailCropType[]>([]);
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
    let err: { [v in keyof FarmerSecondDetailFormType]?: string[] } | null = {};
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
  console.log(cropList);

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
      farmAreaMeasurement: currentCrops.farmAreaMeasurement,
      cropBaranggay: "",
    });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newCropList = [...cropList, { ...currentCrops }];

      console.log(newCropList);
      // const res = await AddSecondFarmerDetails(newCropList);
    } catch {}
  };

  return (
    <>
      {editCropId.editing && (
        <div>Binabago ang taniman {editCropId.listNum}</div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="organization">Organisasyon na kabilang:</label>
          <select
            name="organization"
            id=""
            onChange={handleChangeVal}
            value={currentCrops.organization}
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
              <p key={key + error}>{error}</p>
            ))}
        </div>

        {otherOrg && (
          <div>
            <label htmlFor="otherOrg">
              Ilagay ang Organisasyon na kinabibilangan:
            </label>
            <input
              type="text"
              name="otherOrg"
              onChange={handleChangeVal}
              value={currentCrops.otherOrg}
            />
            {error.success === false &&
              error.formError?.otherOrg?.map((error, key) => (
                <p key={key + error}>{error}</p>
              ))}
          </div>
        )}

        <div>
          <label htmlFor="cropFarmArea">
            Sukat ng lote na iyong Pinagtataniman:
          </label>
          <input
            type="text"
            name="cropFarmArea"
            onChange={handleChangeVal}
            value={currentCrops.cropFarmArea}
          />
          {error.success === false &&
            error.formError?.cropFarmArea?.map((error, key) => (
              <p key={key + error}>{error}</p>
            ))}

          <div>
            <div>
              <label htmlFor="">Ektarya(Hectares)</label>
              <input
                type="radio"
                name="farmAreaMeasurement"
                value={"ha"}
                onChange={handleChangeVal}
              />
            </div>

            <div>
              <label htmlFor="">Akre(Acres)</label>
              <input
                type="radio"
                name="farmAreaMeasurement"
                value={"ac"}
                onChange={handleChangeVal}
              />
            </div>

            <div>
              <label htmlFor="">Talampakang Kuwadrado(Square Feet)</label>
              <input
                type="radio"
                name="farmAreaMeasurement"
                value={"sqft"}
                onChange={handleChangeVal}
              />
            </div>

            <div>
              <label htmlFor="">Metrong Kuwadrado(Square Meter)</label>
              <input
                type="radio"
                name="farmAreaMeasurement"
                value={"sqm"}
                onChange={handleChangeVal}
              />
            </div>
            {error.success === false &&
              error.formError?.farmAreaMeasurement?.map((error, key) => (
                <p key={key + error}>{error}</p>
              ))}
          </div>
        </div>

        <div>
          <label htmlFor="cropBaranggay">Lugar ng Iyong pinagtataniman:</label>
          <select
            name="cropBaranggay"
            id=""
            onChange={handleChangeVal}
            value={currentCrops.cropBaranggay}
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
              <p key={key + error}>{error}</p>
            ))}
        </div>

        <button
          type="button"
          onClick={
            editCropId.editing ? handleDoneEditingCrop : handleAddNewCrop
          }
        >
          {editCropId.editing
            ? "Kumpiramhin ang pag babago"
            : "Mag dagdag ng pananim"}
        </button>

        {editCropId.editing && (
          <>
            <br />
            <button type="button" onClick={handleCancelEditCrop}>
              Kanselahin ang pag babago
            </button>
          </>
        )}

        <br />
        <button type="submit">Ipasa</button>
      </form>

      <MemoizedCropsValComponent
        cropList={cropList}
        availOrg={availOrg}
        handleEditCrop={handleEditCrop}
      />
    </>
  );
};

const CropsValComponent: FC<{
  cropList: FarmerDetailCropType[];
  availOrg: QueryAvailableOrgReturnType;
  handleEditCrop: (cropToEdit: FarmerDetailCropType, index: number) => void;
}> = ({ cropList, availOrg, handleEditCrop }) => {
  console.log("Crop Value Component");
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
    <>
      {cropList &&
        cropList.map((crop, index) => (
          <div key={index} onClick={() => handleEditCrop(crop, index)}>
            <p>Taniman {index}</p>
            <p>
              Organisasyon na iyong pinapasukan:{" "}
              {handleOrg(crop.organization, crop.otherOrg)}
            </p>
            <p>
              Lote ng iyong pinag tataniman: {crop.cropFarmArea}{" "}
              {convertMeasurement(crop.farmAreaMeasurement)}
            </p>
            <p>Lugar ng Iyong pinagtataniman: {crop.cropBaranggay}</p>

            <button></button>
            <br />
          </div>
        ))}
    </>
  );
};

const MemoizedCropsValComponent = memo(CropsValComponent);
