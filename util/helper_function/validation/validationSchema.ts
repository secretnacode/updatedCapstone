import { z } from "zod/v4";
import {
  Date10YearsAgo,
  MaxDateToday,
  pointIsInsidePolygon,
} from "../reusableFunction";
import { barangayType, plantedCrop } from "@/types";

/**
 * Defining the object/shape of the auth sign up by adding its
 * type and other required fields like minimum and maximum characters
 * in username and the required characters in password, this will be
 * used for validation
 */
export const authSignUpSchema = z
  .object({
    username: z
      .string()
      .min(8, {
        message: `Ang username mo dapat ay may walo(8) na letra o pataas`,
      })
      .max(50, {
        message: `Ang username mo dapat ay limangpu(50) na letra o pababa`,
      })
      .regex(/[a-zA-Z0-9]/, {
        message: `Ang laman ng username mo dapat ay mga letra at numero lamang`,
      })
      .regex(/[a-z]/, {
        message: `Lagyan ng kahit isang maliit na letra (a-z) ang iyong password`,
      })
      .regex(/[A-Z]/, {
        message: `Lagyan ng kahit isang malaki na letra (A-Z) ang iyong password`,
      })
      .regex(/[0-9]/, {
        message: `Lagyan ng kahit isang numero (0-9) ang iyong password`,
      }),
    password: z
      .string()
      .min(8, { message: `And password mo dapat ay walo(8) na letra pataas` })
      .regex(/[a-z]/, {
        message: `Lagyan ng kahit isang maliit na letra (a-z) ang iyong password`,
      })
      .regex(/[A-Z]/, {
        message: `Lagyan ng kahit isang malaki na letra (A-Z) ang iyong password`,
      })
      .regex(/[0-9]/, {
        message: `Lagyan ng kahit isang numero (0-9) ang iyong password`,
      }),
    confirmPassword: z
      .string()
      .min(8, { message: `Ilagay ulit ang password mo` }),
  })
  // like a conditional statement that compares the value of confirmPassword and password that was define, and will return the message if there's an error, the error will be returned base on the value that you put in the path
  .refine((data) => data.confirmPassword === data.password, {
    message: `Ang password mo at ang nilagay mo sa confirm password ay hindi tugma`,
    path: ["password", "confirmPassword"],
  });

/**
 * A schema for auth login where it only defines the type of object, {username: string, password: string}
 */
export const authLogInSchema = z.object({
  username: z.string().min(1, {
    message: `Ang username mo dapat ay may walo(8) na letra o pataas`,
  }),
  password: z.string().min(1, {
    message: `Ang username mo dapat ay may walo(8) na letra o pataas`,
  }),
});

/**
 * a schema for validating farmer details form after a new farmer has signed up
 */
