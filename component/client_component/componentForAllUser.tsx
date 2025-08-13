"use client";

import { AlertTriangle, X } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
import { DelteUserAccount } from "@/lib/server_action/user";
import { useRouter } from "next/navigation";
import {
  FarmerPersonalInfoType,
  FormErrorType,
  GetFarmerUserProfileInfoQueryReturnType,
  QueryAvailableOrgReturnType,
} from "@/types";
import { DateToYYMMDD } from "@/util/helper_function/reusableFunction";
import {
  ControlledSelectElementForOrgList,
  FormCancelSubmitButton,
  FormDivLabelInput,
  FormDivLabelSelect,
  FormElement,
  FormTitle,
} from "../server_component/elementComponents/formComponent";
import { UpdateUserProfileInfo } from "@/lib/server_action/farmerUser";
import { useLoading } from "./provider/loadingProvider";

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
export const UserProFileForm: FC<{
  userFarmerInfo: GetFarmerUserProfileInfoQueryReturnType;
  isViewing: boolean;
  orgList: QueryAvailableOrgReturnType;
}> = ({ userFarmerInfo, isViewing, orgList }) => {
  return (
    <div className="grid gap-6">
      <UserPersonalInfo
        personalInfo={{
          firstName: userFarmerInfo.farmerFirstName,
          lastName: userFarmerInfo.farmerLastName,
          alias: userFarmerInfo.farmerAlias,
          mobileNumber: userFarmerInfo.mobileNumber,
          birthdate: userFarmerInfo.birthdate,
          farmerBarangay: userFarmerInfo.barangay,
        }}
        isViewing={isViewing}
      />
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Organisasyon na kasali
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Pangalan ng Organisasyon
            </label>
            <ControlledSelectElementForOrgList
              selectOrgList={orgList}
              selectValue={userFarmerInfo.orgId ? userFarmerInfo.orgId : ""}
              selectName={"orgId"}
              selectIdDisable={isViewing}
              selectOnChange={() => {}}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Leader ng Organisasyon
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 disabled:text-gray-500">
              {userFarmerInfo.leaderName ? userFarmerInfo.leaderName : "Wala"}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Posisyon
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 disabled:text-gray-500">
              {userFarmerInfo.orgRole ? userFarmerInfo.orgRole : "Wala"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserPersonalInfo: FC<{
  personalInfo: FarmerPersonalInfoType;
  isViewing: boolean;
}> = ({ personalInfo, isViewing }) => {
  const router = useRouter();
  const { handleSetNotification } = useNotification();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const [isChangingVal, setIsChangingVal] = useState<boolean>(false);
  const [formError, setFormError] =
    useState<FormErrorType<FarmerPersonalInfoType>>();
  const [userInfoState, setUserInfoState] =
    useState<FarmerPersonalInfoType>(personalInfo);

  const handleUserInput = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setUserInfoState((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));

      if (!isChangingVal) setIsChangingVal((prev) => !prev);
    },
    [isChangingVal]
  );

  /**
   * resets the state value into its default value
   * was made because the "handleResetFormVal" set the current value(value before the route.refresh) and not the freshly fetched value
   */
  const handleReset = () => {
    setIsChangingVal(false);
    setFormError(null);
  };

  /**
   * resets the value and its form val if not passed yet
   */
  const handleResetFormVal = useCallback(() => {
    setUserInfoState(personalInfo);
    handleReset();
  }, [personalInfo]);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      try {
        handleIsLoading("Ina-update na ang iyong impormasyon...");
        e.preventDefault();

        console.log(userInfoState);

        const updateAction = await UpdateUserProfileInfo(userInfoState);

        if (updateAction.success) {
          router.refresh();
          handleResetFormVal();
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
      handleResetFormVal,
      userInfoState,
      router,
    ]
  );

  return (
    <FormElement onSubmit={handleFormSubmit}>
      <FormTitle className="text-lg font-semibold text-gray-900 mb-4">
        Pangalan
      </FormTitle>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <FormDivLabelInput
          labelMessage="Unang Pangalan"
          inputDisable={isViewing}
          inputName={"firstName"}
          inputValue={userInfoState.firstName}
          inputOnchange={handleUserInput}
          inputPlaceholder="Mang kanor"
          formErrorMessage={formError?.firstName}
        />

        {/* WALA PA NITO SA DATABASE */}
        <FormDivLabelInput
          labelMessage="Gitnang Pangalan"
          inputDisable={isViewing}
          inputName={"farmerMiddleName"}
          inputValue={"wala pa sa db"}
          inputOnchange={handleUserInput}
          inputPlaceholder="wala pa sa db"
        />

        <FormDivLabelInput
          labelMessage="Apelyido"
          inputDisable={isViewing}
          inputName={"lastName"}
          inputValue={userInfoState.lastName}
          inputOnchange={handleUserInput}
          inputPlaceholder="e.g. Juan Delacruz"
          formErrorMessage={formError?.lastName}
        />

        {/* WALA PA NITO SA DATABASE */}
        <FormDivLabelInput
          labelMessage="Palayaw na pagdugtong"
          inputDisable={isViewing}
          inputName={"farmerExtensionName"}
          inputValue={`wala pang nakalagay sa DB`}
          inputOnchange={handleUserInput}
          inputPlaceholder="e.g. Jr."
        />

        <FormDivLabelInput
          labelMessage="Alyas"
          inputDisable={isViewing}
          inputName={"alias"}
          inputValue={userInfoState.alias ?? ""}
          inputOnchange={handleUserInput}
          inputPlaceholder="e.g. Mang Kanor"
          formErrorMessage={formError?.alias}
        />

        {/* WALA PA NITO SA DATABASE */}
        <FormDivLabelInput
          labelMessage="Kasarian"
          inputDisable={isViewing}
          inputName={"farmerSex"}
          inputValue={`wala pang nakalagay sa database`}
          inputOnchange={handleUserInput}
          inputPlaceholder="e.g. lalaki"
        />

        <FormDivLabelSelect
          labelMessage="Baranggay na tinitirhan"
          selectValue={userInfoState.farmerBarangay}
          selectName={"farmerBarangay"}
          selectIsDisable={isViewing}
          selectOnChange={handleUserInput}
          formErrorMessage={formError?.farmerBarangay}
        />

        <FormDivLabelInput
          labelMessage="Numero ng Telepono"
          inputDisable={isViewing}
          inputName={"mobileNumber"}
          inputValue={userInfoState.mobileNumber}
          inputOnchange={handleUserInput}
          inputPlaceholder="09** *** ****"
          formErrorMessage={formError?.mobileNumber}
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
          inputOnchange={handleUserInput}
          inputPlaceholder="july 20, 2024"
          formErrorMessage={formError?.birthdate}
        />
      </div>

      {isChangingVal && (
        <FormCancelSubmitButton
          submitButtonLabel="Ipasa"
          cancelOnClick={handleResetFormVal}
          cancelButtonLabel="Kanselahin"
        />
      )}
    </FormElement>
  );
};
