import { AlertTriangle, X } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useLoading } from "./provider/loadingProvider";
import { useNotification } from "./provider/notificationProvider";
import { DelteUserAccount } from "@/lib/server_action/user";
import { useRouter } from "next/navigation";

/**
 * component for the delete modal that will let sure the user will delete the account
 * @param param0 props that takes farmerId(id that you want to delete),
 * farmerName(name of the farmer that you want to delete), setShowDeleteModal(state of modal if it will be shown or not)
 * @returns component modal
 */
export const DeleteModalNotif: FC<{
  farmerId: string;
  farmerName: string;
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
}> = ({ farmerId, farmerName, setShowDeleteModal }) => {
  const { handleIsLoading, handleDoneLoading } = useLoading();
  const { handleSetNotification } = useNotification();
  const [isPassing, setIsPassing] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteFarmerUser = async () => {
    setIsPassing(true);
    try {
      handleIsLoading("Tinatanggal na ang account....");

      const deleteUser = await DelteUserAccount(farmerId);

      handleSetNotification(deleteUser.notifMessage);
      router.refresh();
    } catch (error) {
      const err = error as Error;
      handleSetNotification([{ message: err.message, type: "error" }]);
    } finally {
      setIsPassing(false);
      handleDoneLoading();
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Kumpirmasyon ng Pagtanggal
            </h2>
          </div>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isPassing}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600">
            Sigurado ka ba na gusto mong tanggalin ang account ni{" "}
            <span className="font-semibold text-gray-900">{farmerName}</span>?
            Hindi na mababawi ang aksyon na ito.
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => setShowDeleteModal(false)}
            disabled={isPassing}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPassing ? "Tinatanggal na..." : "Kanselahin"}
          </button>
          <button
            onClick={handleDeleteFarmerUser}
            disabled={isPassing}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isPassing ? "Tinatanggal na..." : "Tanggalin"}
          </button>
        </div>
      </div>
    </div>
  );
};
