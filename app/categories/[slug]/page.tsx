import Category from "@/components/Categories/Category";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <Category slug={slug} /> ;
};

export default Page;
