import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function UserDashboardLayour({children}: {children: React.ReactNode}){

	const session =  await auth.api.getSession({
		headers: await headers()
	})
	if(!session || !session.user ){
		redirect('/login')
	}
	if(session.user.role !== "user"){
		redirect("/admin/settings")
	}
	return <main className="flex-1 p-4 lg:p-6">
		{children}
	</main>

}
