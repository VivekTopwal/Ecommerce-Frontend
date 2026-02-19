import Nav from "@/app/components/common/Nav";
import Footer from "@/app/components/common/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Nav />
    {children}
      <Footer />
    </>
  );
}
