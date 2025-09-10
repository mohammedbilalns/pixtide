import {z} from "zod"

export const CategorySchema = z.object({
	name: z.string().min(2,"Category name must be atleast 2 characters").max(50, "Category name must be less than 50 characters")

})
export type CategoryFormValues = z.infer<typeof CategorySchema>
