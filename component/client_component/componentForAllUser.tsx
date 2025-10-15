"use client";

import {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import { useRouter } from "next/navigation";
import {
  ApprovedButtonPropType,
  DeleteUserPropType,
  FormErrorType,
  GetFarmerProfilePersonalInfoQueryReturnType,
  MyOrganizationFormPropType,
  OrgInfoType,
  MyProfileFormPropType,
  LineChartComponentPropType,
  barDataStateType,
  getReportCountThisWeekReturnType,
  getReportCountThisAndPrevMonthReturnType,
  getReportCountThisYearReturnType,
} from "@/types";
import {
  ApprovedOrgFarmerAcc,
  UpdateUserProfileInfo,
} from "@/lib/server_action/farmerUser";
import { useLoading } from "./provider/loadingProvider";
import { UpdateUserProfileOrg } from "@/lib/server_action/org";
import {
  Button,
  FormCancelSubmitButton,
  FormDivLabelInput,
  FormDivLabelSelect,
  ModalNotice,
} from "../server_component/customComponent";
import { DelteUserAccount } from "@/lib/server_action/user";
import { LineChart } from "@mui/x-charts";
import {
  baranggayList,
  DateToYYMMDD,
} from "@/util/helper_function/reusableFunction";

export const MyProfileForm: FC<MyProfileFormPropType> = ({ userInfo }) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [isChangingVal, setIsChangingVal] = useState<boolean>(false);
  const [formError, setFormError] =
    useState<FormErrorType<GetFarmerProfilePersonalInfoQueryReturnType>>(null);
  const [userInfoState, setUserInfoState] =
    useState<GetFarmerProfilePersonalInfoQueryReturnType>(userInfo);

  const handleChangeState = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserInfoState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setIsChangingVal(true);
  };

  const handleReset = () => {
    setIsChangingVal(false);
    setFormError(null);
  };

  /**
   * resets the value and its form val if not passed yet
   */
  const handleResetFormVal = () => {
    setUserInfoState(userInfo);
    handleReset();
  };

  const handleFormSubmit = async () => {
    try {
      handleIsLoading("Ina-update na ang iyong impormasyon...");

      const updateAction = await UpdateUserProfileInfo(userInfoState);

      if (updateAction.success) {
        handleReset();
      } else {
        if (updateAction.formError) setFormError(updateAction.formError);
      }

      handleSetNotification(updateAction.notifMessage);
    } catch (error) {
      handleSetNotification([
        { message: (error as Error).message, type: "error" },
      ]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <>
      <FormDivLabelInput
        labelMessage={"Unang Pangalan"}
        inputName={"farmerFirstName"}
        inputType={"text"}
        inputPlaceholder={"Hal. Jose"}
        inputDisable={false}
        inputValue={userInfoState.farmerFirstName}
        formError={formError?.farmerFirstName}
        onChange={handleChangeState}
      />

      <FormDivLabelInput
        labelMessage={"Gitnang Pangalan"}
        inputName={"farmerMiddleName"}
        inputType={"text"}
        inputPlaceholder={"Hal. Luzviminda"}
        inputDisable={false}
        inputValue={userInfoState.farmerMiddleName}
        formError={formError?.farmerMiddleName}
        onChange={handleChangeState}
      />

      <FormDivLabelInput
        labelMessage={"Apelyido"}
        inputName={"farmerLastName"}
        inputType={"text"}
        inputPlaceholder={"Hal. Juan Delacruz"}
        inputDisable={false}
        inputValue={userInfoState.farmerLastName}
        formError={formError?.farmerLastName}
        onChange={handleChangeState}
      />

      <FormDivLabelInput
        labelMessage={"Palayaw na pagdugtong"}
        inputName={"farmerExtensionName"}
        inputType={"text"}
        inputPlaceholder={"Hal. Jr"}
        inputDisable={false}
        inputValue={userInfoState.farmerExtensionName}
        formError={formError?.farmerExtensionName}
        onChange={handleChangeState}
      />

      <FormDivLabelInput
        labelMessage={"Alyas"}
        inputName={"farmerAlias"}
        inputType={"text"}
        inputPlaceholder={"Hal. Mang Kanor"}
        inputDisable={false}
        inputValue={userInfoState.farmerAlias}
        formError={formError?.farmerAlias}
        onChange={handleChangeState}
      />

      {/* WALA PA NITO SA DATABASE */}
      <FormDivLabelInput
        labelMessage="Kasarian"
        inputDisable={true}
        inputName={"farmerSex"}
        inputDefaultValue={`wala pang nakalagay sa database`}
        inputPlaceholder="Hal. lalaki"
      />

      <FormDivLabelSelect
        labelMessage="Baranggay na tinitirhan"
        selectName={"barangay"}
        childrenOption={baranggayList.map((brgy) => (
          <option key={brgy} value={brgy}>
            {brgy.charAt(0).toUpperCase() + brgy.slice(1)}
          </option>
        ))}
        selectValue={userInfoState.barangay}
        formError={formError?.barangay}
        onChange={handleChangeState}
      />

      <FormDivLabelInput
        labelMessage={"Numero ng Telepono"}
        inputName={"mobileNumber"}
        inputType={"text"}
        inputPlaceholder={"Hal. 09** *** ****"}
        inputDisable={false}
        inputValue={userInfoState.mobileNumber}
        formError={formError?.mobileNumber}
        onChange={handleChangeState}
      />

      <FormDivLabelInput
        labelMessage={"Kapanganakan"}
        inputName={"birthdate"}
        inputType={"date"}
        inputDisable={false}
        inputValue={
          userInfoState.birthdate instanceof Date
            ? DateToYYMMDD(userInfoState.birthdate)
            : String(userInfoState.birthdate)
        }
        formError={formError?.birthdate}
        onChange={handleChangeState}
      />

      <FormDivLabelInput
        labelMessage={"Bilang ng pamilya"}
        inputName={"familyMemberCount"}
        inputType={"text"}
        inputDisable={false}
        inputValue={userInfoState.familyMemberCount}
        formError={formError?.familyMemberCount}
        onChange={handleChangeState}
      />

      {isChangingVal && (
        <div className="col-span-full">
          <FormCancelSubmitButton
            submitType={"button"}
            submitButtonLabel="Baguhin"
            submitOnClick={handleFormSubmit}
            cancelOnClick={handleResetFormVal}
            cancelButtonLabel="Ibalik"
          />
        </div>
      )}
    </>
  );
};

export const MyOrganizationForm: FC<MyOrganizationFormPropType> = ({
  availOrgList,
  userOrgInfo,
}) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [formError, setFormError] = useState<FormErrorType<OrgInfoType>>(null);
  const [otherOrg, setOtherOrg] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isChangingVal, setIsChangingVal] = useState<boolean>(false);
  const [orgInfo, setOrgInfo] = useState<OrgInfoType>({
    orgId: "",
    otherOrgName: "",
  });

  const handleUserOrgChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      setOrgInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

      if (!isChangingVal) setIsChangingVal(true);

      if (
        (e.target.name === "orgId" && e.target.value === "other") ||
        e.target.name === "otherOrgName"
      )
        setOtherOrg(true);
      else setOtherOrg(false);
    },
    [isChangingVal]
  );

  const handleReset = useCallback(() => {
    setOtherOrg(false);
    setShowModal(false);
    setIsChangingVal(false);
    setFormError(null);
  }, []);

  const handleResetForm = useCallback(() => {
    setOrgInfo({ orgId: userOrgInfo.orgId, otherOrgName: "" });
    handleReset();
  }, [userOrgInfo.orgId, handleReset]);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();

        handleIsLoading("Binabago na ang iyong organisasyon....");

        const res = await UpdateUserProfileOrg(orgInfo);

        if (res.success) {
          handleReset();
          setOrgInfo({ orgId: res.newOrgIdVal, otherOrgName: "" });
        }

        if (!res.success && res.formError) setFormError(res.formError);

        handleSetNotification(res.notifMessage);
      } catch (error) {
        console.log((error as Error).message);
        handleSetNotification([
          { message: "May hindi inaasahang error ang nangyari", type: "error" },
        ]);
      } finally {
        handleDoneLoading();
      }
    },
    [
      handleIsLoading,
      handleSetNotification,
      handleReset,
      handleDoneLoading,
      orgInfo,
    ]
  );

  return (
    <>
      <FormDivLabelSelect
        labelMessage={"Pangalan ng Organisasyon"}
        selectName={"orgId"}
        selectOrganization={true}
        selectValue={orgInfo.orgId ?? ""}
        onChange={handleUserOrgChange}
        selectDisable={false}
        childrenOption={availOrgList.map((org) => (
          <option key={org.orgId} value={org.orgId}>
            {org.orgName.charAt(0).toUpperCase() + org.orgName.slice(1)}
          </option>
        ))}
        formError={formError?.orgId}
      />

      {otherOrg && (
        <FormDivLabelInput
          labelMessage="Mag lagay ng panibagong organisasyon"
          inputName={"otherOrgName"}
          inputValue={orgInfo.otherOrgName ?? ""}
          inputPlaceholder="e.g. Kataniman"
          onChange={handleUserOrgChange}
          formError={formError?.otherOrgName}
        />
      )}

      <FormDivLabelInput
        labelMessage="Leader ng Organisasyon"
        inputDisable={true}
        inputName={"leaderName"}
        inputDefaultValue={userOrgInfo.farmerLeader}
        inputPlaceholder="Miyembro"
      />

      <FormDivLabelInput
        labelMessage="Posisyon"
        inputDisable={true}
        inputName={"orgRole"}
        inputDefaultValue={userOrgInfo.orgRole}
        inputPlaceholder="Miyembro"
      />

      {isChangingVal && (
        <div className="col-span-full">
          <FormCancelSubmitButton
            submitButtonLabel="Ipasa"
            submitType="button"
            submitOnClick={() => setShowModal(true)}
            cancelButtonLabel="Kanselahin"
            cancelOnClick={handleResetForm}
          />
        </div>
      )}

      {showModal && (
        <ModalNotice
          type={"warning"}
          title="Mag babago ng organisasyon?"
          showCancelButton={true}
          onClose={() => setShowModal(false)}
          onProceed={() => handleFormSubmit}
          message={
            <>
              <span className="p block font-bold !text-lg mb-4">
                Kapag nagpalit ka ng organisasyon, kailangang maaprubahan muna
                ang iyong account bago ulit ka makapagsumite ng ulat.
              </span>
              <span className="p block !text-[17px] tracking-wide">
                Magpatuloy sa pagpapalit ng organisasyon?
              </span>
            </>
          }
          proceed={{ label: "Mag Patuloy" }}
          cancel={{ label: "Bumalik" }}
        />
      )}
    </>
  );
};

