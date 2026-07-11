import clsx from "@/lib/clsx";

export default function SectionLabel({
  index,
  title,
  tone = "dark",
}: {
  index: string;
  title: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className={clsx("section-label", tone === "light" && "text-gold")}>{index}</span>
      <span className="h-px w-12 bg-gold/60" />
      <span className={clsx("section-label", tone === "light" ? "text-ivory/60" : "text-ink-soft")}>{title}</span>
    </div>
  );
}
