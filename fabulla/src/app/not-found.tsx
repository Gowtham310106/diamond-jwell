import Button from "@/components/ui/Button";
import { CTA } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-[1400px] flex-col items-center justify-center px-5 py-24 text-center lg:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-rose-ink">
        404
      </p>
      <h1 className="display mt-6 max-w-xl text-[clamp(2.25rem,5vw,3.75rem)] text-ink">
        This piece is not here
      </h1>
      <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-ink-2">
        The page you were after has moved or never existed. The studio is still
        very much open.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button href={CTA.browse.href} variant="primary">
          {CTA.browse.label}
        </Button>
        <Button href="/" variant="outline">
          Back to home
        </Button>
      </div>
    </div>
  );
}
