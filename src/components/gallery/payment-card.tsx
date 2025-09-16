"use client"
import { Card, CardContent } from "../ui/card"
import { Info, Download, ShoppingCart } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createPaypalOrderAction } from "@/actions/payment-actions"

interface PaymentCardProps{
	assetId: string
	userId: string, 
	isAuthor: boolean, 
	hasPurchasedAsset : boolean,

}

export default function PaymentCard({ userId,isAuthor, hasPurchasedAsset, assetId }:PaymentCardProps){

	const handlePurchase =  async () => {
		"use server"
		const result = await createPaypalOrderAction(assetId)
		// if(result.alreadyPurchased ){
		// 	redirect(`/gallery/${params.id}?success=already_purchased`)
		// }
		//
		if(result.approvalLink){
			redirect(result.approvalLink)
		}
	}


	return (

		<Card className="overflow-hidden border-0 shadow-lg rounded-xl">
			<div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white ">
				<h3 className="text-xl font-bold mb-2" >Premium Asset</h3>
				<div>
					<span className="text-3xl font-bold">$5.00</span>
					<span className="ml-2 text-gray-300">One Time Purchase</span>
				</div>
			</div>

			<CardContent className="p-6">
				<div className="space-y-4">
					{
						userId ? isAuthor ?
							( 
								<div className="bg-blue-50 text-blue-700 p-5 rounded-lg flex items-start gap-3">
									<Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0 " />
									<p className="text-sm">This is your own asset. You can&apos;t purchase your own asset</p>	
								</div>

							) 
							: hasPurchasedAsset 
								? ( <Button asChild className="cursor-pointer w-full bg-green-600 text-white h-12  ">
									<a download >
										<Download className="mr-2 w-6 h-6"  />
										Download Asset
									</a>

								</Button> ) 
								: ( <form action={handlePurchase}>
									<Button type="submit" className="w-full bg-black text-white h-12 ">
										<ShoppingCart className="mr-2 w-6 h-6" />
										Purchase Now 
									</Button>
								</form> ) : (
								<>
									<Button asChild className="w-full bg-black text-white h-12">

										<Link href="/login" >Sign In to Purchase</Link>
									</Button>	
								</>
							)
					}

				</div>

			</CardContent>

		</Card>


	)
}