export const ApprovedButton: FC<ApprovedButtonPropType> = ({
  farmerId,
  verificationStatus,
  label = "Aprubahan",
}) => {
  const router = useRouter();
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleApproveFarmerAcc = async () => {
    try {
      handleIsLoading(`Inaaprubahan na ang account!!!`);

      const approveAcc = await ApprovedOrgFarmerAcc(farmerId);

      handleSetNotification(approveAcc.notifMessage);
      if (approveAcc.refresh) router.refresh();
    } catch (error) {
      const err = error as Error;
      console.log(`Error in approving the farmer account: ${err.message}`);
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <button
      className="button submit-button slimer-button"
      disabled={verificationStatus}
      onClick={handleApproveFarmerAcc}
    >
      {label}
    </button>
  );
};

/**
 * component modal for deleting a user that adopts
 * @param param0
 * @returns
 */
export const DeleteUser: FC<DeleteUserPropType> = ({
  farmerId,
  farmerName,
  modalTitle = "Tatanggalin ang account?",
  proceedButtonLabel = "Mag Patuloy",
  cancelButtonLabel = "Bumalik",
  buttonLabel = "Tanggalin",
  modalMessage = (
    <>
      <p className="p font-bold !text-lg mb-4">
        Burahin ang farmer user na si {farmerName}. Kapag ito ay binura mo, ito
        ay mawawala na ng tuluyan at hindi na maibabalik
      </p>
      <p className="p !text-[17px] tracking-wide">
        Magpatuloy sa pag tatanggal ng account ng mag sasaka?
      </p>
    </>
  ),
}) => {
  const router = useRouter();
  const { handleSetNotification } = useNotification();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleDeleteFarmerUser = async () => {
    try {
      handleIsLoading("Tinatanggal na ang account....");

      const deleteUser = await DelteUserAccount(farmerId);

      handleSetNotification(deleteUser.notifMessage);
      router.refresh();
    } catch (error) {
      const err = error as Error;
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      handleDoneLoading();
      setShowModal(false);
    }
  };
  return (
    <>
      <button
        className="button cancel-button slimer-button"
        onClick={() => setShowModal(true)}
      >
        {buttonLabel}
      </button>

      <button
        className="hidden"
        onClick={handleDeleteFarmerUser}
        ref={submitButtonRef}
      />

      {showModal && (
        <ModalNotice
          type="warning"
          title={modalTitle}
          message={modalMessage}
          onClose={() => setShowModal(false)}
          showCancelButton={true}
          onProceed={() => {
            submitButtonRef.current?.click();
            setShowModal(false);
          }}
          proceed={{
            label: proceedButtonLabel,
          }}
          cancel={{ label: cancelButtonLabel }}
        />
      )}
    </>
  );
};

export const LineChartComponent: FC<LineChartComponentPropType> = ({
  title,
  user,
  data,
}) => {
  const [formatChart, setFormatChart] = useState<"week" | "month" | "year">(
    "week"
  );

  const week = data.week.reduce(
    (acc: barDataStateType, curVal: getReportCountThisWeekReturnType) => ({
      data: [...acc.data, Number(curVal.reportCount)],
      label: [
        ...acc.label,
        curVal.dayOfWeek ===
        new Date().toLocaleDateString("en-US", { weekday: "long" })
          ? "NGAYON"
          : curVal.dayOfWeek,
      ],
    }),
    { data: [], label: [] }
  );

  const month = data.month.reduce(
    (
      acc: barDataStateType,
      curVal: getReportCountThisAndPrevMonthReturnType
    ) => ({
      data: [...acc.data, Number(curVal.reportCount)],
      label: [...acc.label, curVal.weekLabel],
    }),
    { data: [], label: [] }
  );

  const year = data.year.reduce(
    (acc: barDataStateType, curVal: getReportCountThisYearReturnType) => ({
      data: [...acc.data, Number(curVal.reportCount)],
      label: [...acc.label, curVal.month],
    }),
    { data: [], label: [] }
  );

  const [barData, setBarData] = useState<barDataStateType>(week);

  const handleChangChartData = (val: "week" | "month" | "year") => {
    switch (val) {
      case "week":
        setFormatChart("week");
        return setBarData(week);
      case "month":
        setFormatChart("month");
        return setBarData(month);
      case "year":
        setFormatChart("year");
        return setBarData(year);
    }
  };

  const desc = () => {
    if (user === "agriculturist") {
      const word = `All passed report this`;

      switch (formatChart) {
        case "week":
          return `${word} ${formatChart}`;
        case "month":
          return `${word} ${formatChart}`;
        case "year":
          return `${word} ${formatChart}`;
      }
    }

    const word = `Mga nag pasa ng ulat ngayong`;

    switch (formatChart) {
      case "week":
        return `${word} lingo`;
      case "month":
        return `${word} buwan`;
      case "year":
        return `${word} taon`;
    }
  };

  const buttonStyle = `!text-white !bg-green-500 shadow-md`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-semibold">{title}</h1>
          <p className="text-gray-600">{desc()}</p>
        </div>

        <div className="flex justify-center items-center gap-2 [&>button]:text-green-700 [&>button]:bg-green-100 [&>button]:!rounded-lg [&>button]:px-4 [&>button]:py-2 [&>button]:font-semibold">
          <Button
            className={`${formatChart === "week" ? buttonStyle : ""}`}
            onClick={() => handleChangChartData("week")}
          >
            Lingo
          </Button>
          <Button
            className={`${formatChart === "month" ? buttonStyle : ""}`}
            onClick={() => handleChangChartData("month")}
          >
            Buwan
          </Button>
          <Button
            className={`${formatChart === "year" ? buttonStyle : ""}`}
            onClick={() => handleChangChartData("year")}
          >
            Taon
          </Button>
        </div>
      </div>

      <LineChart
        xAxis={[{ scaleType: "point", data: barData.label }]}
        yAxis={[{ min: 0, max: Math.max(...barData.data) + 5 }]}
        margin={{ right: 30, left: 0, bottom: 0 }}
        series={[
          {
            data: barData.data,
            label: "report",
            color: "oklch(72.3% 0.219 149.579)",
          },
        ]}
        height={300}
        grid={{ horizontal: true, vertical: true }}
      />

      <div className="mt-3 flex justify-start items-center gap-1">
        <p className="bg-green-500 rounded-full size-3" />
        <p className="text-gray-500 text-sm">Bilang ng mga ulat</p>
      </div>
    </div>
  );
};
