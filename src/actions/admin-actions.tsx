'use server'
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { category, user } from "@/lib/db/schema"
import { CategorySchema } from "@/validations/category.validation"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function addNewCategoryAction(formData: FormData){
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if(!session?.user || session.user.role !== 'admin'){
		throw new Error("You must be an admin to add categories ")
	}

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
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if(!session?.user || session.user.role !== 'admin'){
		throw new Error("You must be an admin to access this data")
	}

	try{
		const result = await db.select({count: sql<number>`count(*)`}).from(user)
		return result[0]?.count || 0; 
	}catch(err){
		console.log(err)
		return 0  
	}

}
