"use client"
import { approveAssetAction, rejectAssetAction } from "@/actions/admin-actions"
import Alert from "../common/alert"
import { Button } from "../ui/button"
import { toast } from "sonner"
export default function AssetManagementControls({assetId}:{assetId: string}){

	const handleAssetApproval = async()=>{
		try{
			const response = await approveAssetAction(assetId)
			if(response.success){
				toast(response.message)
			}else{
				toast(response.message)
			}

		}catch(error){
			console.log(error)
		}


	}
	const handleAssetRejection = async()=>{
	 try{
			const response = await rejectAssetAction(assetId)
			if(response.success){
				toast(response.message)
			}else{
				toast(response.message)
			}

		}catch(error){
			console.log(error)
		}	
	}

	return <div className="flex justify-between items-center pb-5 px-5 ">
		<Alert 
			title="Approve Asset"
			description="Are you sure you want to approve this asset"
			onConfirm={handleAssetApproval}
			trigger = {
				<Button className="bg-teal-500 hover:bg-teal-600 cursor-pointer">Approve</Button>
			}
		/>
		<Alert 
			title="Approve Asset"
			description="Are you sure you want to approve this asset"
			onConfirm={handleAssetRejection}
			trigger = {
				<Button className="bg-red-500 hover:bg-red-600 cursor-pointer">Reject</Button>
			}
		/>

	</div> 
}
