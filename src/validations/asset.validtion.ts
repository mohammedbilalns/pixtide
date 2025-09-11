import {number, z} from "zod"

export const AssetSchema = z.object({
	title: z.string().min(2,"Title must be atleast 2 characters long").max(50, "Title cannot exceed 50 character "),
	description: z.string().min(5, "Description must be atleast 5 characters long").max(200, "Description cannot exceed 200 characters "),
	categoryId: z.coerce.number().int().positive(),
	fileUrl: z.url('Invalid file url'),
	thumbnailUrl: z.url("Invalid thumbnail url").optional(),
	fileId: z.string()
})


export type AssetType = z.infer<typeof AssetSchema>


