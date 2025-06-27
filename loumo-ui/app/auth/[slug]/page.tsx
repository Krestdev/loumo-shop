import ChangePassword from "@/components/Auth/ChangePassword";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <ChangePassword slug={slug} />;
};

export default Page;
