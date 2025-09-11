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

	return <main className="flex-1 p-4 lg:p-6">
		{children}
	</main>

}
