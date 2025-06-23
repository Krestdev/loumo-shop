import ProductDetails from "./productDetails";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
};

export default Page;
