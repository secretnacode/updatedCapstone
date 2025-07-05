"use client";

import { useRouter } from "next/navigation";

export function GoBackButton() {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(`/`);
  };

  return (
    <button
      onClick={goBack}
      className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      Go Back
    </button>
  );
}
