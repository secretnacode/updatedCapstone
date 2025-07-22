"use client";

import {
  AvailableOrgReturnType,
  CropListType,
  ErrorResponseType,
  QueryAvailableOrgReturnType,
} from "@/types";
import {
  ChangeEvent,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useActionState,
  useEffect,
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

export const FarmerDetailForm: FC = () => {
  console.log(`farmer details form`);

  const [nextStep, setNextStep] = useState<boolean>(true);
  const { handleIsLoading, handleDoneLoading } = useLoading();
  return (
    <div>
      {nextStep ? (
        <FarmerDetailSecondStep
          handleIsLoading={handleIsLoading}
          handleDoneLoading={handleDoneLoading}
        />
      ) : (
        <FarmereDetailFirstStep
          setNextStep={setNextStep}
          handleIsLoading={handleIsLoading}
          handleDoneLoading={handleDoneLoading}
        />
      )}
    </div>
  );
};

export const FarmereDetailFirstStep: FC<{
  setNextStep: Dispatch<SetStateAction<boolean>>;
  handleIsLoading: (message: string) => void;
  handleDoneLoading: () => void;
}> = ({ setNextStep, handleIsLoading, handleDoneLoading }): ReactElement => {
  console.log(`farmer 1st detail form`);
  const { handleSetNotification } = useNotification();
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
      handleSetNotification([
        state.notifError ?? { message: "unkown error", type: "error" },
      ]);
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

export const FarmerDetailSecondStep: FC<{
  handleIsLoading: (message: string) => void;
  handleDoneLoading: () => void;
}> = ({ handleIsLoading, handleDoneLoading }) => {
  console.log(`farmer 2nd detail form`);
  const { handleSetNotification } = useNotification();
  const [organization, setOrganization] = useState<QueryAvailableOrgReturnType>(
    []
  );
  const [otherOrg, setOtherOrg] = useState<boolean>(false);
  const [currentCropList, setCurrentCropList] = useState<CropListType>({
    cropId: CreateUUID(),
    cropFarmArea: 0,
    farmAreaMeasurement: "ha",
    cropBaranggay: "",
  });
  const [cropList, setCropList] = useState<CropListType[] | []>([]);
  const [state, formAction] = useActionState(AddSecondFarmerDetails, {
    success: null,
    formError: null,
    notifError: null,
    fieldValues: {
      organization: null,
      otherOrg: null,
      cropFarmArea: "",
      farmAreaMeasurement: "ha",
      cropBaranggay: "",
    },
  });

  // getting all the available orgs in the database when the component mount
  useEffect(() => {
    const GetAvailableOrg = async () => {
      try {
        handleIsLoading(`Loading`);
        const AvailOrg: AvailableOrgReturnType = await AvailableOrg();

        handleDoneLoading();

        if (AvailOrg.success) return setOrganization(AvailOrg.data);
        else throw AvailOrg;
      } catch (error) {
        const err = error as ErrorResponseType;
        console.log(error);
        handleSetNotification(err.errors);
      }
    };

    GetAvailableOrg();
  }, [handleSetNotification, handleIsLoading, handleDoneLoading]);

  const handleChangeCropVal = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log(`${e.target.name}: ${e.target.value}`);
    setCurrentCropList((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddCropList = () => {
    setCropList((prev) => [...prev, currentCropList]);
    setCurrentCropList({
      cropId: CreateUUID(),
      cropFarmArea: 0,
      farmAreaMeasurement: "ha",
      cropBaranggay: "",
    });
  };

  const handleOtherOrg = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "other") setOtherOrg(true);
    else setOtherOrg(false);
  };

  return (
    <>
      <button onClick={handleAddCropList}>Add crop</button>
      <form action={formAction}>
        <div>
          <label htmlFor="organization">Organisasyon na kabilang:</label>
          <select name="organization" id="" onChange={handleOtherOrg}>
            <option value="">--Pumili--Ng--Organisasyon</option>
            {organization.map((org, index) => (
              <option key={index} value={org.orgId}>
                {org.orgName}
              </option>
            ))}

            <option value="other">Mag Lagay ng iba</option>
            <option value="none">Wala</option>
          </select>
          {!state.success &&
            state.formError?.organization?.map((err, index) => (
              <p key={err + index}>{err}</p>
            ))}
        </div>

        {otherOrg && (
          <div>
            <label htmlFor="otherOrg">
              Ilagay ang Organisasyon na kinabibilangan:
            </label>
            <input type="text" name="otherOrg" />
            {!state.success &&
              state.formError?.otherOrg?.map((err, index) => (
                <p key={err + index}>{err}</p>
              ))}
          </div>
        )}

        <div>
          <label htmlFor="cropFarmArea">
            Sukat ng lote na iyong Pinagtataniman:
          </label>
          <input
            type="number"
            name="cropFarmArea"
            min={0}
            value={currentCropList.cropFarmArea}
            onChange={handleChangeCropVal}
          />
          {!state.success &&
            state.formError?.cropFarmArea?.map((err, index) => (
              <p key={err + index}>{err}</p>
            ))}

          <div>
            <div>
              <label htmlFor="">Ektarya(Hectares)</label>
              <input
                type="radio"
                name="farmAreaMeasurement"
                value={"ha"}
                onChange={handleChangeCropVal}
              />
            </div>

            <div>
              <label htmlFor="">Akre(Acres)</label>
              <input
                type="radio"
                name="farmAreaMeasurement"
                value={"ac"}
                onChange={handleChangeCropVal}
              />
            </div>

            <div>
              <label htmlFor="">Talampakang Kuwadrado(Square Feet)</label>
              <input
                type="radio"
                name="farmAreaMeasurement"
                value={"sqft"}
                onChange={handleChangeCropVal}
              />
            </div>

            <div>
              <label htmlFor="">Metrong Kuwadrado(Square Meter)</label>
              <input
                type="radio"
                name="farmAreaMeasurement"
                value={"sqm"}
                onChange={handleChangeCropVal}
              />
            </div>
            {!state.success &&
              state.formError?.farmAreaMeasurement?.map((err, index) => (
                <p key={err + index}>{err}</p>
              ))}
          </div>
        </div>

        <div>
          <label htmlFor="cropBaranggay">Lugar ng Iyong pinagtataniman:</label>
          <select
            name="cropBaranggay"
            id=""
            value={currentCropList.cropBaranggay}
            onChange={handleChangeCropVal}
          >
            <option value="">--Pumili--Ng--Lugar</option>
            {baranggayList.map((brgy, index) => (
              <option key={index} value={brgy}>
                {brgy.charAt(0).toUpperCase() + brgy.slice(1)}
              </option>
            ))}
          </select>

          {!state.success &&
            state.formError?.cropBaranggay?.map((err, index) => (
              <p key={err + index}>{err}</p>
            ))}
        </div>
        <button type="submit">Ipasa</button>

        <FarmerCropDetail cropList={cropList} />
      </form>
    </>
  );
};

const FarmerCropDetail: FC<{ cropList: CropListType[] | [] }> = ({
  cropList,
}) => {
  return (
    <>
      {cropList.map((list) => (
        <div key={list.cropId}>
          <p>Id: {list.cropId}</p>
          <p>Farm Area: {list.cropFarmArea}</p>
          <p>Area Measurement: {list.farmAreaMeasurement}</p>
          <p>Farm location: {list.cropBaranggay}</p>
        </div>
      ))}
    </>
  );
};
