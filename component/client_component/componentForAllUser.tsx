"use client";

import { AlertTriangle, X } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import { DelteUserAccount } from "@/lib/server_action/user";
import { useRouter } from "next/navigation";
import {
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
  Div,
  Form,
  FormCancelSubmitButton,
  FormDiv,
  FormDivLabelInput,
  FormDivLabelSelect,
  FormTitle,
  ModalNotice,
  P,
  Title,
} from "../server_component/elementComponents/formComponent";
import { UpdateUserProfileInfo } from "@/lib/server_action/farmerUser";
import { useLoading } from "./provider/loadingProvider";
import { UpdateUserProfileOrg } from "@/lib/server_action/org";

/**
 * component for the delete modal that will let sure the user will delete the account
 * @param param0 props that takes farmerId(id that you want to delete),
 * farmerName(name of the farmer that you want to delete), setShowDeleteModal(state of modal if it will be shown or not)
 * @returns component modal
 */
export const DeleteModalNotif: FC<{
  farmerId: string;
  farmerName: string;
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
}> = ({ farmerId, farmerName, setShowDeleteModal }) => {
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();
  const [isPassing, setIsPassing] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteFarmerUser = async () => {
    setIsPassing(true);
    try {
      handleIsLoading("Tinatanggal na ang account....");

      const deleteUser = await DelteUserAccount(farmerId);

      handleSetNotification(deleteUser.notifMessage);
      router.refresh();
    } catch (error) {
      const err = error as Error;
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      setIsPassing(false);
      handleDoneLoading();
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Kumpirmasyon ng Pagtanggal
            </h2>
          </div>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isPassing}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600">
            Sigurado ka ba na gusto mong tanggalin ang account ni{" "}
            <span className="font-semibold text-gray-900">{farmerName}</span>?
            Hindi na mababawi ang aksyon na ito.
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => setShowDeleteModal(false)}
            disabled={isPassing}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPassing ? "Tinatanggal na..." : "Kanselahin"}
          </button>
          <button
            onClick={handleDeleteFarmerUser}
            disabled={isPassing}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isPassing ? "Tinatanggal na..." : "Tanggalin"}
          </button>
        </div>
      </div>
    </div>
  );
};

//FIX: add middle name and extension name
export const UserProFileComponent: FC<{
  userFarmerInfo: UserFarmerInfoPropType;
  isViewing: boolean;
  orgList: QueryAvailableOrgReturnType[];
}> = ({ userFarmerInfo, isViewing, orgList }) => {
  return (
    <Div>
      <div className="grid gap-6">
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
    </Div>
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
    <Form onSubmit={handleFormSubmit}>
      <FormTitle>Pangalan</FormTitle>

      <FormDiv className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
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
      </FormDiv>

      {isChangingVal && (
        <FormCancelSubmitButton
          submitButtonLabel="Ipasa"
          submitClassName="!py-2 !px-6 !rounded-2xl"
          cancelOnClick={handleResetFormVal}
          cancelButtonLabel="Kanselahin"
        />
      )}
    </Form>
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
    <Form onSubmit={handleFormSubmit} ref={formRef} className="border-t pt-6">
      <Title className="text-lg font-semibold text-gray-900 mb-4">
        Organisasyon na kasali
      </Title>
      <FormDiv className="grid sm:grid-cols-2 gap-4">
        <FormDivLabelSelect<QueryAvailableOrgReturnType>
          labelMessage={"Pangalan ng Organisasyon"}
          selectValue={orgInfo.orgId ?? ""}
          onChange={handleUserOrgChange}
          selectName={"orgId"}
          selectDisable={isViewing}
          optionOtherValAndLabel={[
            { value: "none", label: "wala" },
            { value: "other", label: "mag lagay ng iba" },
          ]}
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
      </FormDiv>

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
              <P className="font-bold !text-lg mb-4">
                Kapag nagpalit ka ng organisasyon, kailangan maaprubahan muna
                ang iyong account bago ulit ka makapagsumite ng ulat.
              </P>
              <P className="!text-[17px] tracking-wide">
                Magpatuloy sa pagpapalit ng organisasyon?
              </P>
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
    </Form>
  );
};