export const farmerFirstDetailFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { error: `Ilagay ang iyong unang pangalan` })
      .max(50, {
        error: `Limangpu pababa lamang ang pede mong mailagay sa una mong Pangalan`,
      }),
    middleName: z
      .string()
      .trim()
      .min(1, { error: `Ilagay ang iyong gitnang pangalan` })
      .max(50, {
        error: `Limangpu pababa lamang ang pede mong mailagay sa gitna mong Pangalan`,
      }),
    lastName: z
      .string()
      .trim()
      .min(1, { error: `Ilagay ang iyong apelyido` })
      .max(50, {
        error: `Limangpu pababa lamang ang pede mong mailagay sa iyong Apelyido`,
      }),
    extensionName: z
      .string()
      .trim()
      .transform((e) => (e === "" ? null : e))
      .nullable(),
    alias: z
      .string()
      .trim()
      .transform((e) => (e === "" ? null : e))
      .nullable(),
    mobileNumber: z
      .string()
      .trim()
      .max(13, {
        error: `Ang numero mo ay hindi dapat tataas sa labing tatlong(13) na numero`,
      })
      .refine(
        (val) =>
          /^\+?\d+$/.test(val) &&
          ((val.startsWith("+639") && val.length === 13) ||
            (val.startsWith("09") && val.length === 11)),
        {
          error: `Gumamit ng wastong Philippine mobile number format (hal. 09xxxxxxxxx/+639xxxxxxxxx)`,
        }
      ),
    birthdate: z.coerce
      .date({ error: `Ilagay ang araw ng iyong kapanganakan` })
      .max(Date10YearsAgo(), {
        error: `Dapat ang edad mo ay mas mahigit pa sa sampu(10)`,
      }),
    farmerBarangay: z
      .string()
      .trim()
      .min(1, { error: `Ilagay ang iyong barangay ng tinitirhan` }),
    countFamilyMember: z
      .string()
      .trim()
      .min(1, { error: "Mag lagay kung ilang ang bilang ng iyon pamilya" })
      .refine((e) => !isNaN(Number(e)) && Number(e) > 0, {
        error:
          "Numero o mas ma-mataas sa zero(0) lang ang pwede mong ilagay dito",
      }),
    organization: z
      .string()
      .trim()
      .min(1, { error: "Mag lagay ng organisasyon kung san ka kasali" }),
    newOrganization: z
      .string()
      .trim()
      .transform((e) => (e === "" ? null : e))
      .nullable(),
  })
  .refine(
    (e) =>
      e.organization !== "other" ||
      (e.organization === "other" && e.newOrganization),
    {
      error: "Mag lagay ng organisasyon na ikaw ang kasali",
      path: ["newOrganization"],
    }
  );

export const farmerSecondDetailFormSchema = z
  .object({
    cropId: z.string().trim().min(1, { error: "The CropId is missing" }),
    cropName: z.string().trim().min(1, {
      error: "Mag lagay ng pangalan na sumisimbulo sa pananim nato",
    }),
    cropFarmArea: z
      .string()
      .trim()
      .min(1, { error: "Mag lagay ng lawak ng iyong pinag tataniman" })
      .refine((e) => !isNaN(Number(e)) && Number(e) > 0, {
        error:
          "Dapat ang inilagay mo ay numero lamang o mas mataas sa 0 na sukat",
      }),
    cropBaranggay: z.string().trim().min(1, {
      error: "Pumili ng baranggay kung saan ang lugar ng iyong pinagtataniman",
    }),
    cropCoor: z.object({
      lng: z.coerce
        .number({ error: "Numero lng ang pede mong mailagay dito" })
        .refine((e) => !isNaN(Number(e)), {
          error:
            "Numero lang ang pwedeng maging value ng coordinates ng iyong pananim",
          path: ["cropCoor"],
        }),
      lat: z.coerce
        .number({ error: "Numero lng ang pede mong mailagay dito" })
        .refine((e) => !isNaN(Number(e)), {
          error:
            "Numero lang ang pwedeng maging value ng coordinates ng iyong pananim",
          path: ["cropCoor"],
        }),
    }),
  })
  .refine((e) => e.cropCoor.lng !== 0 || e.cropCoor.lat !== 0, {
    error: "Markahan ang lugar kung asaan ang iyong pananim",
    path: ["cropCoor"],
  })
  .refine(
    (e) =>
      (e.cropCoor.lng !== 0 || e.cropCoor.lat !== 0) &&
      pointIsInsidePolygon(
        e.cropCoor.lng,
        e.cropCoor.lat,
        e.cropBaranggay as barangayType
      ),
    {
      error: "Markahan lamang ang barangay na may kulay",
      path: ["cropCoor"],
    }
  );

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"];
export const REPORT_TYPE = ["damage", "harvesting", "planting"] as const;
// to change the value of this, change the value of the REPORT_TYPE first
const farmerBaseReportSchema = z.object({
  cropId: z.string().min(1, { error: "Pumili ng pananim na iuulat" }),
  reportTitle: z
    .string()
    .min(1, { error: "Mag lagay ng pamagat ng iyong iuulat" })
    .max(100, { error: "Iklian ang iyong pamagat, ito ay masyadong mahaba" }),
  reportDescription: z
    .string()
    .min(1, { error: "Mag lagay ng maikling paglalarawan ng iyong iuulat" }),
  dateHappen: z.coerce
    .date({ error: "Mag lagay kung kelan nangyari itong kaganapan" })
    .max(new Date(MaxDateToday()), {
      error:
        "Hanggang ngayon lang ang pinakang mataas na date na pede mong mailagay",
    }),
  reportType: z.enum([...REPORT_TYPE], {
    error:
      "Ang puwede mo lamang ipasang ulat ay patungkol sa pagkasira, pag tatanim, at pag aani ng iyong tanim",
  }),
  reportPicture: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          error: "Masyadong malaki ang ipinasa mong ",
        })
        .refine((file) => acceptedFileTypes.includes(file.type), {
          error:
            "Ang pede mo lng ilagay ay mga imaheng may format na .jpg, .jpeg, at .png",
        })
    )
    .min(1, { error: "Mag lagay kahit isang imahe" })
    .max(5, { error: "Hanggang limang(5) imahe lang ang pede mong maipasa" }),
});

