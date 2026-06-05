import Verify from "@/components/Auth/Verify";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <Verify slug={slug} />;
};

export default Page;
