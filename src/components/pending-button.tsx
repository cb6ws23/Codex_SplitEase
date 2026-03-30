"use client";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";

type Props = ButtonProps & {
  idleLabel: string;
  pendingLabel: string;
};

export function PendingButton({
  idleLabel,
  pendingLabel,
  disabled,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={disabled || pending} {...props}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
