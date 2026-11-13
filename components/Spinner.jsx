export default function Spinner({ label = "Loading...", full = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${full ? "min-h-[60vh]" : "py-16"}`}
      role="status"
      aria-live="polite"
    >
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="text-sm section-sub">{label}</p>
    </div>
  );
}