// additional object for report type planting
export const addPlantingReportSchema = farmerBaseReportSchema.extend({
  cropType: z.enum([...plantedCrop], {
    error: "Pumili kung anong uri ng pananim ang iyong itatanim",
  }),
});

// additional object for report type damage
export const addDamageReportSchema = farmerBaseReportSchema
  .extend({
    totalDamageArea: z
      .string()
      .trim()
      .transform((e) => (e === "" ? null : e))
      .nullable(),
    allDamage: z.boolean(),
  })
  .refine((val) => (!val.allDamage && val.totalDamageArea) || val.allDamage, {
    error: "Ilagay kung gano kalaki ang nasira sa iyong pananim",
    path: ["totalDamageArea"],
  })
  .refine(
    (val) =>
      !val.totalDamageArea ||
      (!val.allDamage &&
        val.totalDamageArea &&
        (!isNaN(Number(val.totalDamageArea)) ||
          Number(val.totalDamageArea) > 0)),
    {
      error: "Numero lamang ang pwede mong mailagay dito",
      path: ["totalDamageArea"],
    }
  );

// additional object for report type harvesting
export const addHarvestingReportSchema = farmerBaseReportSchema.extend({
  totalHarvest: z
    .number()
    .min(1, { error: "Mag lagay kung gano kadami ang naani(kg)" }),
});

export const userProfileInfoUpdateSchema = z.object({
  farmerId: z.string().min(1, { error: "Ilagay ang iyong unang pangalan" }),
  farmerFirstName: z
    .string()
    .min(1, { error: "Ilagay ang iyong unang pangalan" }),
  farmerLastName: z.string().min(1, { error: "Ilagay ang iyong apelyido" }),
  farmerMiddleName: z
    .string()
    .min(1, { error: "Ilagay ang iyong gitnang pangalan" }),
  farmerExtensionName: z.string().nullable(),
  farmerAlias: z.string().nullable(),
  mobileNumber: z
    .string()
    .trim()
    .max(13, {
      error: `Ang numero mo ay hindi dapat tataas sa labing tatlong(13) na numero`,
    })
    .refine(
      (val) =>
        /^\+?\d+$/.test(val) &&
        ((val.startsWith("+639") && val.length === 13) ||
          (val.startsWith("09") && val.length === 11)),
      {
        error: `Gumamit ng wastong Philippine mobile number format (hal. 09xxxxxxxxx/+639xxxxxxxxx)`,
      }
    ),
  barangay: z
    .string()
    .min(1, { error: "Ilagay kung san ka nakatira, pumili sa pamimilian" }),
  birthdate: z
    .date({ error: `Ilagay ang araw ng iyong kapanganakan` })
    .max(Date10YearsAgo(), {
      error: `Dapat ang edad mo ay mas mahigit pa sa sampu(10)`,
    }),
  familyMemberCount: z
    .string()
    .trim()
    .min(1, { error: "Mag lagay kung ilang ang bilang ng iyon pamilya" })
    .refine((e) => !isNaN(Number(e)) && Number(e) > 0, {
      error:
        "Numero o mas ma-mataas sa zero(0) lang ang pwede mong ilagay dito",
    }),
});

