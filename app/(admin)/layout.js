
import Sidebar from "@/app/components/admin/Sidebar";

export default function RootLayout({ children }) {
  return (
    
    
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 ml-64 h-screen overflow-y-auto">
            {children}
          </main>
        </div>
      
  );
}
