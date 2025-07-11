export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-blue-600 text-lg flex gap-2 items-center">
        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        Connecting to your room...
      </div>
    </div>
  );
}
