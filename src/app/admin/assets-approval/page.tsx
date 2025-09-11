import { getPendingAssetsAction } from "@/actions/admin-actions"
import {formatDistanceToNow} from "date-fns"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"
import AssetManagementControls from "@/components/admin/asset-management-control"

export default async function AssetApprovalPage(){
	const pendingAssets = await getPendingAssetsAction()
	return(
		<div className="container mx-auto py-10">

				<h1 className="text-3xl font-bold mb-5">Pending Assets</h1>	
		{pendingAssets.length == 0 ? (
		<Card className="bg-white">
			<CardContent className="py-16 flex flex-col items-center justify-center" >
				<p className="text-center text-slate-500">All Assets have been reviewed</p>
			</CardContent>
		</Card>
	) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{
						pendingAssets.map(({asset,userName})=>(
							<div key={asset.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow">
								<div className="h-48 bg-slate-100 relative">
									<Image src={asset.fileUrl} alt={asset.title} fill className="object-cover" />	

								</div>
								<div className="p-4">
									<h3 className="font-medium truncate">{asset.title}</h3>
									<p className="text-xs text-slate-500" >{asset.description}</p>
									<div className="flex justify-between items-center mt-3" >
										<span className="text-xs text-slate-400">{
											formatDistanceToNow(new Date(asset.createdAt), {
												addSuffix: true 
											})	
										}</span>
										<div className="flex items-center text-xs text-slate-400">
											<User className="mr-2 w-4 h-4"/>
											{userName}
										</div>
									</div>

								</div>
							 <AssetManagementControls assetId={asset.id}/>	

							</div>
						))
					}

				</div> 
		)
}
		</div>)

}
