"use client"

import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Package } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export default function Header() {
  const pathName = usePathname();
  const isLoginPage: boolean = pathName == "/login";
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;
  const isAdminUser = user?.role == "admin";

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  if (isLoginPage) return null;
  return (
    <header className=" w-screen fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-md shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 shadow-sm group-hover:scale-105 transition-transform">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 group-hover:text-teal-600 transition-colors">
              Asset Platform
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link
              href="/gallery"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              Gallery
            </Link>
            {!isPending && user && !isAdminUser && (
              <>
                <Link
                  href={"/dashboard/assets"}
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Assets
                </Link>
                <Link
                  href={"/dashboard/purchases"}
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                >
                  My Purchases
                </Link>
              </>
            )}
            {!isPending && user && isAdminUser && (
              <>
                <Link
                  href={"/admin/assets-approval"}
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Assets Approval
                </Link>
                <Link
                  href={"/admin/settings"}
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Settings
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-6">
          {isPending ? null : user ? (
            <div className="flex items-center gap-3">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="cursor-pointer relative h-10 w-10 rounded-full p-0 border border-slate-200 bg-gradient-to-br from-teal-500 to-cyan-400 shadow hover:scale-105 hover:shadow-lg transition-all"
                  >
                    <Avatar className="h-10 w-10 rounded-full flex items-center justify-center">
                      <AvatarFallback className="text-white font-bold text-lg select-none">
                        {user?.name
                          ? user.name.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-52 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl p-2 focus:outline-none">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user?.name || "User"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 border-slate-200" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login">
              <Button className="cursor-pointer bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 shadow-md rounded-lg px-4 py-2 transition-all">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

