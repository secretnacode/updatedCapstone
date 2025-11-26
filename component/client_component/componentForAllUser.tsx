"use client";

import {
  ChangeEvent,
  FC,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
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
  validateReportTablePropType,
  GetOrgMemberReportQueryType,
  allType,
  filteType,
  tableWithFilterPropType,
  sortColByPropType,
  GetFarmerOrgMemberQueryReturnType,
  orgMemberTablePropType,
  reportTypeStateType,
  myReportTablePropType,
  GetUserReportReturnType,
  agriculturistFarmerReporTablePropType,
  GetAllFarmerReportQueryReturnType,
  ViewAllVerifiedFarmerUserQueryReturnType,
  agriculturistFarmerUserTablePropType,
  ViewAllUnvalidatedFarmerQueryReturnQuery,
  agriculturistValidateFarmerTablePropType,
  GetAllOrganizationQueryReturnType,
  agriculturistFarmerOrgTablePropType,
  GetAllOrgMemberListQueryReturnType,
  agriculturistOrgMemberTablePropType,
  dateWithTimeStampPropType,
  changePasswordType,
  BurgerNavPropType,
  TableComponentLoadingPropType,
  optionsDownloadListType,
  reportDownloadType,
  resetPasswordFormPropType,
  resetPasswordType,
  blockUserPropType,
  blockMyOrgMemberButtonPropType,
  deleteFarmerButtonPropType,
} from "@/types";
import {
  ApprovedFarmerAcc,
  ApprovedOrgMemberAcc,
  UpdateUserProfileInfo,
} from "@/lib/server_action/farmerUser";
import { useLoading } from "./provider/loadingProvider";
import { UpdateUserProfileOrg } from "@/lib/server_action/org";
import {
  AuthInputPass,
  Button,
  CancelButton,
  FormCancelSubmitButton,
  FormDivLabelInput,
  FormDivLabelSelect,
  ModalNotice,
  ReportStatus,
  ReportType,
  SubmitButton,
  TableComponent,
} from "../server_component/customComponent";
import {
  changeFarmerPass,
  DeleteFarmerUser,
  DeleteMyOrgMember,
  getAllFarmerForResetPass,
  farmerLogout,
  agriLogout,
  blockMyOrgMember,
  blockFarmerUser,
} from "@/lib/server_action/user";
import { LineChart, PieChart } from "@mui/x-charts";
import {
  accountStatusStyle,
  baranggayList,
  capitalizeFirstLetter,
  DateToYYMMDD,
  handleFarmerNumber,
  NotifToUriComponent,
  ReadableDateFormat,
  reportStatus,
  reportTypeColor,
  timeStampAmPmFormat,
  translateReportType,
  UnexpectedErrorMessage,
  UnexpectedErrorMessageEnglish,
} from "@/util/helper_function/reusableFunction";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  Frown,
  Key,
  List,
  LogOut,
  Menu,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  Sprout,
  User,
  X,
} from "lucide-react";
import { useDebounce } from "./customHook/debounceHook";
import {
  changeNewPass,
  createResetPassWordLink,
  createSignUpLinkForAgri,
  deleteLink,
} from "@/lib/server_action/link";
import { ViewUserReportButton } from "./reportComponent";
import { useFilterSortTable, useSortColumnHandler } from "./customHook";
import {
  DynamicLink,
  FarmerOrgMemberAction,
} from "../server_component/componentForAllUser";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { createPortal } from "react-dom";
import { getToBeDownloadReport } from "@/lib/server_action/report";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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

      <FormDivLabelInput
        labelMessage={"Bilang ng pamilya"}
        inputName={"familyMemberCount"}
        inputType={"text"}
        inputDisable={false}
        inputValue={userInfoState.familyMemberCount}
        formError={formError?.familyMemberCount}
        onChange={handleChangeState}
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
        logo={{ icon: Phone }}
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
        logo={{ icon: CalendarDays }}
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
    setOrgInfo({ orgId: userOrgInfo?.orgId ?? "", otherOrgName: "" });
    handleReset();
  }, [userOrgInfo?.orgId, handleReset]);

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
        selectValue={userOrgInfo?.orgId ?? "none"}
        onChange={handleUserOrgChange}
        selectDisable={false}
        childrenOption={availOrgList.map((org) => (
          <option key={org.orgId} value={org.orgId}>
            {org.orgName.charAt(0).toUpperCase() + org.orgName.slice(1)}
          </option>
        ))}
        formError={formError?.orgId}
      />

      <FormDivLabelInput
        labelMessage="Leader ng Organisasyon"
        inputDisable={true}
        inputName={"leaderName"}
        inputDefaultValue={
          userOrgInfo?.farmerLeader ?? "Wala kang organisasyon"
        }
        inputPlaceholder="Miyembro"
      />

      <div className="col-span-2">
        <FormDivLabelInput
          labelMessage="Posisyon"
          inputDisable={true}
          inputName={"orgRole"}
          inputDefaultValue={userOrgInfo?.orgRole ?? "Wala kang organisasyon"}
          inputPlaceholder="Miyembro"
        />
      </div>

      {otherOrg && (
        <div className="col-span-2">
          <FormDivLabelInput
            labelMessage="Mag lagay ng panibagong organisasyon"
            inputName={"otherOrgName"}
            inputValue={orgInfo.otherOrgName ?? ""}
            inputPlaceholder="e.g. Kataniman"
            onChange={handleUserOrgChange}
            formError={formError?.otherOrgName}
          />
        </div>
      )}

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
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <button
        className="button cancel-button slimer-button"
        onClick={() => setShowModal(true)}
      >
        {isEnglish ? "Delete" : "Tanggalin"}
      </button>

      {showModal &&
        createPortal(
          <ModalNotice
            type="warning"
            title={
              isEnglish ? "Delete the account?" : "Tatanggalin ang account?"
            }
            message={
              <>
                {isEnglish
                  ? `Delete the farmer user `
                  : `Burahin ang farmer user na si `}
                <span className="italic">{farmerName}</span>
                {isEnglish
                  ? `?. If the user was deleted, it will deleted permanently`
                  : `?. Kapag ito ay binura mo, ito
        ay mawawala na ng tuluyan at hindi na maibabalik`}
              </>
            }
            onClose={() => setShowModal(false)}
            showCancelButton={true}
            onProceed={() => {
              deleteOnClick();
              setShowModal(false);
            }}
            proceed={{
              label: isEnglish ? "Proceed" : "Mag Patuloy",
            }}
            cancel={{ label: isEnglish ? "Back" : "Bumalik" }}
          />,
          document.body
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

  const handleDeleteOrgMember = async () => {
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
      deleteOnClick={handleDeleteOrgMember}
    />
  );
};

/**
 * button component for agriculturist only
 * @param param0
 * @returns
 */
export const DeleteFarmerButton: FC<deleteFarmerButtonPropType> = ({
  farmerId,
  farmerName,
  path,
}) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleDeleteFarmerUser = async () => {
    try {
      handleIsLoading("Deleting the farmer account....");

      const deleteUser = await DeleteFarmerUser(farmerId, path);

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

const BlockUser: FC<blockUserPropType> = ({ isEnglish, blockOnClick }) => {
  return (
    <button
      className="slimer-button bg-amber-500 hover:bg-amber-600 text-white text-nowrap"
      onClick={blockOnClick}
    >
      {isEnglish ? "Block" : "I-block"}
    </button>
  );
};

export const BlockMyOrgMemberButton: FC<blockMyOrgMemberButtonPropType> = ({
  farmerId,
}) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleBlockOrgMember = async () => {
    try {
      handleIsLoading("Bino-block na ang account....");

      const deleteUser = await blockMyOrgMember(farmerId);

      handleSetNotification(deleteUser.notifMessage);
    } catch (error) {
      const err = error as Error;
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      handleDoneLoading();
    }
  };

  return <BlockUser isEnglish={false} blockOnClick={handleBlockOrgMember} />;
};

export const BlockFarmerButton: FC<blockMyOrgMemberButtonPropType> = ({
  farmerId,
}) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleDeleteFarmerUser = async () => {
    try {
      handleIsLoading("Blocking the farmer account....");

      const deleteUser = await blockFarmerUser(farmerId);

      handleSetNotification(deleteUser.notifMessage);
    } catch (error) {
      const err = error as Error;
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      handleDoneLoading();
    }
  };

  return <BlockUser isEnglish={true} blockOnClick={handleDeleteFarmerUser} />;
};

const UnblockUser: FC<blockUserPropType> = ({ isEnglish, blockOnClick }) => {
  return (
    <button
      className="slimer-button bg-amber-500 hover:bg-amber-600 text-white text-nowrap"
      onClick={blockOnClick}
    >
      {isEnglish ? "Unblock" : "I-unblock"}
    </button>
  );
};

export const UnblockMyOrgMemberButton: FC<blockMyOrgMemberButtonPropType> = ({
  farmerId,
}) => {
  // const { handleSetNotification } = useNotification();
  // const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleBlockOrgMember = async () => {
    console.log(farmerId);
    // try {
    //   handleIsLoading("Inu-unblock na ang account ng farmer....");
    //   const deleteUser = await blockMyOrgMember(farmerId);
    //   handleSetNotification(deleteUser.notifMessage);
    // } catch (error) {
    //   const err = error as Error;
    //   handleSetNotification([{ message: err.message, type: "error" }]);
    // } finally {
    //   handleDoneLoading();
    // }
  };

  return <UnblockUser isEnglish={false} blockOnClick={handleBlockOrgMember} />;
};

