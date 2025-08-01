export const GetFarmerCrop = async () => {
  try {
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.log(`Error in getting the farmer crop: ${err.message}`);
    return {
      success: false,
      notifError: [
        {
          message: `Error in getting the farmer crop: ${err.message}`,
          type: "error",
        },
      ],
    };
  }
};
