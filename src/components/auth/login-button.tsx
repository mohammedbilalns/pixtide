"use client"

import { signIn } from "@/lib/auth-client"
import { Button } from "../ui/button"


export default function LoginButton(){

	const handleLogin = async()=>{
		await signIn.social({
			provider: 'google',
			callbackURL: '/'
		})
	}
	return (
	<Button onClick={handleLogin} className="w-full cursor-pointer bg-teal-500 hover:bg-teal-600 text-white py-6 text-base font-medium">
			<span>Sign in with Google</span>
		</Button>
	)
}
