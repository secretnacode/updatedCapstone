import { RedirectManager } from "@/component/client_component/fallbackComponent";
import { GoBackButton } from "@/component/client_component/unauthorizedComponent";
import { NotificationBaseType } from "@/types";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  let message: NotificationBaseType[] | null = null;

  if (error) message = JSON.parse(error);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6 py-12">
      {message && <RedirectManager data={message} paramName="error" />}
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Warning Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-lg text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            This incident has been logged for security purposes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign In
            </Link>

            <GoBackButton />
          </div>

          <Link
            href="/"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
          >
            ← Return to Homepage
          </Link>
        </div>

        {/* Help Text */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Need help? Contact your administrator or{" "}
            <Link
              href="/support"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
            >
              support team
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-xs text-gray-400">
          © 2024 Reporting Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
