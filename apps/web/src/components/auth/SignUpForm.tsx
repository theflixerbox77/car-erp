"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useActionState, useState } from "react";
import { registerAction, RegisterState } from "@/app/actions/auth";

const initialState: RegisterState = {};

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Register your dealership
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your dealer account. An admin will review and approve it shortly after.
            </p>
          </div>
          <div>
            <form action={formAction}>
              <div className="space-y-5">
                {state.error && (
                  <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                    {state.error}
                  </div>
                )}
                <div>
                  <Label>
                    Business Name<span className="text-error-500">*</span>
                  </Label>
                  <Input type="text" name="businessName" placeholder="e.g. Alpha Motors" />
                </div>
                <div>
                  <Label>
                    Your Full Name<span className="text-error-500">*</span>
                  </Label>
                  <Input type="text" name="ownerFullName" placeholder="Enter your full name" />
                </div>
                <div>
                  <Label>
                    Phone
                  </Label>
                  <Input type="text" name="phone" placeholder="+8801XXXXXXXXX" />
                </div>
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input type="email" name="ownerEmail" placeholder="Enter your email" />
                </div>
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      name="ownerPassword"
                      placeholder="At least 8 characters"
                      type={showPassword ? "text" : "password"}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {state.fieldErrors?.ownerPassword && (
                    <p className="mt-1.5 text-xs text-error-500">{state.fieldErrors.ownerPassword}</p>
                  )}
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={pending}>
                    {pending ? "Creating account..." : "Create dealer account"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
