import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiUser, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRegisterMutation } from "@/redux/features/auth/authApi";

interface Props {
  setRoute: (route: string) => void;
}

//Validation for email and password input
const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6),
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { error, data, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess && data) {
      const message = data.message || "Registration successful!";
      toast.success(message);
      setRoute("Verification");
    }

    if (error && "data" in error) {
      const errorMessage = (error as any).data.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  }, [isSuccess, error, data]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = { name, email, password };
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
          <FiUsers className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Join ELearning
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Create your account to start your learning journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="signup-name" className="block text-sm font-medium text-muted-foreground">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
            <input
              id="signup-name"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              aria-invalid={Boolean(errors.name && touched.name)}
              aria-describedby={errors.name && touched.name ? "signup-name-error" : undefined}
              className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                errors.name && touched.name
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-border bg-background text-foreground"
              }`}
            />
          </div>
          {errors.name && touched.name && (
            <p id="signup-name-error" className="text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="signup-email" className="block text-sm font-medium text-muted-foreground">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
              aria-invalid={Boolean(errors.email && touched.email)}
              aria-describedby={errors.email && touched.email ? "signup-email-error" : undefined}
              className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                errors.email && touched.email
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-border bg-background text-foreground"
              }`}
            />
          </div>
          {errors.email && touched.email && (
            <p id="signup-email-error" className="text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="signup-password" className="block text-sm font-medium text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
            <input
              id="signup-password"
              type={!show ? "password" : "text"}
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Create a password"
              aria-invalid={Boolean(errors.password && touched.password)}
              aria-describedby={errors.password && touched.password ? "signup-password-error" : undefined}
              className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                errors.password && touched.password
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-border bg-background text-foreground"
              }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShow(!show)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {!show ? (
                <AiOutlineEyeInvisible className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-foreground" />
              ) : (
                <AiOutlineEye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-foreground" />
              )}
            </button>
          </div>
          {errors.password && touched.password && (
            <p id="signup-password-error" className="text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Create Account
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center items-center px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg shadow-sm bg-card text-xs sm:text-sm font-medium text-foreground hover:bg-muted transition-all duration-200"
          >
            <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            Google
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center items-center px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg shadow-sm bg-card text-xs sm:text-sm font-medium text-foreground hover:bg-muted transition-all duration-200"
          >
            <AiFillGithub className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            GitHub
          </button>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setRoute("Login")}
              className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;