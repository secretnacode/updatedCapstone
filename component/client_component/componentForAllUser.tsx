"use client";

import {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import { useRouter } from "next/navigation";
import {
  ApprovedButtonPropType,
  DeleteUserPropType,
  FarmerProfileOrgInfoQueryReturnType,
  FarmerProfilePersonalInfoQueryReturnType,
  FormErrorType,
  OrganizationInfoFormPropType,
  OrgInfoType,
  QueryAvailableOrgReturnType,
  userFarmerInfoPropType,
  UserFarmerInfoPropType,
  UserProfileFormPropType,
} from "@/types";
import {
  baranggayList,
  DateToYYMMDD,
} from "@/util/helper_function/reusableFunction";
import {
  ApprovedOrgFarmerAcc,
  UpdateUserProfileInfo,
} from "@/lib/server_action/farmerUser";
import { useLoading } from "./provider/loadingProvider";
import { UpdateUserProfileOrg } from "@/lib/server_action/org";
import {
  FormCancelSubmitButton,
  FormDivLabelInput,
  FormDivLabelSelect,
  ModalNotice,
} from "../server_component/customComponent";
import { DelteUserAccount } from "@/lib/server_action/user";

//FIX: add middle name and extension name
export const UserProFileComponent: FC<{
  userFarmerInfo: FarmerProfilePersonalInfoQueryReturnType;
  orgInfo: FarmerProfileOrgInfoQueryReturnType;
  orgList: QueryAvailableOrgReturnType[];
  isViewing: boolean;
}> = ({ userFarmerInfo, isViewing, orgList }) => {
  return (
    <div className="div">
      <div className="div grid gap-6">
        <UserProfileForm
          isViewing={isViewing}
          userFarmerInfo={{
            firstName: userFarmerInfo.farmerFirstName,
            lastName: userFarmerInfo.farmerLastName,
            alias: userFarmerInfo.farmerAlias,
            mobileNumber: userFarmerInfo.mobileNumber,
            birthdate: userFarmerInfo.birthdate,
            farmerBarangay: userFarmerInfo.barangay,
          }}
        />

        <UserOrganizationInfoForm
          isViewing={isViewing}
          availOrgList={orgList}
          userOrgInfo={{
            orgId: userFarmerInfo.orgId,
            leaderName: userFarmerInfo.leaderName,
            orgRole: userFarmerInfo.orgRole,
          }}
        />
      </div>
    </div>
  );
};

export const UserProfileForm: FC<UserProfileFormPropType> = ({
  isViewing,
  userFarmerInfo,
}) => {
  const router = useRouter();
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [isChangingVal, setIsChangingVal] = useState<boolean>(false);
  const [formError, setFormError] =
    useState<FormErrorType<userFarmerInfoPropType>>();
  const personalInfo = useMemo(
    () =>
      ({
        firstName: userFarmerInfo.firstName,
        lastName: userFarmerInfo.lastName,
        alias: userFarmerInfo.alias,
        mobileNumber: userFarmerInfo.mobileNumber,
        birthdate: userFarmerInfo.birthdate,
        farmerBarangay: userFarmerInfo.farmerBarangay,
      } as const),
    [
      userFarmerInfo.firstName,
      userFarmerInfo.lastName,
      userFarmerInfo.alias,
      userFarmerInfo.mobileNumber,
      userFarmerInfo.birthdate,
      userFarmerInfo.farmerBarangay,
    ]
  );
  const [userInfoState, setUserInfoState] =
    useState<userFarmerInfoPropType>(personalInfo);

  const handleUserInput = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setUserInfoState((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));

      if (!isChangingVal) setIsChangingVal(true);
    },
    [isChangingVal]
  );

  const handleReset = useCallback(() => {
    setIsChangingVal(false);
    setFormError(null);
  }, []);

  /**
   * resets the value and its form val if not passed yet
   */
  const handleResetFormVal = useCallback(() => {
    setUserInfoState(personalInfo);
    handleReset();
  }, [personalInfo, handleReset]);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      try {
        handleIsLoading("Ina-update na ang iyong impormasyon...");
        e.preventDefault();

        const updateAction = await UpdateUserProfileInfo(userInfoState);

        if (updateAction.success) {
          router.refresh();
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
    },
    [
      handleIsLoading,
      handleSetNotification,
      handleDoneLoading,
      handleReset,
      userInfoState,
      router,
    ]
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <h1 className="title form-title">Pangalan</h1>

      <div className="form-div grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <FormDivLabelInput
          labelMessage="Unang Pangalan"
          inputDisable={isViewing}
          inputName={"firstName"}
          inputValue={userInfoState.firstName}
          onChange={handleUserInput}
          inputPlaceholder="Mang kanor"
          formError={formError?.firstName}
        />

        {/* WALA PA NITO SA DATABASE */}
        <FormDivLabelInput
          labelMessage="Gitnang Pangalan"
          inputDisable={isViewing}
          inputName={"farmerMiddleName"}
          inputDefaultValue={"wala pa sa db"}
          inputPlaceholder="wala pa sa db"
        />

        <FormDivLabelInput
          labelMessage="Apelyido"
          inputDisable={isViewing}
          inputName={"lastName"}
          inputValue={userInfoState.lastName}
          onChange={handleUserInput}
          inputPlaceholder="e.g. Juan Delacruz"
          formError={formError?.lastName}
        />

        {/* WALA PA NITO SA DATABASE */}
        <FormDivLabelInput
          labelMessage="Palayaw na pagdugtong"
          inputDisable={isViewing}
          inputName={"farmerExtensionName"}
          inputDefaultValue={`wala pang nakalagay sa DB`}
          inputPlaceholder="e.g. Jr."
        />

        <FormDivLabelInput
          labelMessage="Alyas"
          inputDisable={isViewing}
          inputName={"alias"}
          inputValue={userInfoState.alias ?? ""}
          onChange={handleUserInput}
          inputPlaceholder="e.g. Mang Kanor"
          formError={formError?.alias}
        />

        {/* WALA PA NITO SA DATABASE */}
        <FormDivLabelInput
          labelMessage="Kasarian"
          inputDisable={isViewing}
          inputName={"farmerSex"}
          inputDefaultValue={`wala pang nakalagay sa database`}
          inputPlaceholder="e.g. lalaki"
        />

        <FormDivLabelSelect<string>
          labelMessage="Baranggay na tinitirhan"
          selectValue={userInfoState.farmerBarangay}
          selectName={"farmerBarangay"}
          selectDisable={isViewing}
          onChange={handleUserInput}
          optionList={baranggayList}
          optionValue={(brgy: string) => brgy}
          optionLabel={(brgy: string) => `${brgy.charAt(0) + brgy.slice(1)}`}
          formError={formError?.farmerBarangay}
        />

        <FormDivLabelInput
          labelMessage="Numero ng Telepono"
          inputDisable={isViewing}
          inputName={"mobileNumber"}
          inputValue={userInfoState.mobileNumber}
          onChange={handleUserInput}
          inputPlaceholder="09** *** ****"
          formError={formError?.mobileNumber}
        />

        <FormDivLabelInput
          labelMessage="Kapanganakan"
          inputType="date"
          inputDisable={isViewing}
          inputName={"birthdate"}
          inputValue={
            userInfoState.birthdate instanceof Date
              ? DateToYYMMDD(userInfoState.birthdate)
              : userInfoState.birthdate
          }
          onChange={handleUserInput}
          inputPlaceholder="july 20, 2024"
          formError={formError?.birthdate}
        />
      </div>

      {isChangingVal && (
        <FormCancelSubmitButton
          submitButtonLabel="Ipasa"
          cancelOnClick={handleResetFormVal}
          cancelButtonLabel="Kanselahin"
        />
      )}
    </form>
  );
};

