export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-20 fade-in-up">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-blue-500 animate-[spin_1s_linear_infinite] shadow-[0_0_20px_rgba(79,142,247,0.4)]"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-purple-500 animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_20px_rgba(124,90,246,0.4)]"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        </div>
      </div>
      <p className="text-gray-400 font-medium tracking-wide animate-pulse uppercase text-sm">Loading</p>
    </div>
  );
}
