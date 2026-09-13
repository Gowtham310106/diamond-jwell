import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "quiet";

const base =
  // whitespace-nowrap is deliberate: every CTA label on this site must hold a
  // single line at desktop. Shape lock puts buttons on the pill radius.
  "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full " +
  "font-sans text-[11px] uppercase tracking-[0.16em] transition-all duration-300 " +
  "ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-[1px] " +
  "disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  // Navy ink on the rose fill measures 8.37:1.
  primary:
    "bg-rose text-ink px-7 py-3.5 font-medium hover:bg-rose-soft",
  // Navy ink on cream through a gold-grey stroke: 17.14:1.
  outline:
    "border border-line-2 text-ink px-7 py-3.5 hover:border-rose hover:text-rose-ink",
  // Inline text link. Underline is drawn on hover from the left.
  quiet:
    "text-ink-2 hover:text-ink px-0 py-1",
};

type Props = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className">;

export default function Button({
  variant = "primary",
  children,
  className,
  ...rest
}: Props) {
  return (
    <Link className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}
