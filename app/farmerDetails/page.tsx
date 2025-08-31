import { FarmerDetailForm } from "@/component/client_component/farmerDetailsComponent";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Impormasyon ng Magsasaka
          </h1>
        </div>

        <div>
          <FarmerDetailForm />
        </div>
      </div>
    </div>
  );
}
