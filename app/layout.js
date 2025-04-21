import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BudgetTrack",
  description: "A cozy, simple way to manage your personal finances.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
         {/* ✅ Moved inside <body> */}
          <Header />

          <main className="min-h-screen">
            {children}
          </main>
          <Toaster richColors />

          <footer className="bg-[#f3efe9] py-10 mt-12">
            <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
              <p>© {new Date().getFullYear()} BudgetTrack. Designed by Wasan Yotchai 🎨</p>
            </div>
          </footer>
        
      </body>
    </html>
    </ClerkProvider>
  );
}
