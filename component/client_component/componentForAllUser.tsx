"use client";

import { AlertTriangle, X } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  memo,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useLoading } from "./provider/loadingProvider";
import { useNotification } from "./provider/notificationProvider";
import { DelteUserAccount } from "@/lib/server_action/user";
import { useRouter } from "next/navigation";
import {
  FarmerPersonalInfoType,
  GetFarmerUserProfileInfoQueryReturnType,
  QueryAvailableOrgReturnType,
  UserPersonalInfoFormInputComponentType,
  UserPersonalInfoFormSelectComponentType,
} from "@/types";
import { DateToYYMMDD } from "@/util/helper_function/reusableFunction";
import {
  ControlledFormInput,
  ControlledSelectElementForBarangay,
  FormDiv,
  FormElement,
  FormLabel,
  FormTitle,
} from "../server_component/elementComponents/formComponent";

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
          farmerFirstName: userFarmerInfo.farmerFirstName,
          farmerLastName: userFarmerInfo.farmerLastName,
          farmerAlias: userFarmerInfo.farmerAlias,
          mobileNumber: userFarmerInfo.mobileNumber,
          barangay: userFarmerInfo.barangay,
          birthdate: userFarmerInfo.birthdate,
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
            {/* <MemoizedControlledSelectElementForOrgList
              orgList={orgList}
              val={orgId ? orgId : ""}
              name={"orgId"}
              style="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 disabled:text-gray-500"
              isView={isViewing}
              OnchangeFunc={handleUserInput}
            /> */}
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
  const [userInfoState, setUserInfoState] =
    useState<FarmerPersonalInfoType>(personalInfo);
  console.log(userInfoState);

  const handleUserInput = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setUserInfoState((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleFormSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <FormElement onSubmit={handleFormSubmit}>
      <FormTitle className="text-lg font-semibold text-gray-900 mb-4">
        Pangalan
      </FormTitle>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <UserPersonalInfoFormInputComponent
          labelMessage="Unang Pangalan"
          inputDisable={isViewing}
          inputName={"farmerFirstName"}
          inputValue={userInfoState.farmerFirstName}
          inputOnchange={handleUserInput}
          inputPlaceholder="Mang kanor"
        />

        <UserPersonalInfoFormInputComponent
          labelMessage="Gitnang Pangalan"
          inputDisable={isViewing}
          inputName={"farmerMiddleName"}
          inputValue={"wala pa sa db"}
          inputOnchange={handleUserInput}
          inputPlaceholder="wala pa sa db"
        />

        <UserPersonalInfoFormInputComponent
          labelMessage="Apelyido"
          inputDisable={isViewing}
          inputName={"farmerLastName"}
          inputValue={userInfoState.farmerLastName}
          inputOnchange={handleUserInput}
          inputPlaceholder="e.g. Juan Delacruz"
        />

        <UserPersonalInfoFormInputComponent
          labelMessage="Palayaw na pagdugtong"
          inputDisable={isViewing}
          inputName={"farmerExtensionName"}
          inputValue={`wala pang nakalagay sa DB`}
          inputOnchange={handleUserInput}
          inputPlaceholder="e.g. Jr."
        />

        <UserPersonalInfoFormInputComponent
          labelMessage="Alyas"
          inputDisable={isViewing}
          inputName={"farmerAlias"}
          inputValue={userInfoState.farmerAlias}
          inputOnchange={handleUserInput}
          inputPlaceholder="e.g. Mang Kanor"
        />

        <UserPersonalInfoFormInputComponent
          labelMessage="Kasarian"
          inputDisable={isViewing}
          inputName={"farmerSex"}
          inputValue={`wala pang nakalagay sa database`}
          inputOnchange={handleUserInput}
          inputPlaceholder="e.g. lalaki"
        />

        <UserPersonalInfoFormSelectComponent
          labelMessage="Baranggay na tinitirhan"
          selectValue={userInfoState.barangay}
          selectName={"barangay"}
          selectIsDisable={isViewing}
          selectOnChange={handleUserInput}
        />

        <UserPersonalInfoFormInputComponent
          labelMessage="Numero ng Telepono"
          inputDisable={isViewing}
          inputName={"mobileNumber"}
          inputValue={userInfoState.mobileNumber}
          inputOnchange={handleUserInput}
          inputPlaceholder="09** *** **12"
        />

        <UserPersonalInfoFormInputComponent
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
        />

        <UserPersonalInfoFormInputComponent
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
        />
      </div>
    </FormElement>
  );
};

const UserPersonalInfoFormInputComponent: FC<UserPersonalInfoFormInputComponentType> =
  memo(
    ({
      labelMessage,
      inputType = "text",
      inputDisable,
      inputName,
      inputValue,
      inputOnchange,
      inputPlaceholder,
    }) => {
      return (
        <FormDiv>
          <FormLabel htmlFor={inputName}>{labelMessage}</FormLabel>
          <ControlledFormInput
            type={inputType}
            disabled={inputDisable}
            name={inputName}
            value={inputValue}
            onChange={inputOnchange}
            placeholder={inputPlaceholder}
          />
        </FormDiv>
      );
    }
  );
UserPersonalInfoFormInputComponent.displayName =
  "UserPersonalInfoFormInputComponent";

const UserPersonalInfoFormSelectComponent: FC<UserPersonalInfoFormSelectComponentType> =
  memo(
    ({
      labelMessage,
      selectValue,
      selectName,
      selectIsDisable,
      selectOnChange,
    }) => {
      return (
        <FormDiv>
          <FormLabel htmlFor={selectName}>{labelMessage}</FormLabel>
          <ControlledSelectElementForBarangay
            selectIsDisable={selectIsDisable}
            selectName={selectName}
            selectValue={selectValue}
            selectOnChange={selectOnChange}
          />
        </FormDiv>
      );
    }
  );
UserPersonalInfoFormSelectComponent.displayName =
  "UserPersonalInfoFormSelectComponent";
