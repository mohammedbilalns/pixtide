import { getCategoriesAction, getUserAssetsAction } from "@/actions/dashboard-actions";
import AssetsGrid from "@/components/dashboard/asset-grid";
import UploadAssets from "@/components/dashboard/upload-assets";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default  async function UserAssetsPage(){
 	const session = await auth.api.getSession({
		headers: await headers()
	})
	if(!session) return null 
	
	const [categories, assets] = await Promise.all([getCategoriesAction(), getUserAssetsAction(session?.user.id)])
	return (

		<div className=" container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-extrabold">My Assets</h1>
				<UploadAssets categories={categories || []} />
			</div>
			<AssetsGrid assets={assets}/>
		</div>
	)
}
