import Category from "@/app/components/common/Category";
import ProductList from "@/app/components/product/ProductList";
import ProductList2 from "@/app/components/product/ProductList2";
import ProductSlider from "@/app/components/slider/ProductSlider";
import Features from "@/app/components/common/Features";

export default function Home() {
  return (
    <>
      <Category />
      <ProductList category="Haircare, Skincare, Crystals" limit={11}/>
      <ProductSlider category="Pyrite"/>
      <ProductList2  category="Pyrite Decor, Crystals" limit={11}/>   
      <Features />
    </>
  );
}

