import { ReactElement, ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <main>
      <div className="min-h-screen max-h-fit w-full bg-gradient-to-b from-green-50 to-white">
        <div className="flex flex-col md:flex-row md:gap-7 lg:gap-0 items-center justify-center min-h-screen p-4">
          {/* Left Section */}
          <div className="flex flex-col items-center md:items-end md:w-full md:max-w-[500px] lg:pr-4 xl:pr-8 space-y-6 mb-8 md:mb-0">
            <div className="text-center md:text-right">
              <h1 className="web-title">AgroFarm</h1>
              <p className="hidden md:block text-lg lg:text-xl text-gray-600 max-w-md">
                Enabling Seamless Reporting and Informed Farmer Reports
              </p>
            </div>

            {/* Features Section - Visible on MD and up */}
            <div className="hidden md:grid grid-cols-2 gap-4 text-right">
              <div className="hidden lg:block p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-green-100 shadow-sm">
                <h3 className="font-semibold text-green-800">
                  Real-time Updates
                </h3>
                <p className="text-sm text-gray-600">Instant farm monitoring</p>
              </div>

              <div className="hidden lg:block p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-green-100 shadow-sm">
                <h3 className="font-semibold text-green-800">Data Analytics</h3>
                <p className="text-sm text-gray-600">Smart farming insights</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-green-300 to-transparent h-[70vh] md:mx-4 lg:mx-8"></div>

          {/* Right Section - Auth Forms */}
          {children}
        </div>
      </div>
    </main>
  );
}
