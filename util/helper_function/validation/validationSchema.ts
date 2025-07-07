import { z } from "zod/v4";

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

export const farmerDetailFormSchema = 
