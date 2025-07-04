import RequireAuth from "@/components/RequireAuth";
import OrderHistory from "./orderHistory";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <RequireAuth><OrderHistory id={id} /></RequireAuth>;
};

export default Page;
