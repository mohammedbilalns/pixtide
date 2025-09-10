"use client"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Plus, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { addNewCategoryAction, deleteCategoryAction } from "@/actions/admin-actions"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import Alert from "../common/alert"

type Category = {
	id: number;
	name: string; 
	createdAt: Date;
}
interface CategoryMangerProps {
	categories : Category[]
}

export default function CategoryManager({categories: initialCategories }: CategoryMangerProps){
	const [categories, setCategories] = useState<Category[]>(initialCategories)
	const [newCategoryName , setNewCategoryName] = useState('')
	
	const handleAddNewCategory = async (event: React.FormEvent)=>{
		event.preventDefault()
		try{

			const formData = new FormData()
			formData.append('name', newCategoryName)
			const result = await addNewCategoryAction(formData)
			if(result.success){
				const newCategory = {
					id: Math.max(0,...categories.map(c => c.id))+1,
					name: newCategoryName,
					createdAt : new Date()
				}
				setCategories([...categories, newCategory])
				setNewCategoryName('')
				toast(result.message || "New Category added")
			}else{
				toast(result.message || "Failde to add category")
			}
		}catch(err){
			console.log(err)
		}

	}

	const handleDeleteCategory = async (id: number)=>{
		const res = await deleteCategoryAction(id)
		if(res?.success){
			setCategories( categories.filter(c => c.id  != id))
		 toast(res.message)	
		}
	}

	return <div className="space-y-6">
		<form onSubmit={handleAddNewCategory} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="categoryName" >New Category</Label>
				<div className="flex gap-2 ">
					<Input
						id="categoryName" placeholder="Enter category name"
					  value={newCategoryName}	
						onChange={(e)=> setNewCategoryName(e.target.value)}
					/>
					<Button type="submit"  className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white">
						<Plus className="h-4 w-5 mr-3"/>
						Add
					</Button>
				</div>
			</div>
		</form>

		<div>
			<h3 className="text-lg font-medium mb-4" >Categories</h3>
			{
				categories.length === 0 ? 
					<p>No categoris added. Add your first category above.</p> : 
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Created</TableHead>
								<TableHead className="w-[100px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{
								categories.map(category => (
									<TableRow key={category.id}>
										<TableCell className="font-medium">{category.name}</TableCell>
										<TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
										<TableCell>
											<Alert 
												title="Delete Category"
												description="Are you sure you want to delete this category?"
												onConfirm = {()=> handleDeleteCategory(category.id)}
												trigger = {
													<Button className="cursor-pointer" variant='ghost' size='icon'>
														<Trash2Icon className="h-5 w-5 text-red-500 "  />
													</Button>
												}

											/>
											
										</TableCell>

									</TableRow>
								))
							}
						</TableBody>
					</Table>
			}
		</div>
	</div>
}