export const UserOrganizationInfoForm: FC<OrganizationInfoFormPropType> = ({
  isViewing,
  availOrgList,
  userOrgInfo,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [formError, setFormError] = useState<FormErrorType<OrgInfoType>>();
  const [otherOrg, setOtherOrg] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isChangingVal, setIsChangingVal] = useState<boolean>(false);
  const [orgInfo, setOrgInfo] = useState<OrgInfoType>({
    orgId: userOrgInfo.orgId,
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
    <form onSubmit={handleFormSubmit} ref={formRef} className="border-t pt-6">
      <h1 className="title text-lg font-semibold text-gray-900 mb-4">
        Organisasyon na kasali
      </h1>
      <div className="form-div grid sm:grid-cols-2 gap-4">
        <FormDivLabelSelect<QueryAvailableOrgReturnType>
          labelMessage={"Pangalan ng Organisasyon"}
          selectValue={orgInfo.orgId ?? ""}
          onChange={handleUserOrgChange}
          selectName={"orgId"}
          selectDisable={isViewing}
          selectOrganization={true}
          optionList={availOrgList}
          optionValue={(org) => org.orgId}
          optionLabel={(org) =>
            `${org.orgName.charAt(0) + org.orgName.slice(1)}`
          }
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
          inputDefaultValue={userOrgInfo.leaderName}
          inputPlaceholder="Miyembro"
        />

        <FormDivLabelInput
          labelMessage="Posisyon"
          inputDisable={true}
          inputName={"orgRole"}
          inputDefaultValue={userOrgInfo.orgRole}
          inputPlaceholder="Miyembro"
        />
      </div>

      {isChangingVal && (
        <FormCancelSubmitButton
          submitButtonLabel="Ipasa"
          submitType="button"
          submitOnClick={() => setShowModal(true)}
          cancelButtonLabel="Kanselahin"
          cancelOnClick={handleResetForm}
        />
      )}

      {showModal && (
        <ModalNotice
          logo={"warning"}
          modalTitle={"Mag babago ng organisasyon?"}
          closeModal={() => setShowModal(false)}
          modalMessage={
            <>
              <p className="p font-bold !text-lg mb-4">
                Kapag nagpalit ka ng organisasyon, kailangan maaprubahan muna
                ang iyong account bago ulit ka makapagsumite ng ulat.
              </p>
              <p className="p !text-[17px] tracking-wide">
                Magpatuloy sa pagpapalit ng organisasyon?
              </p>
            </>
          }
          procceedButton={{
            label: "Mag Patuloy",
            onClick: () => {
              formRef.current?.requestSubmit();
              setShowModal(false);
            },
          }}
          cancelButton={{ label: "Bumalik" }}
        />
      )}
    </form>
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
      className="button submit-button"
      disabled={verificationStatus}
      onClick={handleApproveFarmerAcc}
    >
      {label}
    </button>
  );
};

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
        className="button cancel-button"
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
          logo={"warning"}
          modalTitle={modalTitle}
          closeModal={() => setShowModal(false)}
          modalMessage={modalMessage}
          procceedButton={{
            label: proceedButtonLabel,
            onClick: () => {
              submitButtonRef.current?.click();
              setShowModal(false);
            },
          }}
          cancelButton={{ label: cancelButtonLabel }}
        />
      )}
    </>
  );
};
