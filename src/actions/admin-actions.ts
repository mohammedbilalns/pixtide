'use server'
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { category,user, asset} from "@/lib/db/schema"
import { CategorySchema } from "@/validations/category.validation"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"



async function checkSession(){
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if(!session?.user || session.user.role !== 'admin'){
		throw new Error("You must be an admin to do this action ")
	}
}

export async function addNewCategoryAction(formData: FormData){
	await checkSession()	
	try{
		const name = formData.get('name') as string 
		const validatedFields = CategorySchema.parse({name})
		const existingCategory = await db.query.category.findFirst({
			where: eq(category.name, validatedFields.name)
		}) 
		if(existingCategory){
			return {
				success: false , 
				message: "Category with the same name already exists "
			}	
		}

		await db.insert(category).values({
			name: validatedFields.name 
		})

		revalidatePath('/admin/settings')
		return {
			success:true, 
			message: "New Category added"
		}

	}catch(err){
		console.log(err)
		return {
			success:false, 
			message: "Failed to create new category "
		} 
	}
}

export async function getAllCategoriesAction(){
	try{
		return await db.select().from(category).orderBy(category.name)

	}catch(err){
		console.log(err)
		return []
	}
}


export async function getTotalUsersCountAction(){
	await checkSession()
	try{
		const result = await db.select({count: sql<number>`count(*)`}).from(user).where(eq(user.role,"user"))
		return result[0]?.count || 0; 
	}catch(err){
		console.log(err)
		return 0  
	}

}


export async function deleteCategoryAction( categoryId: number){
	await checkSession()
	try {
		await db.delete(category).where(eq(category.id, categoryId ))
	  revalidatePath('/admin/settings')	

		return {
			success: true, 
			message: "Category Deleted Successfully"
		}
	} catch (error) {
		console.log(error)
		return {
			success: false, 
			message: "Failed to delete category "
		}
	}
}


export async function getTotalAssetsCountAction(){
  await checkSession()	
	try{
		const result = await db.select({count: sql<number>`count(*)`}).from(asset)
		return result[0]?.count || 0; 
	}catch(err){
		console.log(err)
		return 0  
	}

}

export async function approveAssetAction(assetId: string){
  	await checkSession()

	try {

		await db.update(asset).set({isApproved:"approved", updatedAt: new Date()}).where(eq(asset.id,assetId))
		revalidatePath('admin/asset-approval')
		return {
			success: true , 
			message: 	"Asset Approved successfully"
		}	
	} catch (err) {
		console.log(err)
		return {
			success: false, 
			message: "Failed to approve asset"
		}
	}

}

export async function rejectAssetAction(assetId: string){
	await checkSession()
	try {
		await db.update(asset).set({isApproved:"rejected", updatedAt: new Date()}).where(eq(asset.id,assetId))
		revalidatePath('admin/asset-approval')
		return {
			success: true , 
			message: 	"Asset Rejected successfully"
		}

	} catch (err) {
		console.log(err)
		return {
			success: false, 
			message: "Failed to reject asset"
		}

	}
}

export async function getPendingAssetsAction(){
	await checkSession()

	try {
		const pendingAssets = await db.select({
			asset: asset,
			userName: user.name
		}).from(asset).leftJoin(user, eq(asset.userId , user.id)).where(eq(asset.isApproved, "pending"))
		return pendingAssets

	} catch (err) {
		console.log(err)
	 	return []	

	}
}
