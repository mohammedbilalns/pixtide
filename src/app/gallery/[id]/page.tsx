import { Suspense } from "react"
import { CheckCircle, CircleX, Download, Heading1, Info, Loader2, ShoppingBag, ShoppingCart, Tag } from "lucide-react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { getAssetByIdAction } from "@/actions/public-actions"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createPaypalOrderAction, hasUserPurchasedAssetAction } from "@/actions/payment-actions"

interface GalleryDetailsPageProps{
	params: {
		id: string
	}
	searchParams: {
		success?: string, 
		error?: string, 
	}
}

export default function GallertDetailsPage({params, searchParams}:GalleryDetailsPageProps ){

	return 	<Suspense fallback={
			<div className="flex items-center justify-center min-h-[65vh]">
				<Loader2 className="h-8 w-8 animate-spin text-black"/>
			</div>
		} >

 			<GalleryContent params={params} searchParams={searchParams} />
		</Suspense>
}


async function GalleryContent({params, searchParams}: GalleryDetailsPageProps){

	const session = await auth.api.getSession({
		headers: await headers()
	})


	const {success, error} = searchParams


	const result = await getAssetByIdAction(params?.id)
	if(!result){
		notFound()
	}

	const {asset, categoryName, username,userImage,userId} = result
	const isAuthor = session?.user.id === userId 
	const handlePurchase =  async () => {
		"use server"
		const result = await createPaypalOrderAction(params.id)
		if(result.alreadyPurchased ){
			redirect(`/gallery/${params.id}?success=already_purchased`)
		}

		if(result.approvalLink){
			redirect(result.approvalLink)
		}
	}

	const hasPurchasedAsset = session?.user?.id ? await hasUserPurchasedAssetAction(params.id) : false 

	return (
		<div className="min-h-screen container mx-auto px-4 bg-white" >
			{success && (
				<div className="flex mt-20 items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
					<CheckCircle className="w-5 h-5 text-green-500" />
					<p>{success.split('_').join(' ')}</p>
				</div>
			)  }
			{error && (
				<div className="flex mt-20 items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
					<CircleX className="w-5 h-5 text-red-500" />
					<p>{error.split('_').join(' ')}</p>
				</div>
			)  }


			<div className="container py-12" >
				<div className="grid gap-12 md:grid-cols-3">
					<div className="md:col-span-2 space-y-8">
						<div className="roundeded-lg overflow-hidden bg-gray-100 border">
							<div className="relative w-full">
								<Image
									src={asset.fileUrl}
									alt={asset.title}
									width={1200}
									height={800}
									className="w-full h-auto object-contain"
									priority
								/>
							</div>
						</div>
						<div className="flex items-center justify-between" >
							<div>
								<h1 className="text-3xl font-bold" >{ asset?.title}</h1>
								{
									categoryName && (
										<Badge className="cursor-pointer mt-2 bg-gray-200 text-gray-700 hover:bg-gray-300 ">
											<Tag className="mr-1 h-4 w-4" />
											{categoryName}
										</Badge>
									)
								}	
							</div>
							<div>
								<p className="text-sm font-medium">{username}</p>
								<p className="text-xs text-gray-500" >Creator</p>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="sticky top-24">
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
											session?.user ? isAuthor ?
												( 
													<div className="bg-blue-50 text-blue-700 p-5 rounded-lg flex items-start gap-3">
														<Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0 " />
														<p className="text-sm">This is your own asset. You can't purchase your own asset</p>	
													</div>

												) 
												: hasPurchasedAsset 
													? ( <Button  asChild className="cursor-pointer w-full bg-green-600 text-white h-12  ">
														<a href={`/api/download/${params.id}`} download >
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
						</div>
					</div>
				</div>

			</div>
		</div>
	)

} 
