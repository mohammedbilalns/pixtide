import { db } from "@/lib/db";
import { asset, category, user } from "@/lib/db/schema";
import { and, eq, count } from "drizzle-orm";

const ITEMS_PER_PAGE = 10;

export async function getPublicAssetsAction(page: number, categoryId?: number) {
    try {
  
        const conditions = [eq(asset.isApproved, "approved")];

        if (categoryId) {
            conditions.push(eq(asset.categoryId, categoryId));
        }

        const skip = (page - 1) * ITEMS_PER_PAGE;

        const assets = await db
            .select({
                asset: asset,
                categoryName: category.name,
                userName: user.name,
            })
            .from(asset)
            .leftJoin(category, eq(asset.categoryId, category.id))
            .leftJoin(user, eq(asset.userId, user.id))
            .where(and(...conditions)) 
            .limit(ITEMS_PER_PAGE)
            .offset(skip);

        const [{ count: totalItems }] = await db
            .select({ count: count() }) 
            .from(asset)
            .where(and(...conditions));

        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        return {
            assets,
            totalPages,
        };

    } catch (e) {
        console.error("Failed to fetch public assets:", e); 
        return {
            assets: [],
            totalPages: 0,
        };
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
