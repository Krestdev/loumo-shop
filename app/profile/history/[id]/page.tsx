
import HydrationGuard from "@/components/HydrationGuard";
import OrderHistory from "./orderHistory";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <HydrationGuard> <OrderHistory id={id} /></HydrationGuard>
};

export default Page;
