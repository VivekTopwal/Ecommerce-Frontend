
import { ShopProvider } from "@/app/context/ShopContext";
import { Toaster } from "react-hot-toast";
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
