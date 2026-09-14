"use client";

import { useFormStatus } from "react-dom";
import { CircleNotch } from "@phosphor-icons/react";
import { btnDanger, btnPrimary } from "./ui";
import { cn } from "@/lib/utils";

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(btnPrimary, className)}>
      {pending && <CircleNotch size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

/** A destructive form submit that asks first. */
export function ConfirmButton({
  children,
  message = "Delete this? It cannot be undone.",
  className,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(btnDanger, className)}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
