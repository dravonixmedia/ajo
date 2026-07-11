import clsx from "@/lib/clsx";

interface LogoProps {
  className?: string;
  tone?: "dark" | "light";
  withSubtitle?: boolean;
}

export default function Logo({ className, tone = "dark", withSubtitle = false }: LogoProps) {
  return (
    <span className={clsx("inline-flex flex-col leading-none", className)}>
      <span
        className={clsx(
          "font-serif text-lg tracking-[0.18em]",
          tone === "dark" ? "text-ink" : "text-ivory"
        )}
      >
        AJO ABRAHAM
      </span>
      {withSubtitle && (
        <span
          className={clsx(
            "mt-1 text-[0.6rem] uppercase tracking-[0.4em]",
            tone === "dark" ? "text-ink-soft" : "text-ivory/60"
          )}
        >
          Photographer
        </span>
      )}
    </span>
  );
}
