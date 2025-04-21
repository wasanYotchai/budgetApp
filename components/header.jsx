import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";


const Header = async () => {
  await checkUser();

  return (
    <div className="fixed top-0 w-full bg-[#fdfaf6]/80 backdrop-blur-lg z-50 border-b border-[#e6e3de] shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="budgetapp logo"
            height={90}
            width={300}
            className="h-20 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center space-x-4 gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-[#3c3c3b] hover:text-[#6c7b6e] flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transaction/create">
              <Button
                variant="outline" className="bg-[#2a6038] hover:bg-[#91b69b] text-white flex items-center gap-2"
              >
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                className="border-[#a1b8a7] text-[#6c7b6e] hover:bg-[#e7f0ea]"
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{
                elements: {
                    avatarBox: "w-25 h-25"
                }
            }}/>
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;
