import { styles } from "../../style/style";
import { useUpdatePasswordMutation } from "../../../redux/features/user/userApi";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ChangePassword: FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updatePassword, { isLoading }] =
    useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    try {
      await updatePassword({ oldPassword, newPassword }).unwrap();
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred!");
    }
  };

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          {/* Old Password Input */}
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your old password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 text-black dark:text-[#fff]`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          {/* New Password Input */}
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your new password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 text-black dark:text-[#fff]`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your confirm password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 text-black dark:text-[#fff]`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="w-[100%] 800px:w-[60%] mt-4">
            <button
              type="submit"
              className="w-[95%] h-[40px] border border-[#37a39a] text-center text-black dark:text-[#fff] rounded-[3px] mt-8 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;