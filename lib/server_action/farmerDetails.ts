"use server";

import {
  FarmerFirstDetailActionReturnType,
  FarmerFirstDetailFormType,
} from "@/types";
import { ZodValidateForm } from "../validation/authValidation";
import { farmerFirstDetailFormSchema } from "@/util/helper_function/validation/validationSchema";
import { ProtectedAction } from "@/lib/protectedActions";
import {
  CreateNewOrg,
  getFarmerLeaderId,
  organizationNameIsExist,
  UpdateUserOrg,
} from "@/util/queries/org";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  capitalizeFirstLetter,
  newUserNotifMessage,
  NotifToUriComponent,
} from "@/util/helper_function/reusableFunction";
import { FarmerFirstDetailQuery, getAllAgriId } from "@/util/queries/user";
import { DeleteSession } from "../session";
import { addNewUserNotif } from "@/util/queries/notification";

/**
 * server action that partners with the actionState hook
 * @param prevData is the default value of the state in the front end
 * @param formData is the values of the form
 * @returns the prevData and a success object that if a falsey value it will return a formError that will show the error of the form and notifError if there's an error that needs to be notified
 */
export const AddFirstFarmerDetails = async (
  newUserVal: FarmerFirstDetailFormType
): Promise<FarmerFirstDetailActionReturnType<FarmerFirstDetailFormType>> => {
  try {
    // called an auth id because in the sign up page, the value that was stored in the redis is the value that was added in the auth table in authId and not the farmerId itself from farmer table because the farmerId was just about to create in this action
    const authId = (await ProtectedAction("create:user")).userId;

    const validateVal = ZodValidateForm(
      newUserVal,
      farmerFirstDetailFormSchema
    );
    if (!validateVal.valid) {
      return {
        success: false,
        notifError: [
          {
            message:
              "May mga mali kang nailagay, ayusin muna ito bago mag pasa ng panibago",
            type: "warning",
          },
        ],
        formError: validateVal.formError,
      };
    }

    // check if the new organization name is already existing or not
    if (newUserVal.organization === "other" && newUserVal.newOrganization)
      if (await organizationNameIsExist(newUserVal.newOrganization))
        return {
          success: false,
          notifError: [
            {
              message:
                "Paltan ang pangalan ng organisasyon na iyong inilagay sapagkat may gumagamit na nito",
              type: "warning",
            },
          ],
          formError: {
            newOrganization: [
              "May gumagamit na ng panglan na ito, ito ay paltan!",
            ],
          },
        };

    await FarmerFirstDetailQuery({
      ...newUserVal,
      countFamilyMember: Number(newUserVal.countFamilyMember),
      mobileNumber: Number(newUserVal.mobileNumber),
      farmerId: authId,
      verified: false,
      dateCreated: new Date(),
    });

    const org =
      newUserVal.organization === "other" && newUserVal.newOrganization
        ? (await CreateNewOrg(newUserVal.newOrganization, authId)).orgId
        : newUserVal.organization === "none"
        ? null
        : newUserVal.organization;

    const orgRole =
      newUserVal.organization === "other" && newUserVal.newOrganization
        ? "leader"
        : newUserVal.organization === "none"
        ? null
        : "member";

    await UpdateUserOrg({
      orgId: org,
      orgRole: orgRole,
      farmerId: authId,
    });

    if (orgRole === "member") {
      const { title, message } = newUserNotifMessage(
        capitalizeFirstLetter(newUserVal.firstName) +
          capitalizeFirstLetter(newUserVal.lastName),
        false
      );

      await addNewUserNotif({
        recipientId: await getFarmerLeaderId(authId),
        recipientType: "leader",
        notifType: "new user",
        title,
        message,
        actionId: authId,
        actionType: "account",
      });
    } else {
      const { title, message } = newUserNotifMessage(
        capitalizeFirstLetter(newUserVal.firstName) +
          capitalizeFirstLetter(newUserVal.lastName),
        true
      );

      await Promise.all(
        (
          await getAllAgriId()
        ).map((val) =>
          addNewUserNotif({
            recipientId: val.agriId,
            recipientType: "agriculturist",
            notifType: "new user",
            title,
            message,
            actionId: authId,
            actionType: "account",
          })
        )
      );
    }

    await DeleteSession();

    // no session creation because the user need to be validate first before it proceed to the system
    redirect(
      `/?notif=${NotifToUriComponent([
        { message: "Matagumpay ang iyong pag si-sign up", type: "success" },
        {
          message: "Mag intay na aprubahan ang account bago ka makapag login",
          type: "success",
        },
      ])}`
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;

    console.error(`Error in Adding First Farmer Detial: ${err.message}`);

    return {
      success: false,
      notifError: [
        {
          message: ` ${err.message}`,
          type: "error",
        },
      ],
    };
  }
};

function maximumProfit(prices: number[], k: number): number {
  let total = 0;
  let transacLeft = k;
  let storedValue: number | null = null;
  let moveToIndex: number | null = null;

  for (const [index, price] of prices.entries()) {
    if (transacLeft === 0) break;

    if (moveToIndex) {
      if (moveToIndex > index) continue;
    }

    if (!storedValue) {
      storedValue = price;
      continue;
    }

    const res = calculateTransac({
      currentIndex: index,
      storedValue: storedValue,
      alreadyMoved: moveToIndex !== null,
      transacLeft: transacLeft,
      isNormalTransac: transacLeft % 2 === 0,
      prices: prices,
    });

    if (res.continue) {
      moveToIndex = res.moveToIndex;

      continue;
    } else total = res.profit;

    moveToIndex = null;
    transacLeft -= 1;
  }

  return total;
}

type transacReturn =
  | { continue: true; moveToIndex: number }
  | { continue: false; profit: number };
type calculateTransacPropType = {
  currentIndex: number;
  storedValue: number;
  alreadyMoved: boolean;
  transacLeft: number;
  isNormalTransac: boolean;
  prices: number[];
};

function calculateTransac({
  currentIndex,
  storedValue,
  alreadyMoved,
  transacLeft,
  isNormalTransac,
  prices,
}: calculateTransacPropType): transacReturn {
  // will check the remaining array val if its the last transac
  if (transacLeft === 1) {
    const remainingPrices = prices.slice(
      currentIndex - (prices.length - 1) + 1
    );
    return {
      continue: false,
      profit: isNormalTransac
        ? Math.max(...remainingPrices)
        : Math.min(...remainingPrices),
    };
  }

  // checked if already moved, if not will check which price is much higer
  if (!alreadyMoved && isNormalTransac)
    if (prices[currentIndex] < prices[currentIndex + 1])
      return { continue: true, moveToIndex: currentIndex + 1 };

  const bestToBuy = isNormalTransac
    ? storedValue < prices[currentIndex]
    : storedValue > prices[currentIndex];

  // will check if the next price is much higher than the stored value, if yes will proceed to check the
  if (bestToBuy)
    return {
      continue: false,
      profit: isNormalTransac
        ? storedValue - prices[currentIndex]
        : prices[currentIndex] - storedValue,
    };

  return { continue: true, moveToIndex: currentIndex + 1 };
}
