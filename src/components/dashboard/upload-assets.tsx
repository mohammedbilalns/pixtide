'use client'
import { Plus, Upload } from "lucide-react"
import { Dialog, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import { DialogContent, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { uploadAssetAction } from "@/actions/dashboard-actions"


type Category  = {
	id: number, 
	name: string, 
	createdAt: Date
}

interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  url: string;
  secure_url: string;
}

interface UploadDialogProps {
	categories: Category[],
}

type FormState =  {
	title: string, 
	description : string; 
	categoryId: string; 
	file: File | null 
}

type CloudinarySignature =  {
	signature: string, 
	timestamp: number, 
	apiKey: string, 
}

export default function UploadAssets({categories}: UploadDialogProps){
	const [open , setOpen ] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [uploadProgressStatus, setUploadProgressStatus] = useState(0)
	const [formState , setFormState] = useState<FormState>({
		title: "",
		description: "",
		categoryId: "",
		file: null 
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >)=>{
		const {name, value} = e.target
		setFormState(prev => ({...prev, [name]: value}))
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
		const file = e.target.files?.[0]
		if(file){
			setFormState(prev => ({...prev, file}))
		}

	}

	const handleCategoryChange = (value: string)=>{
		setFormState((prev)=> ({...prev, categoryId: value}))	

	}

	async function getCloudinaySignature(): Promise<CloudinarySignature> {
 		const timestamp = Math.round(new Date().getTime()/1000)
		const response = await fetch('/api/cloudinary/signature',{
			method: "POST",
			headers: {
				'Content-Type': "application/json",
			},
			body: JSON.stringify({timestamp})
		})

		if(!response.ok){
			throw new Error("Failed to create cloudinary singnature")
		}
		return response.json()
	}

	const handleAssetUpload =  async (event: React.FormEvent)=> {
		event.preventDefault()
		setIsUploading(true )
		setUploadProgressStatus(0)
		try{
			const {signature, apiKey, timestamp} = await getCloudinaySignature(); 
			const cloudinaryData = new FormData()
			cloudinaryData.append('file', formState.file as File)
			cloudinaryData.append('api_key', apiKey)
			cloudinaryData.append('timestamp', timestamp.toString())
			cloudinaryData.append('signature', signature)
			cloudinaryData.append('folder','asset_manager')
			const xhr = new XMLHttpRequest()
			xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`)
			xhr.upload.onprogress = (event) =>{
				if(event.lengthComputable){
					const progress = Math.round((event.loaded/event.total)* 100)
					setUploadProgressStatus(progress)
				}
			}

			const cloudinaryPromise = new Promise<CloudinaryUploadResponse>((resolve, reject)=>{
				xhr.onload = ()=>{
					if(xhr.status >= 200 && xhr.status <300){
						const response = JSON.parse(xhr.responseText)
						resolve(response)
					}else{
						reject(new Error('Upload to cloudinary failed'))
					}
				}

				xhr.onerror = ()=> reject(new Error("Upload to cloudinary failed"))
			})
			xhr.send(cloudinaryData)

			const cloudinaryResponse  = await cloudinaryPromise
			const formData = new FormData()
			formData.append('title', formState.title)
			formData.append('description', formState.description)
			formData.append('categoryId' , formState.categoryId)
			formData.append('fileUrl', cloudinaryResponse.secure_url)
			formData.append('thumbnailUrl', cloudinaryResponse.secure_url)
			formData.append('fileId', cloudinaryResponse.public_id)

			const result = await uploadAssetAction(formData)
			if(result.success){
				setOpen(false)
				setFormState({title:"", description:"",categoryId:"", file:null})

			}else{
				throw new Error(result.message)
			}
			
		}catch(err){
			console.log(err)

		}finally{
			setIsUploading(false)
			setUploadProgressStatus(0)
		}

	}

	return <Dialog open={open} onOpenChange={setOpen} >
		<DialogTrigger asChild  >
			<Button className="bg-teal-500 hover:bg-teal-600 text-white cursor-pointer"  >
				<Plus className="mr-2 w-4, h-4" />
				Upload Asset
			</Button>
		</DialogTrigger>
		<DialogContent className="sm:max-w-[600px]">
			<DialogHeader>
				<DialogTitle className="mb-2">Upload New Asset</DialogTitle>
			</DialogHeader>

			<form onSubmit={handleAssetUpload} className="space-y-5">
				<div className="space-y-2">
					<Label htmlFor="title" >Title</Label>
					<Input value={formState.title} onChange={handleInputChange} id="title" name="title" placeholder="Enter Title" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="description" >Description</Label>
					<Textarea value={formState.description} onChange={handleInputChange} id="description" name="description" placeholder="Enter description" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="categories" >Categories</Label>
					<Select value={formState.categoryId} onValueChange={handleCategoryChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select a category"></SelectValue>
						</SelectTrigger>
						<SelectContent>
							{
								categories.map(c =>(
									<SelectItem key={c.id} value={c.id.toString()}>
										{c.name}
									</SelectItem>
								))
							}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="description" >Description</Label>
					<Input onChange={handleFileChange}  id="file" type="file" accept="image/" />

				</div>

				{
					isUploading &&  uploadProgressStatus> 0 && (
					<div className="mb-10 w-full bg-stone-100 rounded-full h-2">
							<div className="bg-teal-500 h-2 rounded-full" style={{width:`${uploadProgressStatus}%`}}   />
							<p className="text-xs text-slate-500 mt-2 text-right">{uploadProgressStatus}% uploaded</p>
						</div>
					)
				}
				<DialogFooter>
					<Button disabled={isUploading} className="cursor-pointer bg-teal-500 hover:bg-teal-600" type="submit">
						<Upload className="mr-2 h-5 w-5" />
						{isUploading ? "Uploading Asset..." : "Upload Asset"}
					</Button>
				</DialogFooter>

			</form>
		</DialogContent>
	</Dialog>
}
