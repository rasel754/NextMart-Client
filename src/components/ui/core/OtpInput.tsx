"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OtpInput({ value, onChange }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Keep local digits in sync with parent value
    const updated = Array(6).fill("");
    for (let i = 0; i < Math.min(value.length, 6); i++) {
      updated[i] = value[i];
    }
    setDigits(updated);
  }, [value]);

  const updateParent = (newDigits: string[]) => {
    const combined = newDigits.join("");
    onChange(combined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // allow only numbers
    if (!val) return;

    const newDigits = [...digits];
    // take only last character if multiple entered
    const digit = val[val.length - 1];
    newDigits[idx] = digit;
    setDigits(newDigits);
    updateParent(newDigits);

    // Auto-focus next input
    if (idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (!digits[idx] && idx > 0) {
        // focus previous and clear it
        const newDigits = [...digits];
        newDigits[idx - 1] = "";
        setDigits(newDigits);
        updateParent(newDigits);
        inputRefs.current[idx - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[idx] = "";
        setDigits(newDigits);
        updateParent(newDigits);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedText) return;

    const newDigits = Array(6).fill("");
    for (let i = 0; i < pastedText.length; i++) {
      newDigits[i] = pastedText[i];
    }
    setDigits(newDigits);
    updateParent(newDigits);

    // Focus last pasted digit or next empty digit
    const focusIndex = Math.min(pastedText.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {digits.map((digit, idx) => (
        <Input
          key={idx}
          type="text"
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]*"
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-12 h-12 text-center text-lg font-bold border border-border/80 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
        />
      ))}
    </div>
  );
}
