import { Toaster } from "react-hot-toast";
import { ShopProvider } from "@/app/context/ShopContext";

export default function PublicLayout({ children }) {
  return (
    <>
   <ShopProvider>
       <Toaster position="top-right" />
    {children}
    </ShopProvider>
    </>
  );
}
