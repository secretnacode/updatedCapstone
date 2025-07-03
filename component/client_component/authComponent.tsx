"use client";

import {
  AuthLoginType,
  AuthResponseType,
  AuthSignUpType,
  ErrorResponseType,
  NotificationBaseType,
  ValidateAuthValType,
} from "@/types";
import {
  Dispatch,
  FC,
  FormEvent,
  ReactElement,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { Eye, EyeClosed, TriangleAlert, X } from "lucide-react";
import { useNotification } from "./provider/notificationProvider";
import {
  ValidateLoginVal,
  ValidateSingupVal,
} from "@/util/helper_function/validation/frontendValidation/authvalidation";
import { useRouter } from "next/navigation";
import { LoginAuth, SignUpAuth } from "@/lib/server_action/auth";

/**
 * Auth form component that renders the login form(default) or the sign up form
 * @returns login form component by default but can be change into sign up form component if toggled
 */
export const AuthForm: FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  return (
    <>
      {isSignUp ? (
        <>
          <SignUp setIsSignUp={setIsSignUp} />
          <ModalNotif isSignUp={isSignUp} />
        </>
      ) : (
        <LogIn setIsSignUp={setIsSignUp} />
      )}
    </>
  );
};

/**
 * sign up form for the new user that wants to create a new account
 * @param setIsSignUp a useState function that change the value of isSignUp in the parent component that renders what form will be shown
 * @returns sign up component
 */
const SignUp: FC<{ setIsSignUp: Dispatch<SetStateAction<boolean>> }> = ({
  setIsSignUp,
}): ReactElement => {
  const [isHiddenPass, setIsHiddenPass] = useState<boolean>(true);
  const [isHiddenConPass, setIsHiddenConPass] = useState<boolean>(true);
  const { handleSetNotification } = useNotification();
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const router = useRouter();

  const handleFormSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const authVal: AuthSignUpType = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    console.log(authVal);

    setIsSubmiting(true);

    const err: ValidateAuthValType<NotificationBaseType[]> =
      ValidateSingupVal(authVal);

    if (!err.valid) {
      setIsSubmiting(false);
      return handleSetNotification(err.errors as NotificationBaseType[]);
    }

    try {
      const req = await SignUpAuth(authVal);

      if (!req.success) throw req;

      router.push(`${req.url}`);
    } catch (error) {
      const err = error as ErrorResponseType;
      handleSetNotification(err.errors);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="auth_form">
      <h1>Mag Gawa ng Account</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="space-y-2">
          <label>Username:</label>
          <div className="relative">
            <input type="text" name="username" placeholder="Farmer1" />
          </div>
        </div>

        <div className="space-y-2">
          <label>Password:</label>
          <div className="relative">
            <input
              type={isHiddenPass ? "password" : "text"}
              name="password"
              placeholder="FarmerPass1"
              className=" pr-10"
            />
            <button
              type="button"
              onClick={() => setIsHiddenPass((prev) => !prev)}
            >
              <EyeLogo isHidden={isHiddenPass} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label>Kumpirmahin ang Password:</label>
          <div className="relative">
            <input
              type={isHiddenConPass ? "password" : "text"}
              name="confirmPassword"
              placeholder="FarmerConfirmPass1"
              className=" pr-10"
            />
            <button
              type="button"
              onClick={() => setIsHiddenConPass((prev) => !prev)}
            >
              <EyeLogo isHidden={isHiddenConPass} />
            </button>
          </div>
        </div>

        <button type="submit" disabled={isSubmiting ? true : false}>
          Ipasa
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        May account na?{" "}
        <button type="button" onClick={() => setIsSignUp(false)}>
          Mag log in
        </button>
      </p>
    </div>
  );
};

/**
 * login form for the user that wants to login
 * @param setIsSignUp a useState function that change the value of isSignUp in the parent component that renders what form will be shown
 * @returns login component
 */