export const UnblockFarmerButton: FC<blockMyOrgMemberButtonPropType> = ({
  farmerId,
}) => {
  // const { handleSetNotification } = useNotification();
  // const { handleIsLoading, handleDoneLoading } = useLoading();

  const handleDeleteFarmerUser = async () => {
    console.log(farmerId);
    // try {
    //   handleIsLoading("Blocking the farmer account....");
    //   const deleteUser = await blockFarmerUser(farmerId);
    //   handleSetNotification(deleteUser.notifMessage);
    // } catch (error) {
    //   const err = error as Error;
    //   handleSetNotification([{ message: err.message, type: "error" }]);
    // } finally {
    //   handleDoneLoading();
    // }
  };

  return <UnblockUser isEnglish={true} blockOnClick={handleDeleteFarmerUser} />;
};

export const LineChartComponent: FC<LineChartComponentPropType> = ({
  title,
  user,
  data,
}) => {
  const [formatChart, setFormatChart] = useState<"week" | "month" | "year">(
    "week"
  );

  const isEnglish = user === "agriculturist";

  const week = data.week.reduce(
    (acc: barDataStateType, curVal: getReportCountThisWeekReturnType) => ({
      data: [...acc.data, Number(curVal.reportCount)],
      label: [
        ...acc.label,
        curVal.dayOfWeek ===
        new Date().toLocaleDateString("en-US", { weekday: "long" })
          ? isEnglish
            ? "TODAY"
            : "NGAYON"
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
          return `${word} and previous ${formatChart}`;
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
            {isEnglish ? "Week" : "Lingo"}
          </Button>
          <Button
            className={`${formatChart === "month" ? buttonStyle : ""}`}
            onClick={() => handleChangChartData("month")}
          >
            {isEnglish ? "Months" : "Buwan"}
          </Button>
          <Button
            className={`${formatChart === "year" ? buttonStyle : ""}`}
            onClick={() => handleChangChartData("year")}
          >
            {isEnglish ? "Year" : "Taon"}
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
            label: isEnglish ? "Report" : "Ulat",
            color: "oklch(72.3% 0.219 149.579)",
          },
        ]}
        height={300}
        grid={{ horizontal: true, vertical: true }}
      />

      <div className="mt-3 flex justify-start items-center gap-1">
        <p className="bg-green-500 rounded-full size-3" />
        <p className="text-gray-500 text-sm">
          {isEnglish ? "Farmer's report count" : "Bilang ng mga ulat"}
        </p>
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
          <span className="flex items-center gap-1">
            <Plus className="size-4 stroke-3" />
            Create
          </span>
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
    <div className="grid place-items-start">
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

export function TableWithFilter<
  T extends Record<string, string | number | Date | boolean>
>({
  obj,
  table,
  additionalFilter,
  sortCol,
  setSortCol,
  setTableList,
}: tableWithFilterPropType<T>) {
  const [searchVal, setSearchVal] = useState<string | null>(null);
  const [filterCol, setFilterCol] = useState<filteType<T>>(null);
  const sortedObj = useFilterSortTable<T>({
    obj,
    sortCol,
    searchVal,
    filterCol,
  });

  // will always update the state in the parent of this component after the sorting of data
  useEffect(() => setTableList(sortedObj), [sortedObj, setTableList]);

  const handleFilterOptionLabel = (data: allType): string => {
    if (data === typeof "number" || data === typeof "boolean")
      return String(data);

    if (data instanceof Date) return ReadableDateFormat(data);

    return String(data);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex gap-2">
          <input
            placeholder="Search products..."
            value={searchVal ?? ""}
            onChange={(e) => setSearchVal(e.target.value)}
            className="flex-1 input"
          />
        </div>

        {additionalFilter &&
          //added this so the "Filter by" can be removed if theres no value to be filtered, can be deleted if cause an error
          additionalFilter?.filterBy[Object.keys(additionalFilter.filterBy)[0]]!
            .length > 0 && (
            <div className="flex gap-2 flex-wrap items-center w-full">
              <span className="text-xs font-medium text-muted-foreground text-nowrap inline-block">
                Filter by:
              </span>

              <div className={`flex flex-wrap gap-2 items-center flex-1`}>
                {Object.keys(additionalFilter.filterBy).map((col, colIndex) =>
                  additionalFilter.filterBy[col]!.map((option, optIndex) => (
                    <div key={`${option}-${optIndex}`} className="flex">
                      <button
                        onClick={() =>
                          setFilterCol(
                            filterCol?.val === option
                              ? null
                              : { col: col, val: option }
                          )
                        }
                        className={`px-3 py-1 rounded-full very-very-small-text font-medium transition-colors my-1 capitalize cursor-pointer ${
                          filterCol?.val === option
                            ? "bg-green-500 text-white"
                            : "bg-green-50/50 text-foreground hover:bg-green-100/70 ring ring-gray-500"
                        }`}
                      >
                        {additionalFilter.handleFilterLabel[col]!(
                          handleFilterOptionLabel(option)
                        )}
                      </button>

                      {Object.keys(additionalFilter.filterBy).length >
                        colIndex + 1 &&
                        optIndex ===
                          additionalFilter.filterBy[col]!.length - 1 && (
                          <div className="ml-2 border-l" />
                        )}
                    </div>
                  ))
                )}

                {(searchVal || filterCol || sortCol) && (
                  <Button
                    onClick={() => {
                      setSearchVal("");
                      setFilterCol(null);
                      setSortCol(null);
                    }}
                    className="ml-auto slimer-button ring very-small-text ring-gray-500 text-red-500 scale-105 hover:!text-black hover:!ring-0 hover:bg-red-100"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          )}
      </div>

      {table}
    </div>
  );
}

export const SortColBy = <T,>({ col, sortCol }: sortColByPropType<T>) => (
  <span className="inline-block [&>svg]:w-4 [&>svg]:h-4">
    {sortCol?.column === col ? (
      sortCol.sortType === "asc" ? (
        <ChevronUp className="logo text-gray-500" />
      ) : (
        <ChevronDown className="logo text-gray-500" />
      )
    ) : (
      <Minus className="logo text-gray-500" />
    )}
  </span>
);

export const ValidateReportTable: FC<validateReportTablePropType> = ({
  memberReport,
}) => {
  const { sortCol, setSortCol, handleSortCol } =
    useSortColumnHandler<GetOrgMemberReportQueryType>();
  const [tableList, setTableList] =
    useState<GetOrgMemberReportQueryType[]>(memberReport);

  const SortType: FC<{ col: keyof GetOrgMemberReportQueryType }> = ({
    col,
  }) => <SortColBy<GetOrgMemberReportQueryType> sortCol={sortCol} col={col} />;

  return (
    <TableWithFilter<GetOrgMemberReportQueryType>
      setTableList={setTableList}
      sortCol={sortCol}
      setSortCol={setSortCol}
      obj={memberReport}
      additionalFilter={{
        filterBy: {
          reportType: Array.from(
            new Set(memberReport.map((val) => val.reportType))
          ),
          verificationStatus: Array.from(
            new Set(memberReport.map((val) => val.verificationStatus))
          ),
        },
        handleFilterLabel: {
          reportType: (val: string) => {
            const forceType = val as reportTypeStateType;

            return translateReportType({ type: forceType, isEnglish: false });
          },

          verificationStatus: (label) =>
            reportStatus({ val: label === "true" }),
        },
      }}
      table={
        <TableComponent
          noContentMessage="Ang mga miyembro ng iyong organisasyon ay wala pang pinapasang ulat"
          listCount={memberReport.length}
          tableHeaderCell={
            <>
              <th scope="col" className="!w-[12%]">
                <div
                  onClick={() => handleSortCol("farmerFirstName")}
                  className="cursor-pointer"
                >
                  <p>Unang pangalan</p>

                  <SortType col={"farmerFirstName"} />
                </div>
              </th>

              <th scope="col" className="!w-[12%]">
                <div
                  onClick={() => handleSortCol("farmerLastName")}
                  className="cursor-pointer"
                >
                  <p>Apelyido</p>

                  <SortType col={"farmerLastName"} />
                </div>
              </th>

              <th scope="col" className="!w-[12%]">
                <div
                  onClick={() => handleSortCol("farmerAlias")}
                  className="cursor-pointer"
                >
                  <p>Alyas</p>

                  <SortType col={"farmerAlias"} />
                </div>
              </th>

              <th scope="col" className="!w-[12%]">
                <div
                  onClick={() => handleSortCol("title")}
                  className="cursor-pointer"
                >
                  <p>Pamagat ng ulat</p>

                  <SortType col={"title"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("dayReported")}
                  className="cursor-pointer"
                >
                  <p>Araw Ipinasa</p>

                  <SortType col={"dayReported"} />
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Uri ng ulat</p>
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Estado ng ulat</p>
                </div>
              </th>

              <th scope="col" className="!w-[16.5%]">
                <div>
                  <p>Aksyon</p>
                </div>
              </th>
            </>
          }
          tableCell={
            <>
              {tableList.map((report) => (
                <tr key={report.reportId}>
                  <td className=" text-gray-900 font-medium">
                    <div>
                      <p>{report.farmerFirstName}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{report.farmerLastName}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{report.farmerAlias}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{report.title}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{ReadableDateFormat(new Date(report.dayReported))}</p>
                    </div>
                  </td>

                  <td>
                    <div>
                      <p>
                        <ReportType type={report.reportType} />
                      </p>
                    </div>
                  </td>

                  <td>
                    <div>
                      <p>
                        <ReportStatus
                          verificationStatus={report.verificationStatus}
                        />
                      </p>
                    </div>
                  </td>

                  <td>
                    <div>
                      <ViewUserReportButton
                        reportId={report.reportId}
                        farmerName={
                          report.farmerFirstName + " " + report.farmerLastName
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </>
          }
        />
      }
    />
  );
};

export const OrgMemberTable: FC<orgMemberTablePropType> = ({ orgMember }) => {
  const { sortCol, setSortCol, handleSortCol } =
    useSortColumnHandler<GetFarmerOrgMemberQueryReturnType>();
  const [tableList, setTableList] =
    useState<GetFarmerOrgMemberQueryReturnType[]>(orgMember);

  const SortType: FC<{ col: keyof GetFarmerOrgMemberQueryReturnType }> = ({
    col,
  }) => (
    <SortColBy<GetFarmerOrgMemberQueryReturnType> sortCol={sortCol} col={col} />
  );

  return (
    <TableWithFilter<GetFarmerOrgMemberQueryReturnType>
      setTableList={setTableList}
      sortCol={sortCol}
      setSortCol={setSortCol}
      obj={orgMember}
      additionalFilter={{
        filterBy: {
          verified: Array.from(new Set(orgMember.map((val) => val.verified))),
          cropNum: Array.from(new Set(orgMember.map((val) => val.cropNum))),
        },
        handleFilterLabel: {
          verified: (val) => (val === "true" ? "Kumpirmahin" : "Kumpirmado"),
          cropNum: (val) => `pananim ${val}`,
        },
      }}
      table={
        <TableComponent
          noContentMessage="Wala ka pang miyembro sa iyong organisasyon"
          listCount={orgMember.length}
          tableHeaderCell={
            <>
              <th scope="col" className="!w-[17%]">
                <div
                  onClick={() => handleSortCol("farmerName")}
                  className="cursor-pointer w-[75%]"
                >
                  <p>Pangalan ng magsasaka</p>

                  <SortType col={"farmerName"} />
                </div>
              </th>

              <th scope="col" className="!w-[12%]">
                <div
                  onClick={() => handleSortCol("farmerAlias")}
                  className="cursor-pointer"
                >
                  <p>Alyas ng magsasaka</p>

                  <SortType col={"farmerAlias"} />
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Numero ng telepono</p>
                </div>
              </th>

              <th scope="col" className="!w-[13%]">
                <div
                  onClick={() => handleSortCol("barangay")}
                  className="cursor-pointer"
                >
                  <p>Baranggay na tinitirhan</p>

                  <SortType col={"barangay"} />
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Estado ng account</p>
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("cropNum")}
                  className="cursor-pointer"
                >
                  <p>Bilang ng pananim</p>

                  <SortType col={"cropNum"} />
                </div>
              </th>

              <th scope="col" className="!w-[25.5%]">
                <div>
                  <p>Aksyon</p>
                </div>
              </th>
            </>
          }
          tableCell={
            <>
              {tableList.map((member) => (
                <tr
                  key={member.farmerId}
                  className={`${
                    member.status === "delete"
                      ? "bg-red-50 hover:!bg-red-100/50"
                      : member.status === "block"
                      ? "bg-amber-50 hover:!bg-amber-100/50"
                      : ""
                  }`}
                >
                  <td className=" text-gray-900 font-medium">
                    <div>
                      <p
                        className={`${
                          member.status === "delete" &&
                          "line-through !text-gray-400"
                        }`}
                      >
                        {member.farmerName}
                      </p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p
                        className={`${
                          member.status === "delete" &&
                          "line-through !text-gray-400"
                        }`}
                      >
                        {member.farmerAlias}
                      </p>
                    </div>
                  </td>

                  <td className=" text-gray-900 font-medium">
                    <div>
                      <p>{handleFarmerNumber(member.mobileNumber)}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{member.barangay}</p>
                    </div>
                  </td>

                  <td>
                    <div>
                      <p
                        className={`table-verify-cell ${
                          member.verified
                            ? "table-verified"
                            : "table-unverified"
                        }`}
                      >
                        {!member.verified ? "Kumpirmahin" : "Kumpirmado"}
                      </p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{member.cropNum}</p>
                    </div>
                  </td>

                  <td className="text-center">
                    <FarmerOrgMemberAction
                      farmerId={member.farmerId}
                      verificationStatus={member.verified}
                      status={member.status}
                      farmerName={member.farmerName}
                    />
                  </td>
                </tr>
              ))}
            </>
          }
        />
      }
    />
  );
};

export const MyReportTable: FC<myReportTablePropType> = ({ report, work }) => {
  const { sortCol, setSortCol, handleSortCol } =
    useSortColumnHandler<GetUserReportReturnType>();
  const [tableList, setTableList] = useState<GetUserReportReturnType[]>(report);

  const SortType: FC<{ col: keyof GetUserReportReturnType }> = ({ col }) => (
    <SortColBy<GetUserReportReturnType> sortCol={sortCol} col={col} />
  );

  const leaderFilter = () => {
    if (work === "leader")
      return {
        filterBy: {
          reportType: Array.from(new Set(report.map((val) => val.reportType))),
        },
        handleFilterLabel: {
          reportType: (val: string) => {
            const forceType = val as reportTypeStateType;

            return translateReportType({ type: forceType, isEnglish: false });
          },
        },
      };

    return {
      filterBy: {
        reportType: Array.from(new Set(report.map((val) => val.reportType))),
        verificationStatus: Array.from(
          new Set(report.map((val) => val.verificationStatus))
        ),
      },
      handleFilterLabel: {
        reportType: (val: string) => {
          const forceType = val as reportTypeStateType;

          return translateReportType({ type: forceType, isEnglish: false });
        },

        verificationStatus: (label: string) =>
          reportStatus({ val: label === "true" }),
      },
    };
  };

  return (
    <TableWithFilter<GetUserReportReturnType>
      setTableList={setTableList}
      sortCol={sortCol}
      setSortCol={setSortCol}
      obj={report}
      additionalFilter={{ ...leaderFilter() }}
      table={
        <TableComponent
          noContentMessage="Wala ka pang naisusumiteng ulat. Mag sagawa ng panibagong ulat."
          listCount={report.length}
          tableHeaderCell={
            <>
              <th scope="col">
                <div
                  onClick={() => handleSortCol("title")}
                  className="cursor-pointer"
                >
                  <p>Pamagat ng ulat</p>

                  <SortType col={"title"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("cropName")}
                  className="cursor-pointer"
                >
                  <p>Pangalan ng pananim</p>

                  <SortType col={"cropName"} />
                </div>
              </th>

              {work === "leader" ? null : (
                <th scope="col">
                  <div className="cursor-pointer">
                    <p>Estado ng ulat</p>
                  </div>
                </th>
              )}

              <th scope="col">
                <div
                  onClick={() => handleSortCol("dayReported")}
                  className="cursor-pointer"
                >
                  <p>Araw na ipinasa</p>

                  <SortType col={"dayReported"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("dayHappen")}
                  className="cursor-pointer"
                >
                  <p>Araw na naganap</p>

                  <SortType col={"dayHappen"} />
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Uri ng ulat</p>
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Aksyon</p>
                </div>
              </th>
            </>
          }
          tableCell={
            <>
              {tableList.map((report) => (
                <tr key={report.reportId}>
                  <td className=" text-gray-900 font-medium">
                    <div>
                      <p>{report.title}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{report.cropName}</p>
                    </div>
                  </td>

                  {work === "leader" ? null : (
                    <td>
                      <div>
                        <p
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.verificationStatus
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.verificationStatus
                            ? "Naipasa"
                            : "kinukumpirma"}
                        </p>
                      </div>
                    </td>
                  )}

                  <td className="text-gray-500">
                    <div>
                      <p>{ReadableDateFormat(new Date(report.dayReported))}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{ReadableDateFormat(new Date(report.dayHappen))}</p>
                    </div>
                  </td>

                  <td scope="col">
                    <div>
                      <p>
                        <ReportType type={report.reportType} />
                      </p>
                    </div>
                  </td>

                  <td className="text-center">
                    <div>
                      <ViewUserReportButton
                        reportId={report.reportId}
                        myReport={true}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </>
          }
        />
      }
    />
  );
};

export const AgriculturistFarmerReporTable: FC<
  agriculturistFarmerReporTablePropType
> = ({ report }) => {
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();
  const [openOpt, setOpenOpt] = useState<boolean>(false);
  const { sortCol, setSortCol, handleSortCol } =
    useSortColumnHandler<GetAllFarmerReportQueryReturnType>();
  const [tableList, setTableList] =
    useState<GetAllFarmerReportQueryReturnType[]>(report);

  const SortType: FC<{ col: keyof GetAllFarmerReportQueryReturnType }> = ({
    col,
  }) => (
    <SortColBy<GetAllFarmerReportQueryReturnType> sortCol={sortCol} col={col} />
  );

  const options: optionsDownloadListType = [
    {
      id: "planting",
      label: "Planting",
      icon: Sprout,
      color: "text-green-600",
      bgHover: "hover:bg-green-50",
    },
    {
      id: "damage",
      label: "Damage",
      icon: AlertTriangle,
      color: "text-red-600",
      bgHover: "hover:bg-red-50",
    },
    {
      id: "harvesting",
      label: "Harvest",
      icon: Package,
      color: "text-amber-600",
      bgHover: "hover:bg-amber-50",
    },
    {
      id: "all",
      label: "All",
      icon: List,
      color: "text-blue-600",
      bgHover: "hover:bg-blue-50",
    },
  ];

  const downloadReports = async (type: reportDownloadType) => {
    try {
      handleIsLoading("Downloading the report...");

      const res = await getToBeDownloadReport(type);

      if (!res.success) return handleSetNotification(res.notifError);

      const blob = new Blob([res.csvType], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = `${type}-report-type-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();

      window.URL.revokeObjectURL(url);

      setOpenOpt(false);

      return handleSetNotification([
        {
          message: `Successfully downloaded the ${
            type !== "all" ? type : ""
          } report`,
          type: "success",
        },
      ]);
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
    <div className="component space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="table-title">Farmer Reports</h1>

        {openOpt && (
          <div className="absolute inset-0" onClick={() => setOpenOpt(false)} />
        )}

        <div className="relative">
          <Button
            className="blue-button text-white"
            onClick={() => setOpenOpt(!openOpt)}
          >
            <Download className="size-5" />
            Download reports
          </Button>

          {openOpt && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10 animate-fadeIn">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => downloadReports(option.id)}
                    className={`w-full px-6 py-3 flex items-center gap-3 transition-colors ${option.bgHover} border-b border-gray-100 last:border-b-0`}
                  >
                    <Icon size={20} className={option.color} />
                    <span className="font-medium text-gray-700">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <TableWithFilter<GetAllFarmerReportQueryReturnType>
        setTableList={setTableList}
        sortCol={sortCol}
        setSortCol={setSortCol}
        obj={report}
        additionalFilter={{
          filterBy: {
            verificationStatus: Array.from(
              new Set(report.map((val) => val.verificationStatus))
            ),
            reportType: Array.from(
              new Set(report.map((val) => val.reportType))
            ),
          },

          handleFilterLabel: {
            verificationStatus: (val) =>
              val === "true" ? "Verified" : "Not Verified",
            reportType: (val) => capitalizeFirstLetter(val),
          },
        }}
        table={
          <TableComponent
            noContentMessage="Wala ka pang naisusumiteng ulat. Mag sagawa ng panibagong ulat."
            listCount={report.length}
            tableHeaderCell={
              <>
                <th scope="col">
                  <div
                    onClick={() => handleSortCol("farmerName")}
                    className="cursor-pointer"
                  >
                    <p>Farmer Name</p>
                    <SortType col={"farmerName"} />
                  </div>
                </th>

                <th scope="col">
                  <div
                    onClick={() => handleSortCol("cropLocation")}
                    className="cursor-pointer"
                  >
                    <p className="w-2/3">Crop location</p>
                    <SortType col={"cropLocation"} />
                  </div>
                </th>

                <th scope="col">
                  <div
                    onClick={() => handleSortCol("orgName")}
                    className="cursor-pointer "
                  >
                    <p>Organization Name</p>
                    <SortType col={"orgName"} />
                  </div>
                </th>

                <th scope="col">
                  <div
                    onClick={() => handleSortCol("dayReported")}
                    className="cursor-pointer"
                  >
                    <p>
                      <p>Date was passed</p>
                    </p>

                    <SortType col={"dayReported"} />
                  </div>
                </th>

                <th scope="col">
                  <div>
                    <p>Verified</p>
                  </div>
                </th>

                <th scope="col">
                  <div>
                    <p>Report Type</p>
                  </div>
                </th>

                <th scope="col">
                  <div>
                    <p>Action</p>
                  </div>
                </th>
              </>
            }
            tableCell={
              <>
                {tableList.map((report) => (
                  <tr key={report.reportId}>
                    <td className=" text-gray-900 font-medium ">
                      <div>
                        <p>{report.farmerName}</p>
                      </div>
                    </td>

                    <td className="text-gray-500">
                      <div>
                        <p>{report.cropLocation}</p>
                      </div>
                    </td>

                    <td className="text-gray-500">
                      <div>
                        <p>
                          {report.orgName ? report.orgName : "No organization"}
                        </p>
                      </div>
                    </td>

                    <td className="text-gray-500">
                      <div>
                        <p>
                          {ReadableDateFormat(new Date(report.dayReported))}
                        </p>
                      </div>
                    </td>

                    <td>
                      <div>
                        <p
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-center tracking-wider ${
                            report.verificationStatus
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.verificationStatus
                            ? "Verified"
                            : "Not verified"}
                        </p>
                      </div>
                    </td>

                    <td className="text-gray-500">
                      <div>
                        <p
                          className={`${reportTypeColor(
                            report.reportType
                          )} text-xs py-1 px-3 rounded-2xl tracking-wider`}
                        >
                          {capitalizeFirstLetter(report.reportType)}
                        </p>
                      </div>
                    </td>

                    <td className="text-center">
                      <div className="flex flex-row justify-center items-center gap-2">
                        <ViewUserReportButton
                          farmerName={report.farmerName}
                          reportId={report.reportId}
                          className="slimer-button"
                          label="View Report"
                        />

                        <DynamicLink
                          baseLink="farmerUser"
                          dynamicId={report.farmerId}
                          label="Profile"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            }
          />
        }
      />
    </div>
  );
};

export const AgriculturistFarmerUserTable: FC<
  agriculturistFarmerUserTablePropType
> = ({ farmer }) => {
  const { sortCol, setSortCol, handleSortCol } =
    useSortColumnHandler<ViewAllVerifiedFarmerUserQueryReturnType>();
  const [tableList, setTableList] =
    useState<ViewAllVerifiedFarmerUserQueryReturnType[]>(farmer);

  const SortType: FC<{
    col: keyof ViewAllVerifiedFarmerUserQueryReturnType;
  }> = ({ col }) => (
    <SortColBy<ViewAllVerifiedFarmerUserQueryReturnType>
      sortCol={sortCol}
      col={col}
    />
  );

  return (
    <>
      <TableWithFilter<ViewAllVerifiedFarmerUserQueryReturnType>
        setTableList={setTableList}
        sortCol={sortCol}
        setSortCol={setSortCol}
        obj={farmer}
        additionalFilter={{
          filterBy: {
            orgRole: Array.from(new Set(farmer.map((val) => val.orgRole))),
            orgName: Array.from(
              new Set(farmer.map((val) => val.orgName).filter((val) => val))
            ),
            status: Array.from(new Set(farmer.map((val) => val.status))),
          },

          handleFilterLabel: {
            orgRole: (val) =>
              val !== "null" ? capitalizeFirstLetter(val) : "No Org",
            orgName: (val) => capitalizeFirstLetter(val),
            status: (val) => capitalizeFirstLetter(val),
          },
        }}
        table={
          <TableComponent
            noContentMessage="Wala ka pang naisusumiteng ulat. Mag sagawa ng panibagong ulat."
            listCount={farmer.length}
            tableHeaderCell={
              <>
                <th scope="col">
                  <div
                    onClick={() => handleSortCol("farmerName")}
                    className="cursor-pointer"
                  >
                    <p>Farmer Name</p>
                    <SortType col={"farmerName"} />
                  </div>
                </th>

                <th scope="col">
                  <div
                    onClick={() => handleSortCol("farmerAlias")}
                    className="cursor-pointer"
                  >
                    <p className="w-2/3">Alias</p>
                    <SortType col={"farmerAlias"} />
                  </div>
                </th>

                <th scope="col">
                  <div
                    onClick={() => handleSortCol("farmerAlias")}
                    className="cursor-pointer"
                  >
                    <p>Created At</p>
                    <SortType col={"farmerAlias"} />
                  </div>
                </th>

                <th scope="col">
                  <div
                    onClick={() => handleSortCol("orgName")}
                    className="cursor-pointer "
                  >
                    <p>Organization Name</p>
                    <SortType col={"orgName"} />
                  </div>
                </th>

                <th scope="col">
                  <div
                    onClick={() => handleSortCol("orgRole")}
                    className="cursor-pointer "
                  >
                    <p>Organization Role</p>
                    <SortType col={"orgRole"} />
                  </div>
                </th>

                <th scope="col">
                  <div>
                    <p>Account status</p>
                  </div>
                </th>

                <th scope="col">
                  <div>
                    <p>Action</p>
                  </div>
                </th>
              </>
            }
            tableCell={
              <>
                {tableList.map((farmer) => {
                  const style = accountStatusStyle(farmer.status);

                  return (
                    <tr
                      key={farmer.farmerId}
                      className={`${
                        farmer.status === "delete"
                          ? "bg-red-50 hover:!bg-red-100/50"
                          : farmer.status === "block"
                          ? "bg-amber-50 hover:!bg-amber-100/50"
                          : ""
                      }`}
                    >
                      <td className=" text-gray-900 font-medium ">
                        <div>
                          <p
                            className={`${
                              farmer.status === "delete" &&
                              "line-through !text-gray-400"
                            }`}
                          >
                            {farmer.farmerName}
                          </p>
                        </div>
                      </td>

                      <td className="text-gray-500">
                        <div>
                          <p>{farmer.farmerAlias}</p>
                        </div>
                      </td>

                      <td>
                        <div>
                          <p>{ReadableDateFormat(farmer.dateCreated)}</p>
                        </div>
                      </td>

                      <td className="text-gray-500">
                        <div>
                          <p>
                            {farmer.orgName
                              ? farmer.orgName
                              : "No organization"}
                          </p>
                        </div>
                      </td>

                      <td className="text-gray-500">
                        <div>
                          <p>
                            {capitalizeFirstLetter(
                              farmer.orgRole ?? "No organization"
                            )}
                          </p>
                        </div>
                      </td>

                      <td className="text-gray-500">
                        <div>
                          <p
                            className={`${style} rounded-2xl px-3 py-1 text-xs tracking-wider`}
                          >
                            {capitalizeFirstLetter(farmer.status)}
                          </p>
                        </div>
                      </td>

                      <td>
                        <div className="flex flex-row justify-center items-center gap-2">
                          <DynamicLink
                            baseLink="farmerUser"
                            dynamicId={farmer.farmerId}
                            label="Profile"
                            className="!bg-green-500 hover:!bg-green-600"
                          />

                          {farmer.status !== "delete" && (
                            <>
                              {farmer.status === "block" ? (
                                <UnblockFarmerButton
                                  farmerId={farmer.farmerId}
                                />
                              ) : (
                                <BlockFarmerButton farmerId={farmer.farmerId} />
                              )}

                              <DeleteFarmerButton
                                farmerId={farmer.farmerId}
                                farmerName={farmer.farmerName}
                                path="/agriculturist/farmerUsers"
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            }
          />
        }
      />
    </>
  );
};

export const AgriculturistValidateFarmerTable: FC<
  agriculturistValidateFarmerTablePropType
> = ({ farmer }) => {
  const { sortCol, setSortCol, handleSortCol } =
    useSortColumnHandler<ViewAllUnvalidatedFarmerQueryReturnQuery>();
  const [tableList, setTableList] =
    useState<ViewAllUnvalidatedFarmerQueryReturnQuery[]>(farmer);

  const SortType: FC<{
    col: keyof ViewAllUnvalidatedFarmerQueryReturnQuery;
  }> = ({ col }) => (
    <SortColBy<ViewAllUnvalidatedFarmerQueryReturnQuery>
      sortCol={sortCol}
      col={col}
    />
  );

  return (
    <TableWithFilter<ViewAllUnvalidatedFarmerQueryReturnQuery>
      setTableList={setTableList}
      sortCol={sortCol}
      setSortCol={setSortCol}
      obj={farmer}
      additionalFilter={{
        filterBy: {
          orgRole: Array.from(
            new Set(
              farmer.map((val) => val.orgRole).filter((val) => val !== null)
            )
          ),
          orgName: Array.from(
            new Set(
              farmer.map((val) => val.orgName).filter((val) => val !== null)
            )
          ),
        },

        handleFilterLabel: {
          orgRole: (val) => capitalizeFirstLetter(val),
          orgName: (val) => capitalizeFirstLetter(val),
        },
      }}
      table={
        <TableComponent
          noContentMessage="Wala ka pang naisusumiteng ulat. Mag sagawa ng panibagong ulat."
          listCount={farmer.length}
          tableHeaderCell={
            <>
              <th scope="col">
                <div
                  onClick={() => handleSortCol("farmerName")}
                  className="cursor-pointer"
                >
                  <p>Farmer Name</p>
                  <SortType col={"farmerName"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("farmerAlias")}
                  className="cursor-pointer"
                >
                  <p className="w-2/3">Alias</p>
                  <SortType col={"farmerAlias"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("farmerAlias")}
                  className="cursor-pointer"
                >
                  <p>Created At</p>
                  <SortType col={"farmerAlias"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("orgName")}
                  className="cursor-pointer "
                >
                  <p>Organization name</p>
                  <SortType col={"orgName"} />
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Organization Role</p>
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Action</p>
                </div>
              </th>
            </>
          }
          tableCell={
            <>
              {tableList.map((farmer) => (
                <tr key={farmer.farmerId}>
                  <td className=" text-gray-900 font-medium ">
                    <div>
                      <p>{farmer.farmerName}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{farmer.farmerAlias}</p>
                    </div>
                  </td>

                  <td>
                    <div>
                      <p>{ReadableDateFormat(farmer.dateCreated)}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{farmer.orgName ?? "No organization"}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>
                        {capitalizeFirstLetter(
                          farmer.orgRole ?? "No organization"
                        )}
                      </p>
                    </div>
                  </td>

                  <td className="text-center">
                    <div className="table-action">
                      <DynamicLink
                        baseLink="farmerUser"
                        dynamicId={farmer.farmerId}
                        label="Profile"
                      />

                      <ApprovedFarmerButton farmerId={farmer.farmerId} />

                      {/* Baguhin yung logic nito kung saan tatanggalin tlga yung information din sa farmer table kase wala pa nn napapasa yung user na report kaya d kelanag ng soft deletion */}
                      <DeleteFarmerButton
                        farmerId={farmer.farmerId}
                        farmerName={farmer.farmerName}
                        path="/agriculturist/validateFarmer"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </>
          }
        />
      }
    />
  );
};

export const AgriculturistFarmerOrgTable: FC<
  agriculturistFarmerOrgTablePropType
> = ({ orgVal }) => {
  const { sortCol, setSortCol, handleSortCol } =
    useSortColumnHandler<GetAllOrganizationQueryReturnType>();
  const [tableList, setTableList] =
    useState<GetAllOrganizationQueryReturnType[]>(orgVal);

  const SortType: FC<{
    col: keyof GetAllOrganizationQueryReturnType;
  }> = ({ col }) => (
    <SortColBy<GetAllOrganizationQueryReturnType> sortCol={sortCol} col={col} />
  );

  return (
    <TableWithFilter<GetAllOrganizationQueryReturnType>
      setTableList={setTableList}
      sortCol={sortCol}
      setSortCol={setSortCol}
      obj={orgVal}
      additionalFilter={{
        filterBy: {
          orgName: Array.from(
            new Set(
              orgVal.map((val) => val.orgName).filter((val) => val !== null)
            )
          ),
        },

        handleFilterLabel: {
          orgName: (val) => capitalizeFirstLetter(val),
        },
      }}
      table={
        <TableComponent
          noContentMessage="Wala ka pang naisusumiteng ulat. Mag sagawa ng panibagong ulat."
          listCount={orgVal.length}
          tableHeaderCell={
            <>
              <th scope="col">
                <div
                  onClick={() => handleSortCol("farmerLeaderName")}
                  className="cursor-pointer"
                >
                  <p>Farmer Name</p>
                  <SortType col={"farmerLeaderName"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("farmerLeaderAlias")}
                  className="cursor-pointer"
                >
                  <p className="w-2/3">Alias</p>
                  <SortType col={"farmerLeaderAlias"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("orgName")}
                  className="cursor-pointer "
                >
                  <p>Organization Name</p>
                  <SortType col={"orgName"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("totalMember")}
                  className="cursor-pointer "
                >
                  <p>Total Member</p>
                  <SortType col={"totalMember"} />
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Action</p>
                </div>
              </th>
            </>
          }
          tableCell={
            <>
              {tableList.map((orgVal) => (
                <tr key={orgVal.farmerId}>
                  <td className=" text-gray-900 font-medium ">
                    <div>
                      <p>{orgVal.farmerLeaderName}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{orgVal.farmerLeaderAlias}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{orgVal.orgName ?? "No organization"}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{orgVal.totalMember}</p>
                    </div>
                  </td>

                  <td className="text-center">
                    <div className="table-action">
                      <DynamicLink
                        baseLink="farmerUser"
                        dynamicId={orgVal.farmerId}
                        label="View Leader"
                      />
                      <DynamicLink
                        baseLink="agriculturist/organizations"
                        dynamicId={orgVal.orgId}
                        label="View Org"
                        className="submit-button"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </>
          }
        />
      }
    />
  );
};

export const AgriculturistOrgMemberTable: FC<
  agriculturistOrgMemberTablePropType
> = ({ orgMem }) => {
  const { sortCol, setSortCol, handleSortCol } =
    useSortColumnHandler<GetAllOrgMemberListQueryReturnType>();
  const [tableList, setTableList] =
    useState<GetAllOrgMemberListQueryReturnType[]>(orgMem);

  const SortType: FC<{
    col: keyof GetAllOrgMemberListQueryReturnType;
  }> = ({ col }) => (
    <SortColBy<GetAllOrgMemberListQueryReturnType>
      sortCol={sortCol}
      col={col}
    />
  );

  return (
    <TableWithFilter<GetAllOrgMemberListQueryReturnType>
      setTableList={setTableList}
      sortCol={sortCol}
      setSortCol={setSortCol}
      obj={orgMem}
      additionalFilter={{
        filterBy: {
          orgRole: Array.from(new Set(orgMem.map((val) => val.orgRole))),
          verified: Array.from(new Set(orgMem.map((val) => val.verified))),
        },

        handleFilterLabel: {
          orgRole: (val) => capitalizeFirstLetter(val),
          verified: (val) => (val === "true" ? "Verified" : "Unverified"),
        },
      }}
      table={
        <TableComponent
          noContentMessage="Wala ka pang naisusumiteng ulat. Mag sagawa ng panibagong ulat."
          listCount={orgMem.length}
          tableHeaderCell={
            <>
              <th scope="col" className="!w-[17%]">
                <div
                  onClick={() => handleSortCol("farmerName")}
                  className="cursor-pointer"
                >
                  <p>Farmer Name</p>
                  <SortType col={"farmerName"} />
                </div>
              </th>

              <th scope="col" className="!w-[12%]">
                <div
                  onClick={() => handleSortCol("farmerAlias")}
                  className="cursor-pointer"
                >
                  <p className="w-2/3">Alias</p>
                  <SortType col={"farmerAlias"} />
                </div>
              </th>

              <th scope="col">
                <div
                  onClick={() => handleSortCol("barangay")}
                  className="cursor-pointer "
                >
                  <p>Baranggay</p>
                  <SortType col={"barangay"} />
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Organization Role</p>
                </div>
              </th>

              <th scope="col">
                <div>
                  <p>Verification Status</p>
                </div>
              </th>

              <th scope="col" className="!w-[11%]">
                <div>
                  <p>Action</p>
                </div>
              </th>
            </>
          }
          tableCell={
            <>
              {tableList.map((member) => (
                <tr key={member.farmerId}>
                  <td className=" text-gray-900 font-medium ">
                    <div>
                      <p>{member.farmerName}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{member.farmerAlias}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{member.barangay}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p>{member.orgRole}</p>
                    </div>
                  </td>

                  <td className="text-gray-500">
                    <div>
                      <p
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-center tracking-wider ${
                          member.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {member.verified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                  </td>

                  <td className="text-center">
                    <div className="table-action">
                      <DynamicLink
                        baseLink="farmerUser"
                        dynamicId={member.farmerId}
                        label="View Profile"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </>
          }
        />
      }
    />
  );
};

export const DateWithTimeStamp: FC<dateWithTimeStampPropType> = ({ date }) => (
  <div className="flex flex-col justify-center items-center w-fit very-small-text text-gray-600">
    {ReadableDateFormat(date)}
    <span className="!text-xs text-gray-500">{timeStampAmPmFormat(date)}</span>
  </div>
);

export const ChangeMyPassword = () => {
  const { handleSetNotification } = useNotification();
  const { handleDoneLoading, handleIsLoading } = useLoading();
  const [hidePass, setHidePass] = useState<boolean>(true);
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formError, setFormError] =
    useState<FormErrorType<changePasswordType>>();
  const defaultVal = {
    currentPass: "",
    newPass: "",
    confirmNewPass: "",
  };
  const [passVal, setPassVal] = useState<changePasswordType>(defaultVal);

  const handleChangeVal = (e: ChangeEvent<HTMLInputElement>) => {
    setPassVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setHasChange(true);
  };

  const handleResetForm = () => {
    setPassVal(defaultVal);
    setHasChange(false);
  };

  const handleFormSubmit = async () => {
    try {
      handleIsLoading("Binabago na ang iyong password");

      const res = await changeFarmerPass(passVal);

      handleSetNotification(res.notifMessage);

      if (res.success) return handleResetForm;

      setFormError(res.formError);
    } catch (error) {
      console.log((error as Error).message);

      handleSetNotification([
        { message: UnexpectedErrorMessage(), type: "error" },
      ]);
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <>
      <AuthInputPass
        label="Kasalukuyang password:"
        isHidden={hidePass}
        setIsHidden={() => setHidePass(!hidePass)}
        name="currentPass"
        placeholder="FarmerPass123"
        value={passVal.currentPass}
        onChange={handleChangeVal}
        formError={formError?.currentPass}
        required={hasChange}
      />

      <FormDivLabelInput
        labelMessage="Bagong password:"
        inputName="newPass"
        placeholder="NewPasswordPalay123"
        value={passVal.newPass}
        onChange={handleChangeVal}
        formError={formError?.newPass}
        required={hasChange}
      />

      <FormDivLabelInput
        labelMessage="Kumpirmahin ang panibagong password:"
        inputName="confirmNewPass"
        placeholder="NewPasswordPalay123"
        value={passVal.confirmNewPass}
        onChange={handleChangeVal}
        formError={formError?.confirmNewPass}
        required={hasChange}
      />

      {hasChange && (
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

export const FarmerLogoutButton = () => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      handleIsLoading("Logging out!!!");

      const res = await farmerLogout();

      handleSetNotification(res.notifError);
    } catch (error) {
      if (!isRedirectError(error)) {
        console.log((error as Error).message);

        handleSetNotification([
          { message: UnexpectedErrorMessage(), type: "error" },
        ]);
      }
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <>
      <button
        className="group nav-link w-full"
        onClick={() => setOpenModal(true)}
      >
        <LogOut className="logo" />

        <span className="nav-span">Log out</span>
      </button>

      {openModal &&
        createPortal(
          <ModalNotice
            type="warning"
            title="Mag log out ng account"
            showCloseButton={false}
            message={<>Mag log out ng account?</>}
            onClose={() => setOpenModal(false)}
            onProceed={handleLogout}
            showCancelButton={true}
            proceed={{ label: "Mag log out" }}
            cancel={{ label: "Kanselahin" }}
          />,
          document.body
        )}
    </>
  );
};

export const AgriLogoutButton = () => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      handleIsLoading("Logging out!!!");

      const res = await agriLogout();

      if (!res.success) return handleSetNotification(res.notifError);

      await signOut({
        redirectUrl: `/agriAuth/signIn?notif=${NotifToUriComponent([
          { message: "Successfully loged out", type: "success" },
        ])}`,
      });
    } catch (error) {
      if (!isRedirectError(error)) {
        console.log((error as Error).message);

        handleSetNotification([
          { message: UnexpectedErrorMessage(), type: "error" },
        ]);
      }
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <>
      <button
        className="group nav-link w-full"
        onClick={() => setOpenModal(true)}
      >
        <LogOut className="logo" />

        <span className="nav-span">Log out</span>
      </button>

      {openModal &&
        createPortal(
          <ModalNotice
            type="warning"
            title="Log out your account?"
            showCloseButton={false}
            message={<>Are you sure you want to log out?</>}
            onClose={() => setOpenModal(false)}
            onProceed={handleLogout}
            showCancelButton={true}
            proceed={{ label: "Log out" }}
            cancel={{ label: "Cancel" }}
          />,
          document.body
        )}
    </>
  );
};

const ColCell = memo(
  ({ cols, uniqueName }: { cols: unknown[]; uniqueName: string }) =>
    cols.map((_, index) => (
      <th key={index + "cell" + uniqueName} scope="col" className="p-4">
        <div className="" />
      </th>
    ))
);
ColCell.displayName = "ColCell";

const RowCell = memo(({ rows, cols }: { rows: unknown[]; cols: unknown[] }) =>
  rows.map((_, index) => (
    <tr
      className="animate-pulse [&_div]:bg-gray-200 [&_div]:rounded [&_div]:h-4"
      key={index}
    >
      <ColCell cols={cols} uniqueName="rowNum" />
    </tr>
  ))
);
RowCell.displayName = "RowCell";

export const TableComponentLoading: FC<TableComponentLoadingPropType> = ({
  col = 7,
  row = 5,
}) => {
  const rows = useMemo(() => Array.from({ length: row }), [row]);
  const cols = useMemo(() => Array.from({ length: col }), [col]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-pulse">
        <div className="h-8 w-48 bg-gray-300 rounded"></div>

        <div className="h-10 w-32 bg-green-500 rounded-lg"></div>
      </div>

      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 [&_div]:bg-gray-300 [&_div]:rounded [&_div]:animate-pulse [&_div]:w-full [&_div]:h-5">
                <ColCell cols={cols} uniqueName="tableHead" />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              <RowCell rows={rows} cols={cols} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const BurgerNav: FC<BurgerNavPropType> = ({ children }) => {
  const [viewNav, setViewNav] = useState<boolean>(false);

  return (
    <div>
      <Menu className="size-10" onClick={() => setViewNav(!viewNav)} />

      {viewNav && (
        <div className="com">
          <div onClick={() => setViewNav(false)} />
          {children}
        </div>
      )}
    </div>
  );
};

export const ResetPasswordForm: FC<resetPasswordFormPropType> = ({ token }) => {
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [formError, setFormError] =
    useState<FormErrorType<resetPasswordType>>();
  const [passwordVal, setPasswordVal] = useState<resetPasswordType>({
    newPass: "",
    confirmNewPass: "",
  });
  const [hidePass, setHidePass] = useState<{
    newPass: boolean;
    confirmNewPass: boolean;
  }>({
    newPass: true,
    confirmNewPass: true,
  });

  const handleChangeVal = (e: ChangeEvent<HTMLInputElement>) =>
    setPasswordVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handeHidePass = (key: "newPass" | "confirmNewPass") =>
    setHidePass((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleFormSubmit = async () => {
    try {
      handleIsLoading("Pinapalta na ang iyong password");

      const res = await changeNewPass({
        token,
        newPass: passwordVal.newPass,
        confirmNewPass: passwordVal.confirmNewPass,
      });

      if (!res.success) {
        handleSetNotification(res.notifError);

        if (res.formError) setFormError(res.formError);
      }
    } catch (error) {
      if (!isRedirectError(error)) {
        console.log((error as Error).message);

        handleSetNotification([
          { message: UnexpectedErrorMessage(), type: "error" },
        ]);
      }
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <div className="auth_form">
      <h1>Mag gawa ng panibagong password</h1>

      <form onSubmit={handleFormSubmit}>
        <AuthInputPass
          label="Panibagong password:"
          isHidden={hidePass.newPass}
          setIsHidden={() => handeHidePass("newPass")}
          name="newPass"
          placeholder="FarmerPass123"
          value={passwordVal.newPass}
          onChange={handleChangeVal}
          formError={formError?.newPass}
          required
        />

        <AuthInputPass
          label="Kumpirmahin ang panibagong password:"
          isHidden={hidePass.confirmNewPass}
          setIsHidden={() => handeHidePass("confirmNewPass")}
          name="confirmNewPass"
          placeholder="FarmerPass123"
          value={passwordVal.confirmNewPass}
          onChange={handleChangeVal}
          formError={formError?.confirmNewPass}
          required
        />

        <button type="submit">IPASA</button>
      </form>
    </div>
  );
};

export const BackButton: FC<{ label: string }> = ({ label }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      {label}
    </button>
  );
};
