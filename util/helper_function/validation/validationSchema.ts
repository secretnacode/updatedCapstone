import { z } from "zod/v4";
import {
  Date10YearsAgo,
  FourDaysBefore,
  MaxDateToday,
} from "../reusableFunction";
// /**
//  * trasnforming the value data type that zod expects(string)
//  */
// const toString = z.string().pipe(
//   z.preprocess((val) => {
//     if (val === null || val === undefined) return "";
//     if (val instanceof File) return undefined;
//     return String(val).trim();
//   }, z.string())
// );

// /**
//  * trasnforming the value data type that zod expects(number)
//  */
// const toNumber = z.preprocess((val) => {
//   if (typeof val === "string" && val.trim() === "") return undefined;
//   else if (val === null || val === undefined) return undefined;
//   else if (val instanceof File) return undefined;

//   return isNaN(Number(val)) ? undefined : Number(val);
// }, z.number());

// /**
//  * trasnforming the value data type that zod expects(date object)
//  */
// const toDateObj = z.preprocess((val) => {
//   if (typeof val === "string" && val.trim() !== "") {
//     const date = new Date(val);
//     return isNaN(date.getTime()) ? undefined : date;
//   }
//   return undefined;
// }, z.date());

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
    confirmPassword: z.string(),
  })
  // like a conditional statement that compares the value of confirmPassword and password that was define, and will return the message if there's an error, the error will be returned base on the value that you put in the path
  .refine((data) => data.confirmPassword === data.password, {
    message: `Ang password mo at ang nilagay mo sa confirm password ay hindi tugma`,
    path: ["confirmPassword"],
  });

/**
 * A schema for auth login where it only defines the type of object, {username: string, password: string}
 */
export const authLogInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

/**
 * a schema for validating farmer details form after a new farmer has signed up
 */
export const farmerFirstDetailFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: `Ilagay ang iyong unang pangalan` })
    .max(50, {
      message: `Limangpu pababa lamang ang pede mong mailagay sa una mong Pangalan`,
    }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: `Ilagay ang iyong apelyido` })
    .max(50, {
      message: `Limangpu pababa lamang ang pede mong mailagay sa iyong Apelyido`,
    }),
  alias: z
    .string()
    .transform((e) => (e === "" ? null : e))
    .nullable(),
  mobileNumber: z
    .string()
    .trim()
    .max(13, {
      message: `Ang numero mo ay hindi dapat tataas sa labing tatlong(13) na numero`,
    })
    .refine(
      (val) =>
        /^\+?\d+$/.test(val) &&
        ((val.startsWith("+639") && val.length === 13) ||
          (val.startsWith("09") && val.length === 11)),
      {
        message: `Gumamit ng wastong Philippine mobile number format (hal. 09xxxxxxxxx o +639xxxxxxxxx)`,
      }
    ),
  birthdate: z.coerce
    .date({ message: `Ilagay ang araw ng iyong kapanganakan` })
    .max(Date10YearsAgo(), {
      message: `Dapat ang edad mo ay mas mahigit pa sa sampu(10)`,
    }),
  farmerBarangay: z
    .string()
    .min(1, { message: `Ilagay ang iyong barangay ng tinitirhan` }),
});

/**
 * a zod schema for validating the 2nd detail of the farmer after the sign up
 */
export const farmerSecondDetailFormSchema = z
  .object({
    organization: z
      .string()
      .trim()
      .min(1, { error: "Pumili ng organisasyon kung san ka kasali" }),
    otherOrg: z
      .string()
      .trim()
      .transform((e) => (e === "" ? null : e))
      .nullable(),
    cropFarmArea: z
      .string()
      .trim()
      .min(1, { error: "Mag lagay ng lawak ng iyong pinag tataniman" })
      .refine((e) => !isNaN(Number(e)) && Number(e) > 0, {
        error:
          "Dapat ang inilagay mo ay numero lamang o mas mataas sa 0 na sukat",
      }),
    farmAreaMeasurement: z
      .string()
      .min(1, { error: "Pumili ng unit ng lupain" }),
    cropBaranggay: z.string().trim().min(1, {
      error: "Pumili ng baranggay kung saan ang lugar ng iyong pinagtataniman",
    }),
  })
  .refine(
    (data) => {
      if (data.organization === "other" && !data.otherOrg) return false;

      return true;
    },
    {
      error:
        "Mag lagay ng organisasyon kung san ka kasali kung wala sa pamimilian ang organisasyon na kasali ka",
      path: ["otherOrg"],
    }
  );

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"];
export const addFarmerReportSchema = z.object({
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
    })
    .min(new Date(FourDaysBefore()), {
      error: "Ang maaari mo lang iulat ay yung mga nakaraang apat na araw",
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

export const addFileSchema = z.object;
