"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Button } from "components/ui/button";
import { Alert, AlertDescription } from "components/ui/alert";
import { Skeleton } from "components/ui/skeleton";
import Logo from "components/LogoComponent";
import FooterComponent from "components/FooterComponent";
import api from "lib/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

type VerificationState = "loading" | "success" | "error" | "invalid";

const VerifyAccountContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationState, setVerificationState] = useState<VerificationState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setVerificationState("invalid");
      setErrorMessage("No verification token provided.");
      return;
    }

    const verifyAccount = async () => {
      try {
        const response = await api.get(`/api/v1/users/verify-email?token=${token}`);
        
        if (response.status === 200) {
          setVerificationState("success");
          toast.success("Account verified successfully!");
        }
      } catch (error: any) {
        setVerificationState("error");
        const message = error.response?.data?.message || error.message || "Verification failed. Please try again.";
        setErrorMessage(message);
        toast.error(message);
      }
    };

    verifyAccount();
  }, [searchParams]);

  const handleReturnToLogin = () => {
    router.push("/login");
  };

  const renderContent = () => {
    switch (verificationState) {
      case "loading":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold">VERIFYING ACCOUNT</h1>
            <p className="text-blue-600">
              Please wait while we verify your account...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-600">ACCOUNT VERIFIED!</h1>
            <p className="text-gray-600">
              Your account has been successfully verified. You can now log in and start using the platform.
            </p>
            <Alert className="mt-4 bg-green-50 border-green-500">
              <AlertDescription className="text-green-700 text-center">
                You can now set up project details and conduct sessions.
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
            <h1 className="text-3xl font-bold text-red-600">VERIFICATION FAILED</h1>
            <p className="text-gray-600">
              We couldn't verify your account. This may be due to an expired or invalid token.
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
            <h1 className="text-3xl font-bold text-red-600">INVALID LINK</h1>
            <p className="text-gray-600">
              The verification link is invalid or missing. Please check your email for the correct link.
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
      <div className="max-w-[800px] w-full mx-auto px-10 lg:px-20">
        <Card className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15),0_-4px_12px_rgba(0,0,0,0.1)] border-none">
          <CardHeader className="py-8">
            {renderContent()}
          </CardHeader>
          <CardContent className="px-10 pb-20">
            <div className="flex justify-center space-x-4">
              <Button
                variant="default"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                onClick={handleReturnToLogin}
              >
                {verificationState === "success" ? "Continue to Login" : "Back to Login"}
              </Button>
              
              {verificationState === "error" && (
                <Link href="/forgot-password">
                  <Button variant="outline" className="px-8 py-2">
                    Reset Password
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const VerifyAccountLoading: React.FC = () => {
  return (
    <div className="py-20 flex-grow flex items-center justify-center">
      <div className="max-w-[800px] w-full mx-auto px-10 lg:px-20">
        <Card className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15),0_-4px_12px_rgba(0,0,0,0.1)]">
          <CardHeader className="py-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-80 mx-auto" />
            </div>
          </CardHeader>
          <CardContent className="px-10 pb-20">
            <div className="flex justify-center">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const VerifyAccount: React.FC = () => {
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
      <Suspense fallback={<VerifyAccountLoading />}>
        <VerifyAccountContent />
      </Suspense>

      {/* Footer */}
      <div className="flex-none mt-auto">
        <FooterComponent />
      </div>
    </div>
  );
};

export default VerifyAccount;