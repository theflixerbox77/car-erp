export default function StatTile({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "good" | "critical" }) {
  const toneClass = tone === "good" ? "text-success-600" : tone === "critical" ? "text-error-500" : "text-gray-800 dark:text-white/90";
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-title-sm font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}
