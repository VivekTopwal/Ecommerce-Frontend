import ProductDetail from "@/app/components/admin/products/AdminProductDetailPage";

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  
  return (
    <>
      <ProductDetail/>
    </>
  );
}

