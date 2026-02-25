"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { clsx } from "clsx";

type FormSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  savedLabel?: string;
  savedMs?: number;
  className?: string;
};

export function FormSubmitButton({
  label,
  pendingLabel = "Saving...",
  savedLabel = "Saved",
  savedMs = 1800,
  className
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  const [showSaved, setShowSaved] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (pending) {
      wasPending.current = true;
      setShowSaved(false);
      return;
    }

    if (!wasPending.current) {
      return;
    }

    wasPending.current = false;
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), savedMs);
    return () => clearTimeout(timer);
  }, [pending, savedMs]);

  return (
    <button type="submit" disabled={pending} aria-live="polite" className={clsx(className, pending && "opacity-80")}>
      {pending ? pendingLabel : showSaved ? savedLabel : label}
    </button>
  );
}

