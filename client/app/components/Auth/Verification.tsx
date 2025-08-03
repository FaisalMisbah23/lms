"use client";

import { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { FiShield, FiArrowLeft } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useActivationMutation } from "@/redux/features/auth/authApi";

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error, data }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  // handle api response
  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Account activated successfully!");
      setRoute("Login");
    }
    if (error) {
      const errorData = error as any;
      if ("data" in error) {
        toast.error(errorData.data.message);
      } else {
        toast.error("An unexpected error occurred!");
      }
      setInvalidError(true); // trigger shake effect
    }
  }, [isSuccess, error, data, setRoute]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  // handle otp verification
  const verifyHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true); // trigger shake effect for incomplete code
      return;
    }

    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  // handle input change and focus management
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false); // reset error state on valid input
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
          <FiShield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Verify Your Account
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          We've sent a verification code to your email
        </p>
      </div>

      {/* Verification Icon */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <VscWorkspaceTrusted size={32} className="text-primary sm:w-10 sm:h-10" />
        </div>
      </div>

      {/* OTP Input Fields */}
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
            Enter the 4-digit code sent to your email
          </p>
        </div>
        
        <div className="flex justify-center space-x-2 sm:space-x-3">
          {Object.keys(verifyNumber).map((key, index) => (
            <input
              key={key}
              type="text"
              ref={inputRefs[index]}
              className={`w-12 h-12 sm:w-16 sm:h-16 text-center text-lg sm:text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                invalidError
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20 animate-shake"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              }`}
              value={verifyNumber[key as keyof VerifyNumber]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              maxLength={1}
              placeholder=""
            />
          ))}
        </div>

        {invalidError && (
          <div className="text-center">
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
              Please enter a valid 4-digit code
            </p>
          </div>
        )}
      </div>

      {/* Verify Button */}
      <div className="mt-6 sm:mt-8">
        <button
          onClick={verifyHandler}
          className="w-full bg-primary text-primary-foreground py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Verify Account
        </button>
      </div>

      {/* Back to Login */}
      <div className="text-center mt-4 sm:mt-6">
        <button
          type="button"
          onClick={() => setRoute("Login")}
          className="inline-flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
        >
          <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Back to Sign in
        </button>
      </div>

      {/* Resend Code */}
      <div className="text-center mt-3 sm:mt-4">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          Didn't receive the code?{" "}
          <button
            type="button"
            className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default Verification;