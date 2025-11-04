"use client";

import {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import {
  ApprovedOrgMemberButtonPropType,
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
  CreateResetPasswordButtonPropType,
  getFarmerDataForResetingPassReturnType,
  ShowIsExpiredPropType,
  ButtonPropType,
  approvedButtonProp,
  deleteMyOrgMemberPropType,
  PieChartCardPropType,
} from "@/types";
import {
  ApprovedFarmerAcc,
  ApprovedOrgMemberAcc,
  UpdateUserProfileInfo,
} from "@/lib/server_action/farmerUser";
import { useLoading } from "./provider/loadingProvider";
import { UpdateUserProfileOrg } from "@/lib/server_action/org";
import {
  Button,
  CancelButton,
  FormCancelSubmitButton,
  FormDivLabelInput,
  FormDivLabelSelect,
  ModalNotice,
  SubmitButton,
} from "../server_component/customComponent";
import {
  DeleteFarmerUser,
  DeleteMyOrgMember,
  getAllFarmerForResetPass,
} from "@/lib/server_action/user";
import { LineChart, PieChart } from "@mui/x-charts";
import {
  baranggayList,
  capitalizeFirstLetter,
  DateToYYMMDD,
  UnexpectedErrorMessageEnglish,
} from "@/util/helper_function/reusableFunction";
import { ChevronDown, Frown, Key, Search, User, X } from "lucide-react";
import { useDebounce } from "./customHook/debounceHook";
import {
  createResetPassWordLink,
  createSignUpLinkForAgri,
  deleteLink,
} from "@/lib/server_action/link";

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
            {capitalizeFirstLetter(brgy)}
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

export const ApprovedOrgMemberButton: FC<ApprovedOrgMemberButtonPropType> = ({
  farmerId,
  verificationStatus,
}) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleApproveFarmerAcc = async () => {
    try {
      handleIsLoading(`Inaaprubahan na ang account!!!`);

      const approveAcc = await ApprovedOrgMemberAcc(farmerId);

      handleSetNotification(approveAcc.notifMessage);
    } catch (error) {
      const err = error as Error;
      console.log(`Nagka problema sa pag aapruba ng account: ${err.message}`);
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
      Aprubahan
    </button>
  );
};

export const ApprovedFarmerButton: FC<approvedButtonProp> = ({ farmerId }) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleApproveFarmerAcc = async () => {
    try {
      handleIsLoading(`Verifying the farmer!!!`);

      const approveAcc = await ApprovedFarmerAcc(farmerId);

      handleSetNotification(approveAcc.notifMessage);
    } catch (error) {
      const err = error as Error;
      console.error(`Error occur while verifying the farmer: ${err.message}`);
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <button
      className="button submit-button slimer-button"
      onClick={handleApproveFarmerAcc}
    >
      Verify
    </button>
  );
};

/**
 * component modal for deleting a user that adopts
 * @param param0
 * @returns
 */
const DeleteUser: FC<DeleteUserPropType> = ({
  isEnglish,
  farmerName,
  deleteOnClick,
}) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <button
        className="button cancel-button slimer-button"
        onClick={() => setShowModal(true)}
      >
        {isEnglish ? "Delete" : "Tanggalin"}
      </button>

      <button
        className="hidden"
        onClick={() => {
          deleteOnClick();
          setShowModal(false);
        }}
        ref={submitButtonRef}
      />

      {showModal && (
        <ModalNotice
          type="warning"
          title={isEnglish ? "Delete the account?" : "Tatanggalin ang account?"}
          message={
            <>
              <p className="p font-bold !text-lg mb-4">
                {isEnglish
                  ? `Delete the farmer user `
                  : `Burahin ang farmer user na si `}
                <span className="italic">{farmerName}</span>
                {isEnglish
                  ? `?. If the user was deleted, it will deleted permanently`
                  : `?. Kapag ito ay binura mo, ito
        ay mawawala na ng tuluyan at hindi na maibabalik`}
              </p>
              <p className="p !text-[17px] tracking-wide">
                {isEnglish
                  ? "Proceed with the deletion of farmer's account?"
                  : "Magpatuloy sa pag tatanggal ng account ng mag sasaka?"}
              </p>
            </>
          }
          onClose={() => setShowModal(false)}
          showCancelButton={true}
          onProceed={() => {
            submitButtonRef.current?.click();
            setShowModal(false);
          }}
          proceed={{
            label: isEnglish ? "Proceed" : "Mag Patuloy",
          }}
          cancel={{ label: isEnglish ? "Back" : "Bumalik" }}
        />
      )}
    </>
  );
};

