// components/createAccount/PasswordFieldWithStrength.tsx
"use client";

import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Control,
  FieldValues,
  Path,
  useWatch,
} from "react-hook-form";
import PasswordStrengthChecker from "./PasswordStrengthChecker";

interface PasswordFieldWithStrengthProps<TFieldValues extends FieldValues> {
  /** the RHF control object */
  control: Control<TFieldValues>;
  /** the field name – must be a key of TFieldValues */
  name: Path<TFieldValues>;
  /** visible label text */
  label: string;
  /** placeholder inside the <Input> */
  placeholder?: string;
  /** extra className on the FormItem (e.g. for flex‐layout) */
  className?: string;
  /** whether to show password strength checker */
  showStrengthChecker?: boolean;
}

export default function PasswordFieldWithStrength<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  className = "",
  showStrengthChecker = false,
}: PasswordFieldWithStrengthProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Watch the password value for the strength checker
  const passwordValue = useWatch({
    control,
    name,
  }) || "";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                {...field}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full pr-2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
          
          {/* Password Strength Checker */}
          {showStrengthChecker && passwordValue && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <PasswordStrengthChecker password={passwordValue} />
            </div>
          )}
        </FormItem>
      )}
    />
  );
} 