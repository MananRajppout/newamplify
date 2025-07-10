// components/createAccount/PasswordStrengthChecker.tsx
"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "lib/utils";

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 9 characters long",
    test: (password) => password.length >= 9,
  },
  {
    id: "uppercase",
    label: "Contains at least one uppercase letter (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "Contains at least one lowercase letter (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Contains at least one number (0-9)",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "Contains at least one special character (!@#$%^&*)",
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  },
];

interface PasswordStrengthCheckerProps {
  password: string;
  className?: string;
}

export default function PasswordStrengthChecker({
  password,
  className,
}: PasswordStrengthCheckerProps) {
  const getRequirementStatus = (requirement: PasswordRequirement) => {
    return requirement.test(password);
  };

  const allRequirementsMet = passwordRequirements.every((req) =>
    getRequirementStatus(req)
  );

  const metRequirementsCount = passwordRequirements.filter((req) =>
    getRequirementStatus(req)
  ).length;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Password Requirements
        </h4>
        <span className="text-xs text-gray-500">
          {metRequirementsCount}/{passwordRequirements.length} met
        </span>
      </div>

      <div className="space-y-2">
        {passwordRequirements.map((requirement) => {
          const isValid = getRequirementStatus(requirement);
          return (
            <div
              key={requirement.id}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors duration-200",
                isValid ? "text-green-600" : "text-gray-500"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-4 h-4 rounded-full transition-colors duration-200",
                  isValid
                    ? "bg-green-100 border border-green-300"
                    : "bg-gray-100 border border-gray-300"
                )}
              >
                {isValid ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <X className="w-3 h-3 text-gray-400" />
                )}
              </div>
              <span className={cn(isValid && "font-medium")}>
                {requirement.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Password strength indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Password Strength:</span>
          <span
            className={cn(
              "text-xs font-medium",
              metRequirementsCount < 2 && "text-red-600",
              metRequirementsCount >= 2 && metRequirementsCount < 4 && "text-yellow-600",
              metRequirementsCount >= 4 && !allRequirementsMet && "text-blue-600",
              allRequirementsMet && "text-green-600"
            )}
          >
            {metRequirementsCount < 2 && "Weak"}
            {metRequirementsCount >= 2 && metRequirementsCount < 4 && "Fair"}
            {metRequirementsCount >= 4 && !allRequirementsMet && "Good"}
            {allRequirementsMet && "Strong"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              metRequirementsCount < 2 && "w-1/4 bg-red-500",
              metRequirementsCount >= 2 && metRequirementsCount < 4 && "w-2/4 bg-yellow-500",
              metRequirementsCount >= 4 && !allRequirementsMet && "w-3/4 bg-blue-500",
              allRequirementsMet && "w-full bg-green-500"
            )}
          />
        </div>
      </div>
    </div>
  );
}

// Export the password validation function for use in schema
export const validateStrongPassword = (password: string): boolean => {
  return passwordRequirements.every((req) => req.test(password));
};

// Export individual requirement tests for custom validation
export { passwordRequirements }; 