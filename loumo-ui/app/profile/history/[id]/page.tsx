import OrderHistory from "./orderHistory";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <OrderHistory id={id} />;
};

export default Page;
