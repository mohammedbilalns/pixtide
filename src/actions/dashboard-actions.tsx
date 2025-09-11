'use server'
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { asset, category } from "@/lib/db/schema"
import { AssetSchema } from "@/validations/asset.validtion"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"


export async function getCategoriesAction(){
	try{
		return await db.select().from(category)
	}catch(err){
		console.log(err)
		return []
	}
}

export async function uploadAssetAction(formdata: FormData){
	console.log("Formdata" ,formdata)
	const session = await auth.api.getSession({
		headers: await headers()
	})
	if(!session?.user){
		throw new Error("You must be logged in to upload asset")
	}

	try{
		const {title,description,categoryId,thumbnailUrl,fileUrl,fileId} = AssetSchema.parse(Object.fromEntries(formdata.entries()))


		await db.insert(asset).values({
			title,description,fileUrl,thumbnailUrl,categoryId, fileId, isApproved:"pending",
			userId: session.user.id
		})

		revalidatePath('/dashboard/assets')
		return {
			success: true,
			message: "Asset added successfully"
		}

	}catch(err){
		console.error(err) 
		return {
			success: false, 
			message: "Failed to save asset"
		}
	}
}

export async function getUserAssetsAction(userId: string){
	try {
		return await db.select().from(asset).where(eq(asset.userId, userId)).orderBy(asset.createdAt)

		
	} catch (err) {
		return []
	}
}
