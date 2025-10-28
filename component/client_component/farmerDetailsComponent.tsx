"use client";

import {
  FarmerDetailFormPropType,
  FarmerFirstDetailFormType,
  FormErrorType,
} from "@/types";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useNotification } from "./provider/notificationProvider";
import { useLoading } from "./provider/loadingProvider";
import {
  baranggayList,
  DateToYYMMDD,
} from "@/util/helper_function/reusableFunction";
import { AddFirstFarmerDetails } from "@/lib/server_action/farmerDetails";
import {
  FormDivLabelInput,
  FormDivLabelSelect,
  SubmitButton,
} from "../server_component/customComponent";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const FarmerDetailForm: FC<FarmerDetailFormPropType> = ({ orgList }) => {
  const { handleSetNotification } = useNotification();
  const { handleDoneLoading, handleIsLoading } = useLoading();
  const [newOrg, setNewOrg] = useState<boolean>(false);
  const [formError, setFormError] =
    useState<FormErrorType<FarmerFirstDetailFormType>>(null);
  const [newUserVal, setNewUserVal] = useState<FarmerFirstDetailFormType>({
    firstName: "",
    middleName: "",
    lastName: "",
    extensionName: "",
    alias: "",
    mobileNumber: "",
    birthdate: new Date(),
    farmerBarangay: "",
    countFamilyMember: "",
    organization: "",
    newOrganization: "",
  });

  const handleChangeVal = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewUserVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (e.target.name === "organization") {
      if (e.target.value === "other") return setNewOrg(true);
      else {
        setNewOrg(false);
        setNewUserVal((prev) => ({ ...prev, newOrganization: "" }));
        return;
      }
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      handleIsLoading("Isinusumite na ang iyong impormasyon");

      const res = await AddFirstFarmerDetails(newUserVal);

      if (!res.success && res.formError) {
        setFormError(res.formError);
        handleSetNotification(res.notifError);
      }
    } catch (error) {
      if (!isRedirectError(error)) {
        console.log((error as Error).message);
        handleSetNotification([
          { message: (error as Error).message, type: "error" },
        ]);
      }
    } finally {
      handleDoneLoading();
    }
  };
  return (
    <div>
      <h2 className="form-title title">Personal na Impormasyon</h2>
      <form onSubmit={handleFormSubmit} className="form">
        <FormDivLabelInput
          labelMessage="Unang Pangalan:"
          inputName="firstName"
          inputValue={newUserVal.firstName}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Juan"
          inputRequired={true}
          formError={formError?.firstName}
        />

        <FormDivLabelInput
          labelMessage="Gitnang Pangalan:"
          inputName="middleName"
          inputValue={newUserVal.middleName}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Luna"
          inputRequired={true}
          formError={formError?.middleName}
        />

        <FormDivLabelInput
          labelMessage="Apelyido:"
          inputName="lastName"
          inputValue={newUserVal.lastName}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Dela Cruz"
          inputRequired={true}
          formError={formError?.lastName}
        />

        <FormDivLabelInput
          labelMessage="Karagdagang Pagkakilanlan"
          inputName="extensionName"
          inputValue={newUserVal.extensionName ?? ""}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Jr."
          formError={formError?.extensionName}
        />

        <FormDivLabelInput
          labelMessage="Alyas:"
          inputName="alias"
          inputValue={newUserVal.alias ?? ""}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. Mang. Kanor"
          formError={formError?.alias}
        />

        <FormDivLabelInput
          labelMessage="Mobile Number:"
          inputName="mobileNumber"
          inputValue={newUserVal.mobileNumber}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. 09*******32 / +639*******32"
          inputRequired={true}
          formError={formError?.mobileNumber}
        />

        <FormDivLabelInput
          labelMessage="Araw ng kapanganakan:"
          inputName="birthdate"
          inputValue={
            newUserVal.birthdate instanceof Date
              ? DateToYYMMDD(newUserVal.birthdate)
              : newUserVal.birthdate === Date.now()
              ? ""
              : newUserVal.birthdate
          }
          onChange={handleChangeVal}
          inputType="date"
          inputMax={new Date().toISOString().split("T")[0]}
          inputRequired={true}
          formError={formError?.birthdate}
        />

        {/* wala pa yung organisasyon na pamimilian */}
        <FormDivLabelSelect
          labelMessage="Organisasyon na Iyong Kabilang:"
          selectName={"organization"}
          selectValue={newUserVal.organization}
          onChange={handleChangeVal}
          selectOrganization={true}
          selectRequired={true}
          optionDefaultValueLabel={{
            value: "",
            label: "--Pumili--Ng--Organisasyon--",
          }}
          childrenOption={orgList.map((org) => (
            <option key={org.orgId} value={org.orgId}>
              {org.orgName}
            </option>
          ))}
          formError={formError?.organization}
        />

        {newOrg && (
          <FormDivLabelInput
            labelMessage="Organisasyon na iyong gagawin"
            inputName="newOrganization"
            inputValue={newUserVal.newOrganization ?? ""}
            onChange={handleChangeVal}
            inputPlaceholder="Hal. Kapalayan sa silangan"
            inputRequired={true}
            formError={formError?.newOrganization}
          />
        )}

        <FormDivLabelInput
          labelMessage="Bilang ng iyong pamilya"
          inputName="countFamilyMember"
          inputValue={newUserVal.countFamilyMember}
          onChange={handleChangeVal}
          inputPlaceholder="Hal. 5"
          inputRequired={true}
          formError={formError?.countFamilyMember}
        />

        <FormDivLabelSelect
          labelMessage="Baranggay na iyong tinitirhan:"
          selectName={"farmerBarangay"}
          selectValue={newUserVal.farmerBarangay}
          selectRequired={true}
          onChange={handleChangeVal}
          optionDefaultValueLabel={{
            value: "",
            label: "--Pumili--Ng--Baranggay--",
          }}
          childrenOption={baranggayList.map((brgy) => (
            <option key={brgy} value={brgy}>
              {brgy.charAt(0).toUpperCase() + brgy.slice(1)}
            </option>
          ))}
          formError={formError?.farmerBarangay}
        />

        <div>
          <SubmitButton>Ipasa</SubmitButton>
        </div>
      </form>
    </div>
  );
};
