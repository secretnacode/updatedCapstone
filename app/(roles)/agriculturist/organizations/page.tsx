export default async function Page() {
  let allOrg;
  try {
    allOrg = await GetAllOrganization();
  } catch (error) {
    allOrg = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }
  return <div>org</div>;
}
