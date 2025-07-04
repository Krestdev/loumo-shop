import Category from "@/components/Categories/Category";
import RequireAuth from "@/components/RequireAuth";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <RequireAuth><Category slug={slug} /></RequireAuth>;
};

export default Page;
