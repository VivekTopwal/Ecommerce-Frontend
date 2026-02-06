
import ProductDetails from "@/app/components/product/ProductDetailPage";

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  
  return (
    <main>
      <ProductDetails />
    </main>
  );
}