const LogIn: FC<{ setIsSignUp: Dispatch<SetStateAction<boolean>> }> = ({
  setIsSignUp,
}): ReactElement => {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const { handleSetNotification } = useNotification();
  const route = useRouter();

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDate = new FormData(e.currentTarget);

    const authVal: AuthLoginType = {
      username: formDate.get("username") as string,
      password: formDate.get("password") as string,
    };

    const checkVal: ValidateAuthValType<NotificationBaseType[]> =
      ValidateLoginVal(authVal);

    if (!checkVal.valid) return handleSetNotification(checkVal.errors);

    try {
      const req: AuthResponseType = await LoginAuth(authVal);

      if (!req.success) throw req;

      route.push(`${req.url}`);
    } catch (error) {
      const err = error as ErrorResponseType;
      handleSetNotification(err.errors);
    }
  };

  return (
    <div className="auth_form">
      <h1>Mag Log In</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="space-y-2">
          <label>Username:</label>
          <input type="text" name="username" placeholder="Farmer1" />
        </div>

        <div className="space-y-2">
          <label>Password:</label>
          <div className="relative">
            <input
              type={isHidden ? "password" : "text"}
              name="password"
              placeholder="FarmerPass1"
              className=" pr-10"
            />
            <button type="button" onClick={() => setIsHidden((prev) => !prev)}>
              <EyeLogo isHidden={isHidden} />
            </button>
          </div>
        </div>

        <button type="submit">IPASA</button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Wala pang account?{" "}
        <button type="button" onClick={() => setIsSignUp(true)}>
          Gumawa
        </button>
      </p>
    </div>
  );
};

// a modal component that will be shown if the form that is currently showing is the SignUp form
const ModalNotif: FC<{
  isSignUp: boolean;
}> = ({ isSignUp }): ReactElement => {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {isSignUp && (
        <div
          className="absolute inset-0 z-30 flex justify-center items-center bg-black/50 backdrop-blur-sm overflow-hidden "
          ref={modalRef}
        >
          <div className="bg-white border border-gray-800 rounded-lg shadow-xl w-[80%] max-w-[420px] transform transition-all overflow-hidden animate-toLeft">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-yellow-50">
              <div className="flex items-center gap-2">
                <TriangleAlert className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Importanteng Paalala
                </h3>
              </div>
              <button
                onClick={() => modalRef.current?.classList.add("hidden")}
                className="p-1  hover:bg-yellow-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <h4 className="font-medium mb-2">
                Ang iyong <span className="font-semibold">username</span> ay
                dapat may:
              </h4>
              <ul className="space-y-3 mb-6 ml-3">
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Hindi bababa sa 8 letra o numero</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Letra at Numero lamang ang laman</span>
                </li>
              </ul>

              <h4 className="font-medium mb-2">
                Ang iyong <span className="font-semibold">password</span> ay
                dapat may:
              </h4>
              <ul className="space-y-3 mb-6 ml-3">
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Hindi bababa sa 8 letra o numero</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Kahit isang malaking na letra (A-Z)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Kahit isang maliit na letra (a-z)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Kahit isang numero (0-9)</span>
                </li>
              </ul>

              <h4 className="font-medium mb-2">
                Ang iyong{" "}
                <span className="font-semibold">confirm password</span> ay
                dapat:
              </h4>
              <ul className="space-y-3 mb-6 ml-3">
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Kaparehas ng inilagay mo sa password</span>
                </li>
              </ul>

              {/* Action Button */}
              <button
                onClick={() => modalRef.current?.classList.add("hidden")}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2.5 px-4 rounded-lg cursor-pointer transition-colors"
              >
                Naintindihan ko
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// an eye logo function that recieve a prop that has a value of true or false and returns an eye icon between open and closed base on that prop value
const EyeLogo: FC<{ isHidden: boolean }> = ({ isHidden }): ReactElement => {
  return <>{isHidden ? <EyeClosed /> : <Eye />}</>;
};
