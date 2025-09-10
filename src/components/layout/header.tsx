"use client"

import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Package } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export default function Header(){
	const pathName = usePathname();
	const isLoginPage: boolean = pathName == '/login'
	const {data: session , isPending} = useSession()
	const router = useRouter()
	const user = session?.user 
	const isAdminUser = user?.role == "admin"

	const handleLogout = async  ()=>{
		await signOut({
			fetchOptions: {
				onSuccess : ()=>{
				 router.push('/')	
				}
			}
		})
	}

	if(isLoginPage) return null 
	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b bg-white ">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 ">
				<div className="flex items-center gap-4">
					<Link href="/" className="flex items-center gap-2">
						<div className="p-2 rounded-md bg-teal-500">
							<Package className="h-5 w-5 text-white"/>
						</div>
						<span className="font-bold text-xl text-teal-600"> Asset Platform</span>	
					</Link>

					<nav className="items-center flex gap-6 ml-6">
						<Link href="/gallery" className="text-sm font-medium hover:text-teal-600">Gallery</Link>
						{
							!isPending && user && !isAdminUser && (
								<>

									<Link href={'/dashboard/assets'} className="text-sm font-medium hover:text-teal-600">
										Assets
									</Link>

									<Link href={'/dashboard/purchases'} className="text-sm font-medium hover:text-teal-600">
											My Purchases
									</Link>

								</>
							)
						}
						{
							!isPending && user && isAdminUser && (
								<>

									<Link href={'/admin/assets-approval'} className="text-sm font-medium hover:text-teal-600">
										Assets Approval
									</Link>

										<Link href={'/admin/settings'} className="text-sm font-medium hover:text-teal-600">
									 Settings
									</Link>

								</>
							)
						}
					</nav>
				</div>
			<div className="flex items-center gap-6">
					{
						isPending ? null : user ? (
							<div className="flex items-center gap-3">
						<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="cursor-pointer relative h-9 w-9 rounded-full p-0 ring-1 ring-slate-300 hover:ring-2 hover:ring-teal-400 transition-all shadow-sm"
										>
											<Avatar className="h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow">
												<AvatarFallback className="text-white font-bold text-lg select-none">
													{user?.name ? user.name.charAt(0).toUpperCase() : "U"}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent className="w-48 rounded-md border border-slate-200 bg-white shadow-lg p-2 focus:outline-none">
										<DropdownMenuLabel className="px-3 py-2">
											<div className="flex flex-col space-y-0.5">
												<p className="text-sm font-semibold text-slate-900 truncate">{user?.name || "User"}</p>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator className="my-1 border-slate-200" />
										<DropdownMenuItem
											onClick={handleLogout}
											className="flex items-center px-3 py-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-md"
										>
											<LogOut className="mr-3 h-4 w-4" />
											<span className="font-medium">Logout</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>



							</div>
						): <Link href="/login">

							<Button  className="cursor-pointer bg-teal-500 hover:bg-teal-600">Login</Button>
						</Link>
					}
				</div>
			</div>
		</header>
	) 
 }
