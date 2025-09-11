'use server'
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { asset, invoice, payment, purchase, user } from "@/lib/db/schema"
import { generateInvoiceHtml } from "@/lib/invoice/invoice-html-generator"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { v4 as uuidv4 } from "uuid" 
import { success } from "zod"

export async function createInvoiceAction(purchaseId: string){


	try{
		const session = await auth.api.getSession({
			headers: await headers()
		})
		if(!session?.user?.id){
			return {
				success: false, 
				error : "Not authenticated"
			}
		}

		const [purchasedData]  = await db.select({
			purchase: purchase,
			asset: asset,
			payment: payment, 
			user: user 
		}).from(purchase).innerJoin(asset, eq(purchase.assetId, asset.id)).innerJoin(payment,eq(purchase.paymentId, payment.id)).where(eq(purchase.id, purchaseId)).innerJoin(user,eq(purchase.userId , user.id)).limit(1)

		if(!purchasedData){
			return {
				success: false , 
				error : "Purchase not found "
			}
		}
		if(purchasedData.purchase.userId !== session.user.id){
			return {
				success: false, 
				error: "Not authorized"
			}
		}

		const invoiceNumber = `INV-${new Date().getFullYear()}${(new Date().getMonth() +1).toString().padStart(2,"0")}-${Math.floor(1000+ Math.random() *9000)}`

		const htmlContent = generateInvoiceHtml(invoiceNumber, new Date(purchasedData.purchase.createdAt), purchasedData.asset.title,purchasedData.purchase.price) 

		const [newInvoice ] = await db.insert(invoice).values({
			id: uuidv4(),
			invoiceNumber,
			purchaseId: purchasedData.purchase.id,
			userId: purchasedData.user.id ,
			currency: 'USD',
			status: 'paid',
			htmlContent,
			createdAt: new Date(),
			updatedAt: new Date(),
			amount: purchasedData.purchase.price

		}).returning()

		revalidatePath('/dashboard/purchases')
		return {
			success : true, 
			invoiceId : newInvoice.id 
		}
	}catch(err){

		console.log(err)
		return {
			success: false, 
			error: 'Failed to create invoice'
		}

	}
}


export async function getUserInvoicesAction(){
	try{
		const session = await auth.api.getSession({
			headers: await headers()
		})
		if(!session?.user.id){
			return {
				success: false ,
				error : "Login to fetch invoices "
			}
		}
		const userInvoices = await db.select().from(invoice).where(eq(invoice.userId, session.user.id)).orderBy(invoice.createdAt)

		return {
			success: true , 
			invoices : userInvoices
		}

	}catch(err){

		return {
			success: false , 
			error : "Failed to fetch user invoices "
		}
	}
}


export async function getInvoiceHtmlAction(invoiceId: string){
	try{
		const session = await auth.api.getSession({
			headers: await headers()
		})
		if(!session?.user.id){
			return {
				success: false ,
				error : "Login to fetch invoices "
			}
		}

		const [invoiceData ]  = await db.select().from(invoice).where(eq(invoice.id,invoiceId)).limit(1)

		if(!invoiceData){
			return {
				success: false ,
				error : "Invoice not found"
			}
		}
		if(invoiceData.userId !== session.user.id ){
			return {
				success: false, 
				error : "Not authorized"
			}
		}

		if(!invoiceData.htmlContent){
			return {
				success: false, 
				error: 'Invoice html  not found '
			}
		}

		return {
			success : true , 
			html: invoiceData.htmlContent
		}


	}catch(err){
		console.log(err)
		return {
			success: false, 
			error : "Failed to fetch invoice Html "
		}
	}
}


export async function getInvoiceByAction(invoiceId: string){
	try{
		const session = await auth.api.getSession({
			headers: await headers()
		})
		if(!session?.user.id){
			return {
				success: false ,
				error : "Login to fetch invoices "
			}
		}

		const [invoiceData ]  = await db.select().from(invoice).where(eq(invoice.id,invoiceId)).limit(1)

		if(!invoiceData){
			return {
				success: false ,
				error : "Invoice not found"
			}
		}
		if(invoiceData.userId !== session.user.id ){
			return {
				success: false, 
				error : "Not authorized"
			}
		}

		if(!invoiceData.htmlContent){
			return {
				success: false, 
				error: 'Invoice content  not found '
			}
		}

		return {
			success : true , 
			invoice: invoiceData
		}


	}catch(err){
		console.log(err)
		return {
			success: false, 
			error : "Failed to fetch invoice "
		}
	}
}
