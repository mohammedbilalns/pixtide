"use client"

import { usePathname } from "next/navigation"

export default function Header(){
	const pathName = usePathname();
	const isLoginPage: boolean = pathName == '/login'
	if(isLoginPage) return null 
	return <div>Header</div>
}