export const DeleteMyOrgMemberButton: FC<deleteMyOrgMemberPropType> = ({
  farmerId,
  farmerName,
}) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleDeleteFarmerUser = async () => {
    try {
      handleIsLoading("Tinatanggal na ang account....");

      const deleteUser = await DeleteMyOrgMember(farmerId);

      handleSetNotification(deleteUser.notifMessage);
    } catch (error) {
      const err = error as Error;
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <DeleteUser
      farmerName={farmerName}
      isEnglish={false}
      deleteOnClick={handleDeleteFarmerUser}
    />
  );
};

/**
 * button component for agriculturist only
 * @param param0
 * @returns
 */
export const DeleteFarmerButton: FC<deleteMyOrgMemberPropType> = ({
  farmerId,
  farmerName,
}) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleDeleteFarmerUser = async () => {
    try {
      handleIsLoading("Deleting the farmer account....");

      const deleteUser = await DeleteFarmerUser(farmerId);

      handleSetNotification(deleteUser.notifMessage);
    } catch (error) {
      const err = error as Error;
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <DeleteUser
      farmerName={farmerName}
      isEnglish={true}
      deleteOnClick={handleDeleteFarmerUser}
    />
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
    <div className="component">
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

export const CreateResetPasswordButton: FC<
  CreateResetPasswordButtonPropType
> = ({ label = "Create", labelClassName = "", resetStyle = false }) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [openModal, setOpenModal] = useState(false);
  const [searchFarmerVal, setSearchFarmerVal] = useState<string>("");
  const debounceVal = useDebounce(searchFarmerVal, 400);
  const [farmerData, setFarmerData] = useState<
    getFarmerDataForResetingPassReturnType[]
  >([{ farmerId: "", username: "", farmerName: "" }]);

  const closeModal = () => setOpenModal(false);

  const handleCreateResetPassLink = async () => {
    try {
      handleIsLoading("Getting all the user data...");

      const res = await getAllFarmerForResetPass();

      console.log("this works");

      if (res.success) {
        setFarmerData(res.farmerData);
        setOpenModal(true);
      } else handleSetNotification(res.notifError);
    } catch (error) {
      console.error((error as Error).message);

      handleSetNotification([
        { message: UnexpectedErrorMessageEnglish(), type: "error" },
      ]);
    } finally {
      handleDoneLoading();
    }
  };

  const serchFarmer = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchFarmerVal(e.target.value);
  };

  const farmerList = useMemo(() => {
    if (!debounceVal) return farmerData;

    const searchItem = debounceVal.toLowerCase();

    return farmerData?.filter(
      (item) =>
        item.farmerName.toLowerCase().includes(searchItem) ||
        item.username.toLowerCase().includes(searchItem)
    );
  }, [debounceVal, farmerData]);

  const handleCreateLink = async (farmerId: string) => {
    try {
      handleIsLoading("Creating a link for the farmer...");

      handleSetNotification(
        (await createResetPassWordLink(farmerId)).notifMessage
      );
    } catch (error) {
      console.error((error as Error).message);

      handleSetNotification([
        { message: UnexpectedErrorMessageEnglish(), type: "error" },
      ]);
    } finally {
      handleDoneLoading();
      setOpenModal(false);
    }
  };

  return (
    <>
      {resetStyle ? (
        <button
          type="button"
          className="create-link-userPass-agri-button"
          onClick={handleCreateResetPassLink}
        >
          {label}
        </button>
      ) : (
        <SubmitButton type="button" onClick={handleCreateResetPassLink}>
          <span className={labelClassName}>{label}</span>
        </SubmitButton>
      )}

      {openModal && (
        <div className="modal-form">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* header  */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="logo text-green-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Farmer Data
                  </h2>
                  <p className="text-sm text-gray-500">
                    Select a farmer to reset their password
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="p-2 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="logo text-gray-500" />
              </button>
            </div>

            {/* farmer list  */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute top-1/2 left-2 transform -translate-y-1/2 logo text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username or farmer name..."
                  value={searchFarmerVal}
                  onChange={serchFarmer}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Farmer List */}
            <div className={`grid grid-cols-1 gap-4 p-4 overflow-y-scroll`}>
              {farmerList.length > 0 ? (
                farmerList.map((farmer) => (
                  <div
                    key={farmer.farmerId}
                    className="group bg-white border border-gray-300 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {farmer.farmerName.charAt(0)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {farmer.farmerName}
                            </h3>
                          </div>

                          <p className="text-sm text-gray-500 truncate">
                            {farmer.username}
                          </p>
                        </div>
                      </div>

                      <SubmitButton
                        onClick={() => handleCreateLink(farmer.farmerId)}
                        className="slimer-button !gap-1"
                      >
                        <Key className="logo !size-5" />
                        Reset Password
                      </SubmitButton>
                    </div>
                  </div>
                ))
              ) : (
                <div className="div text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <div className="div space-y-3">
                    <Frown className="logo !size-20 stroke-1 table-no-content" />
                    <p className="p text-gray-500 !text-xl">No user found</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="text-gray-600">
                  {farmerData.length} farmers found
                </span>
                <CancelButton onClick={closeModal} className="slimer-button">
                  Close
                </CancelButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const CreateResetPassOrCreateAgriButton = () => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [showOption, setShowOption] = useState<boolean>(false);

  const handleCreateAgriLink = async () => {
    try {
      handleIsLoading("Creating a link for agriculturist user!!!");

      handleSetNotification((await createSignUpLinkForAgri()).notifMessage);
    } catch (error) {
      console.error((error as Error).message);

      handleSetNotification([
        { message: UnexpectedErrorMessageEnglish(), type: "error" },
      ]);
    } finally {
      handleDoneLoading();
      setShowOption(false);
    }
  };

  return (
    <div>
      {showOption && (
        <div
          className="absolute inset-0"
          onClick={() => setShowOption(false)}
        />
      )}

      <div className="relative">
        <SubmitButton
          type="button"
          className="flex justify-between items-center gap-2 !px-4 relative"
          onClick={() => setShowOption(!showOption)}
        >
          <span>Create</span>
          <ChevronDown
            className={`logo transition-transform duration-300 ${
              showOption ? "rotate-180" : ""
            }`}
          />
        </SubmitButton>

        {showOption && (
          <div className="absolute top-full right-0 mt-2 w-full min-w-fit bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              className="create-link-userPass-agri-button"
              onClick={handleCreateAgriLink}
            >
              Create Agriculturist
            </button>

            <CreateResetPasswordButton
              label="Reset Password"
              labelClassName="very-small-text"
              resetStyle={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const ShowIsExpired: FC<ShowIsExpiredPropType> = ({ expiredAt }) => {
  const [status, setStatus] = useState<"Expired" | "Active">("Active");

  useEffect(() => {
    const isExpired = () => {
      if (Date.now() > new Date(expiredAt).getTime()) {
        setStatus("Expired");
        return true;
      }

      setStatus("Active");
      return false;
    };

    if (isExpired()) return;

    const interval = setInterval(() => {
      if (isExpired()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiredAt]);

  return (
    <div className="grid place-items-center">
      <p
        className={`py-1 px-3 rounded-md very-small-text ${
          status === "Expired"
            ? "text-red-900 bg-red-100"
            : "text-green-900 bg-green-100"
        }`}
      >
        {status}
      </p>
    </div>
  );
};

export const CopyTextButton: FC<ButtonPropType & { textToCopy: string }> = ({
  textToCopy,
  children,
  className = "",
  ...buttonProps
}) => {
  const { handleSetNotification } = useNotification();

  const copyLink = () => {
    handleSetNotification([
      { message: "Successfully copied the link", type: "success" },
    ]);
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <button
      className={`button ${className}`}
      {...buttonProps}
      onClick={copyLink}
    >
      {children}
    </button>
  );
};

export const DeleteLinkButton: FC<ButtonPropType & { linkId: string }> = ({
  linkId,
  children,
  className = "",
}) => {
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();

  const handleDeleteLink = async () => {
    try {
      handleIsLoading("Deleting the link!!!");

      handleSetNotification((await deleteLink(linkId)).notifMessage);
    } catch (error) {
      console.error((error as Error).message);

      handleSetNotification([
        { message: UnexpectedErrorMessageEnglish(), type: "error" },
      ]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <button className={`button ${className}`} onClick={handleDeleteLink}>
      {children}
    </button>
  );
};

export const PieChartCard: FC<PieChartCardPropType> = ({ data }) => {
  return (
    <PieChart
      series={[
        {
          data: [...data],
        },
      ]}
      height={100}
    />
  );
};
