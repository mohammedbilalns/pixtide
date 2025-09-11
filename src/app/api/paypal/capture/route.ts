import { recordPurchaseAction } from "@/actions/payment-actions";
import { auth } from "@/lib/auth";
import { NextURL } from "next/dist/server/web/next-url";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest){
	const searchParams = request.nextUrl.searchParams;
	const token = searchParams.get('token')
	const assetId = searchParams.get('assetId')
	const payerId = searchParams.get('PayerID')
	if(!token || !assetId || !payerId){
		return NextResponse.redirect( new URL(`/gallery?error=missing_params`, request.url))
	}

	try{
		const session = await auth.api.getSession({
			headers: await headers()
		});
		if(!session || !session.user){
			 return NextResponse.redirect(new URL('/login', request.url))
		}

		const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`, {
			method: "POST",
			headers: {
				'Content-Type':"application/json",
				Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
			}, 
		})

		const data = await response.json()
		console.log(data, "paypal capture")
		
		if(data.status == "COMPLETED"){
			const isSavedToDB = await recordPurchaseAction(assetId,token,session?.user.id,5.0)
			if(!isSavedToDB.success){
				return NextResponse.redirect(
					new URL(`/gallery/${assetId}?error=payment_failed`, request.url)
				)
			}else {
				return NextResponse.redirect(
					new URL(`/gallery/${assetId}?success=payment_successful`, request.url)
				)
			}

		}else {
			return NextResponse.redirect(new URL(`/gallery/${assetId}?error=payment_failed`, request.url))
		}
	}catch(err){

		console.error(err)
			return NextResponse.redirect(new URL(`/gallery/${assetId}?error=server_error`, request.url))


	}
}
