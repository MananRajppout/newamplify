"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Button } from "components/ui/button";
import { Alert, AlertDescription } from "components/ui/alert";
import { Skeleton } from "components/ui/skeleton";
import { Form } from "components/ui/form";
import Logo from "components/LogoComponent";
import FooterComponent from "components/FooterComponent";
import PasswordFieldWithStrength from "components/createAccount/PasswordFieldWithStrength";
import PasswordField from "components/createAccount/PasswordField";
import api from "lib/api";
import { resetPasswordSchema, ResetPasswordFormValues, resetPasswordDefaults } from "schemas/resetPasswordSchema";
import { CheckCircle, XCircle, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

type ResetState = "loading" | "ready" | "success" | "error" | "invalid";

const ResetPasswordContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resetState, setResetState] = useState<ResetState>("loading");
  const [token, setToken] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaults,
  });

  // Validate token on component mount
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    
    if (!tokenParam) {
      setResetState("invalid");
      setErrorMessage("No reset token provided. Please check your email for the correct link.");
      return;
    }

    setToken(tokenParam);
    // Token validation will happen on form submission
    setResetState("ready");
  }, [searchParams]);

  // Mutation for password reset
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormValues) => {
      return api.post("/api/v1/users/reset-password", {
        token: token,
        newPassword: data.password,
      });
    },
    onSuccess: () => {
      setResetState("success");
      toast.success("Password reset successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Password reset failed. Please try again.";
      setErrorMessage(message);
      toast.error(message);
      if (message.includes("Invalid") || message.includes("expired")) {
        setResetState("error");
      }
    },
  });

  const handleErrors = (errors: FieldErrors<ResetPasswordFormValues>) => {
    Object.values(errors).forEach((fieldError) => {
      if (fieldError?.message) {
        toast.error(fieldError.message);
      }
    });
  };

  const onSubmit = form.handleSubmit((values) => {
    resetPasswordMutation.mutate(values);
  }, handleErrors);

  const handleReturnToLogin = () => {
    router.push("/login");
  };

  const renderContent = () => {
    switch (resetState) {
      case "loading":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold">LOADING...</h1>
            <p className="text-blue-600">
              Preparing password reset form...
            </p>
          </div>
        );

      case "ready":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <KeyRound className="h-16 w-16 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold">RESET PASSWORD</h1>
              <p className="text-blue-600">
                Please enter your new password below.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <PasswordFieldWithStrength
                  control={form.control}
                  name="password"
                  label="New Password"
                  placeholder="Enter your new password"
                  showStrengthChecker={true}
                />

                <PasswordField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Confirm your new password"
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Password Requirements:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• At least 9 characters long</li>
                    <li>• Contains uppercase letter (A-Z)</li>
                    <li>• Contains lowercase letter (a-z)</li>
                    <li>• Contains number (0-9)</li>
                    <li>• Contains special character (!@#$%^&*()_+-=[]{}|;':&quot;,.&lt;&gt;?)</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-600">PASSWORD RESET SUCCESSFUL!</h1>
            <p className="text-gray-600">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <Alert className="mt-4 bg-green-50 border-green-500">
              <AlertDescription className="text-green-700 text-center">
                Please use your new password to log in to your account.
              </AlertDescription>
            </Alert>
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-red-600">RESET FAILED</h1>
            <p className="text-gray-600">
              We couldn't reset your password. The reset link may have expired or is invalid.
            </p>
            <Alert variant="destructive" className="mt-4">
              <AlertDescription className="text-center">
                {errorMessage}
              </AlertDescription>
            </Alert>
          </div>
        );

      case "invalid":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-red-600">INVALID RESET LINK</h1>
            <p className="text-gray-600">
              The reset link is invalid or missing. Please request a new password reset.
            </p>
            <Alert variant="destructive" className="mt-4">
              <AlertDescription className="text-center">
                {errorMessage}
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-20 flex-grow flex items-center justify-center">
      <div className="max-w-[600px] w-full mx-auto px-10 lg:px-20">
        <Card className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15),0_-4px_12px_rgba(0,0,0,0.1)] border-none">
          <CardHeader className="py-8">
            {renderContent()}
          </CardHeader>
          {resetState !== "ready" && (
            <CardContent className="px-10 pb-20">
              <div className="flex justify-center space-x-4">
                <Button
                  variant="default"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                  onClick={handleReturnToLogin}
                >
                  {resetState === "success" ? "Continue to Login" : "Back to Login"}
                </Button>
                
                {(resetState === "error" || resetState === "invalid") && (
                  <Link href="/forgot-password">
                    <Button variant="outline" className="px-8 py-2">
                      Request New Reset
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

const ResetPasswordLoading: React.FC = () => {
  return (
    <div className="py-20 flex-grow flex items-center justify-center">
      <div className="max-w-[600px] w-full mx-auto px-10 lg:px-20">
        <Card className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15),0_-4px_12px_rgba(0,0,0,0.1)]">
          <CardHeader className="py-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-80 mx-auto" />
              <div className="space-y-4 pt-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

const ResetPassword: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Logo Section */}
      <div className="flex-none">
        <div className="flex justify-center items-center pt-5 lg:hidden">
          <Logo />
        </div>
        <div className="pt-5 pl-10 lg:block hidden">
          <Logo />
        </div>
      </div>

      {/* Main Content */}
      <Suspense fallback={<ResetPasswordLoading />}>
        <ResetPasswordContent />
      </Suspense>

      {/* Footer */}
      <div className="flex-none mt-auto">
        <FooterComponent />
      </div>
    </div>
  );
};

export default ResetPassword;