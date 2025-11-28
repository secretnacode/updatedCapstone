"use client";

import {
  AuthLoginType,
  AuthSignUpType,
  ErrorResponseType,
  FormErrorType,
} from "@/types";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { TriangleAlert, X } from "lucide-react";
import { useNotification } from "./provider/notificationProvider";
import { agriSignIn, LoginAuth, SignUpAuth } from "@/lib/server_action/auth";
import { useLoading } from "./provider/loadingProvider";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { SignIn, SignUp, useAuth, useUser } from "@clerk/nextjs";
import {
  AuthInputPass,
  ClerkModalLoading,
  FormDivLabelInput,
} from "../server_component/customComponent";
import { UnexpectedErrorMessageEnglish } from "@/util/helper_function/reusableFunction";

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
          <FarmerSignUp setIsSignUp={setIsSignUp} />
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
const FarmerSignUp: FC<{ setIsSignUp: Dispatch<SetStateAction<boolean>> }> = ({
  setIsSignUp,
}): ReactElement => {
  const { handleSetNotification } = useNotification();
  const { isLoading, handleIsLoading, handleDoneLoading } = useLoading();
  const [hideText, setHideText] = useState({ pass: true, confirmPass: true });
  const [formError, setFormError] = useState<FormErrorType<AuthSignUpType>>();
  const [authVal, setAuthVal] = useState<AuthSignUpType>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChangeVal = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    try {
      e.preventDefault();
      handleIsLoading("Inihahanda na ang iyong account");

      const req = await SignUpAuth(authVal);

      if (req.formError) setFormError(req.formError);

      handleSetNotification(req.notifError);
    } catch (error) {
      if (!isRedirectError(error)) {
        const err = error as ErrorResponseType;
        handleSetNotification(err.errors);
      }
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <div className="auth_form">
      <h1>Maggawa ng Account</h1>
      <form onSubmit={handleFormSubmit}>
        <FormDivLabelInput
          labelMessage={"Username:"}
          inputName={"username"}
          inputPlaceholder="Farmer1"
          inputRequired
          inputValue={authVal.username}
          onChange={handleChangeVal}
          formError={formError?.username}
        />

        <AuthInputPass
          label="Password:"
          isHidden={hideText.pass}
          setIsHidden={() =>
            setHideText((prev) => ({ ...prev, pass: !prev.pass }))
          }
          name="password"
          placeholder="FarmerPass123"
          value={authVal.password}
          onChange={handleChangeVal}
          formError={formError?.password}
          required
        />

        <AuthInputPass
          label="Kumpirmahin ang Password:"
          isHidden={hideText.confirmPass}
          setIsHidden={() =>
            setHideText((prev) => ({ ...prev, confirmPass: !prev.confirmPass }))
          }
          name="confirmPassword"
          placeholder="FarmerPass123"
          value={authVal.confirmPassword}
          onChange={handleChangeVal}
          formError={formError?.confirmPassword}
          required
        />

        <button type="submit">Ipasa</button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        May account na?{" "}
        <button
          type="button"
          onClick={() => setIsSignUp(false)}
          disabled={isLoading ? true : false}
        >
          Mag-log in
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
  const { handleSetNotification } = useNotification();
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const { isLoading, handleIsLoading, handleDoneLoading } = useLoading();
  const [formError, setFormError] = useState<FormErrorType<AuthLoginType>>();
  const [authVal, setAuthVal] = useState<AuthLoginType>({
    username: "",
    password: "",
  });

  const handleChangeVal = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      handleIsLoading("Sinusuri lang ang iyong username at password");

      const res = await LoginAuth(authVal);

      console.log(res);

      if (res.formError) setFormError(res.formError);

      handleSetNotification(res.notifError);
    } catch (error) {
      if (!isRedirectError(error)) {
        const err = error as ErrorResponseType;
        handleSetNotification(err.errors);
      }
    } finally {
      handleDoneLoading();
    }
  };

  return (
    <div className="auth_form">
      <h1>Mag-Log In</h1>
      <form onSubmit={handleFormSubmit}>
        <FormDivLabelInput
          labelMessage={"Username:"}
          inputName={"username"}
          inputPlaceholder="Farmer1"
          inputRequired
          inputValue={authVal.username}
          onChange={handleChangeVal}
          formError={formError?.username}
        />

        <AuthInputPass
          label="Password:"
          isHidden={isHidden}
          setIsHidden={() => setIsHidden((prev) => !prev)}
          name="password"
          placeholder="FarmerPass123"
          value={authVal.password}
          onChange={handleChangeVal}
          formError={formError?.password}
          required
        />

        <button type="submit">IPASA</button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Wala pang account?{" "}
        <button
          type="button"
          onClick={() => setIsSignUp(true)}
          disabled={isLoading ? true : false}
        >
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
        <div className="modal-form" ref={modalRef}>
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
                  <span>Hindi bababa sa walong(8) karakter</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Mga letra at numero lamang</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Kahit isang malaking letra (A-Z)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Kahit isang maliit letra (a-z)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Kahit isang numero (0-9)</span>
                </li>
              </ul>

              <h4 className="font-medium mb-2">
                Ang iyong <span className="font-semibold">password</span> ay
                dapat may:
              </h4>
              <ul className="space-y-3 mb-6 ml-3">
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Hindi bababa sa walong(8) karakter</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Kahit isang malaking letra (A-Z)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                  <span>Kahit isang maliit letra (a-z)</span>
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
                  <span>Kapareho ng inilagay mo sa password</span>
                </li>
              </ul>

              {/* Action Button */}
              <button
                onClick={() => modalRef.current?.classList.add("!hidden")}
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

/**
 * component to validate the agticulturist account and if validated will be redirected to the agriculturist page
 * @returns
 */
export const AgriAuth: FC = () => {
  const { signOut } = useAuth();
  const { isSignedIn, user } = useUser();
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();

  console.log("start");

  useEffect(() => {
    if (!isSignedIn || !user?.primaryEmailAddress) return;

    const email = user.primaryEmailAddress.emailAddress;

    const userAuth = async () => {
      try {
        handleIsLoading("Redirecting!!!");

        const res = await agriSignIn(user.id, email);

        console.log("middle");
        if (!res.success) return await signOut();

        handleSetNotification(res.notifMessage);
      } catch (error) {
        if (!isRedirectError(error)) {
          const err = error as Error;
          console.error(err.message);

          handleSetNotification([
            { message: UnexpectedErrorMessageEnglish(), type: "error" },
          ]);
        }
      } finally {
        handleDoneLoading();

        console.log("end");
      }
    };

    userAuth();
  }, [
    isSignedIn,
    user,
    handleIsLoading,
    handleDoneLoading,
    handleSetNotification,
    signOut,
  ]);

  return null;
};

export const AgriSignUp: FC = () => {
  const { isLoaded } = useAuth();

  return <>{isLoaded ? <SignUp /> : <ClerkModalLoading />}</>;
};

export const AgriSignIn = () => {
  const { isLoaded } = useAuth();

  return (
    <>{isLoaded ? <SignIn signUpUrl={undefined} /> : <ClerkModalLoading />}</>
  );
};