export const userProfileOrgUpdateSchema = z
  .object({
    orgId: z.string().min(1, { error: "Pumili ng organisasyon" }),
    otherOrgName: z
      .string()
      .transform((e) => (e === "" ? null : e))
      .nullable(),
  })
  .refine(
    (e) => e.orgId !== "other" || (e.orgId === "other" && e.otherOrgName),
    {
      error:
        "Kung wala ang organisasyon sa pamimilian, Ilagay ang pangalan ng organisasyon na ikaw ay kasali",
      path: ["otherOrgName"],
    }
  );

export const changePasswordSchema = z
  .object({
    currentPass: z
      .string()
      .min(1, { error: "Ilagay kung ano ang kasalukuyan mong password" }),
    newPass: z
      .string()
      .min(1, { error: "Ilagay kung ano ang panibago mong password" })
      .regex(/[a-z]/, {
        message: `Lagyan ng kahit isang maliit na letra (a-z) ang iyong password`,
      })
      .regex(/[A-Z]/, {
        message: `Lagyan ng kahit isang malaki na letra (A-Z) ang iyong password`,
      })
      .regex(/[0-9]/, {
        message: `Lagyan ng kahit isang numero (0-9) ang iyong password`,
      }),
    confirmNewPass: z
      .string()
      .min(1, { error: "Ilagay ulit kung ano ang panibago mong password" })
      .regex(/[a-z]/, {
        message: `Lagyan ng kahit isang maliit na letra (a-z) ang iyong password`,
      })
      .regex(/[A-Z]/, {
        message: `Lagyan ng kahit isang malaki na letra (A-Z) ang iyong password`,
      })
      .regex(/[0-9]/, {
        message: `Lagyan ng kahit isang numero (0-9) ang iyong password`,
      }),
  })
  .refine((data) => data.newPass === data.confirmNewPass, {
    error:
      "Ang password mo at ang nilagay mo sa confirm password ay hindi tugma",
    path: ["newPass", "confirmNewPass"],
  });

export const resetPasswordSchema = z
  .object({
    newPass: z
      .string()
      .min(1, { error: "Ilagay kung ano ang panibago mong password" })
      .regex(/[a-z]/, {
        message: `Lagyan ng kahit isang maliit na letra (a-z) ang iyong password`,
      })
      .regex(/[A-Z]/, {
        message: `Lagyan ng kahit isang malaki na letra (A-Z) ang iyong password`,
      })
      .regex(/[0-9]/, {
        message: `Lagyan ng kahit isang numero (0-9) ang iyong password`,
      }),
    confirmNewPass: z
      .string()
      .min(1, { error: "Ilagay ulit kung ano ang panibago mong password" })
      .regex(/[a-z]/, {
        message: `Lagyan ng kahit isang maliit na letra (a-z) ang iyong password`,
      })
      .regex(/[A-Z]/, {
        message: `Lagyan ng kahit isang malaki na letra (A-Z) ang iyong password`,
      })
      .regex(/[0-9]/, {
        message: `Lagyan ng kahit isang numero (0-9) ang iyong password`,
      }),
  })
  .refine((data) => data.newPass === data.confirmNewPass, {
    error:
      "Ang password mo at ang nilagay mo sa confirm password ay hindi tugma",
    path: ["newPass", "confirmNewPass"],
  });
