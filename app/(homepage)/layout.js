import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
