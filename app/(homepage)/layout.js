import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import { ShopProvider } from "@/app/context/ShopContext";
import { Toaster } from "react-hot-toast";
export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
   <ShopProvider>
      <Toaster position="top-right" />
    {children}
    </ShopProvider>
      <Footer />
    </>
  );
}
