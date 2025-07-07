"use client";

import { AvailableOrg } from "@/lib/server_action/org";
import { ExistingOrgType } from "@/types";
import { FC, useState } from "react";

export const FarmerDetailForm: FC = () => {
  const [organizations, setOrganizations] =
    useState<Promise<ExistingOrgType>>(null);

  const gel = async () => {
    setOrganizations(await AvailableOrg);
  };
  return (
    <div>
      <form action="">
        <div>
          <label htmlFor="">Fullname</label>
          <input type="text" name="fullname" />
        </div>

        <div>
          <label htmlFor="">Allias</label>
          <input type="text" name="allias" />
        </div>

        <div>
          <label htmlFor="">Organization</label>
          <input type="text" name="organization" />
        </div>

        <div>
          <label htmlFor="">Mobile Number</label>
          <input type="text" name="mobileNumber" />
        </div>

        <div>
          <label htmlFor="">Baranggay</label>
          <select name="barangay" id="">
            <option value="balayhangin">Balayhangin</option>
            <option value="bangyas">Bangyas</option>
            <option value="dayap">Dayap</option>
            <option value="imok">Imok</option>
            <option value="kanluran">Kanluran (Poblacion)</option>
            <option value="lamot">Lamot 1</option>
            <option value="lamot">Lamot 2</option>
            <option value="limao">Limao</option>
            <option value="mabacan">Mabacan</option>
            <option value="masiit">Masiit</option>
            <option value="paliparan">Paliparan</option>
            <option value="pulo">Pulo</option>
            <option value="san roque">San Roque</option>
            <option value="sto. tomas">Sto. Tomas (Poblacion)</option>
            <option value="prinza">Prinza</option>
            <option value="pinagbayanan">Pinagbayanan</option>
            <option value="ambulong">Ambulong</option>
          </select>
        </div>

        <div>
          <label htmlFor="">Age</label>
          <input type="number" name="agefullname" />
        </div>

        <div>
          <label htmlFor="">Birthdate</label>
          <input type="date" name="birthdate" />
        </div>
      </form>
    </div>
  );
};
