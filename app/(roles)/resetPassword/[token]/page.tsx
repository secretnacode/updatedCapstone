export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  console.log((await params).token);

  // try {
  // } catch (error) {}

  return <div></div>;
}
