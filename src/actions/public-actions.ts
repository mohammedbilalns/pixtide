import { db } from "@/lib/db";
import { asset, category, user } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function getPublicAssetsAction(categoryId?: number){
	try{
		let conditions = and(eq(asset.isApproved, "approved"))
		if(categoryId){
			conditions = and(conditions, eq(asset.categoryId, categoryId))
		}

		const query = await db.select({
			asset: asset,
			categoryName: category.name,
			userName: user.name
		}).from(asset).leftJoin(category,eq(asset.categoryId,category.id)).leftJoin(user,eq(asset.userId, user.id)).where(conditions)
		return query

	}catch(e){
		console.log(e)
		return []
	}
}

export async function getAssetByIdAction(assetId: string){
	try {
		const [result] = await db.select({
			asset: asset,
			categoryName: category.name,
			username:user.name,
			userImage: user.image,
			userId : user.id
		}).from(asset).leftJoin(category,eq(asset.categoryId,category.id)).leftJoin(user,eq(asset.userId, user.id)).where(eq(asset.id , assetId))
		return result

	} catch (err	) {
		console.log(err)
		return null 
	}
}
