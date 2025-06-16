"use client";

import { AuthComponentProps, AuthLoginType, AuthSignUpType } from "@/types";
import { Eye, EyeClosed, TriangleAlert, X } from "lucide-react";
import {
  ChangeEvent,
  FC,
  FormEvent,
  ReactElement,
  useRef,
  useState,
} from "react";
import { useNotification } from "./provider/notificationProvider";
// import { Validate } from "@/util/helper_function/frontEndValidation";

export const SignUp: FC<AuthComponentProps> = ({
  setIsSignUp,
}): ReactElement => {
  const [isHiddenPass, setIsHiddenPass] = useState<boolean>(true);
  const [isHiddenConPass, setIsHiddenConPass] = useState<boolean>(true);
  const { handleSetNotification } = useNotification();
  console.log("SignUp component rendered");

  const [authVal, setAuthVal] = useState<AuthSignUpType>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleAuthVal = (e: ChangeEvent<HTMLInputElement>): void => {
    setAuthVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // const errors = Validate(authVal);
    // if (errors.errors.length > 0) return handleSetNotification(errors.errors);

    try {
      const req = await fetch(`/api/userAuth/signup`, {
        method: "POST",
        body: JSON.stringify({
          username: authVal.username,
          password: authVal.password,
        }),
      });

      const data = await req.json();

      switch (req.status) {
        case 201:
          handleSetNotification([{ message: data.message, type: "success" }]);
          break;
        case 409:
          handleSetNotification([{ message: data.message, type: "warning" }]);
          break;
        case 500:
          handleSetNotification([{ message: data.message, type: "error" }]);
          break;
      }
    } catch (error) {
      const err = error as Error;
      handleSetNotification([
        { message: err.message as string, type: "error" },
      ]);
    }
  };

  return (
    <div className="auth_form">
      <h1>Mag Gawa ng Account</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="space-y-2">
          <label>Username:</label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={authVal.username}
              onChange={handleAuthVal}
              placeholder="Farmer1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label>Password:</label>
          <div className="relative">
            <input
              type={isHiddenPass ? "password" : "text"}
              name="password"
              value={authVal.password}
              onChange={handleAuthVal}
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
              value={authVal.confirmPassword}
              onChange={handleAuthVal}
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

        <button type="submit">Ipasa</button>
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

export const LogIn: FC<AuthComponentProps> = ({
  setIsSignUp,
}): ReactElement => {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [authVal, setAuthVal] = useState<AuthLoginType>({
    username: "",
    password: "",
  });

  console.log("LogIn component rendered");

  const handleAuthVal = (e: ChangeEvent<HTMLInputElement>): void => {
    setAuthVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: FormEvent): void => {
    e.preventDefault();

    // const checkVal = Validate(authVal);
  };

  return (
    <div className="auth_form">
      <h1>Mag Log In</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="space-y-2">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            onChange={handleAuthVal}
            value={authVal.username}
            placeholder="Farmer1"
          />
        </div>

        <div className="space-y-2">
          <label>Password:</label>
          <div className="relative">
            <input
              type={isHidden ? "password" : "text"}
              name="password"
              onChange={handleAuthVal}
              value={authVal.password}
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
export const ModalNotif: FC = (): ReactElement => {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="absolute inset-0 z-30 flex justify-center items-center bg-black/50 backdrop-blur-sm overflow-hidden "
      ref={modalRef}
    >
      <div className="bg-white border border-gray-800 rounded-lg shadow-xl w-[90%] max-w-md transform transition-all overflow-hidden animate-toLeft">
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
          <h4 className="font-medium mb-4">
            Ang iyong username at password ay dapat may:
          </h4>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-gray-600">
              <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
              <span>Hindi bababa sa 8 letra o numero</span>
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
              <span>Kahit isang malaking letra (A-Z)</span>
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
  );
};

// an eye logo function that recieve a prop that has a value of true or false and returns an eye icon between open and closed base on that prop value
const EyeLogo: FC<{ isHidden: boolean }> = ({ isHidden }): ReactElement => {
  return <>{isHidden ? <EyeClosed /> : <Eye />}</>;
};
