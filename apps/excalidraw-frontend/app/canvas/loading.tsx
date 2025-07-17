import { PuffLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[rgba(48,148,182,0.95)] via-white to-[rgba(48,148,182,0.95)] backdrop-blur-md flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6 p-8 bg-white/80 rounded-2xl shadow-2xl border border-[rgba(48,148,182,0.15)] animate-fadeIn">
        <PuffLoader
          color="rgba(48,148,182,0.95)"
          size={64}
          speedMultiplier={1.2}
        />
        <div className="text-[rgba(48,148,182,0.95)] text-xl font-bold tracking-wide animate-pulse">
          Connecting to your room...
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(.4,2,.6,1);
        }
      `}</style>
    </div>
  );
}
