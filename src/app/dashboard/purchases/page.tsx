import { getUserInvoicesAction } from "@/actions/invoice-actions"
import { getAllUserPurchasedAssetsAction } from "@/actions/payment-actions"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { Download, FileText, Package, Calendar } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Purchases() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session?.user?.id) {
    redirect('/login')
  }
  
  const purchasesResult = await getAllUserPurchasedAssetsAction()
  const invoicesResult = await getUserInvoicesAction() 
  
  const purchases = Array.isArray(purchasesResult) ? purchasesResult : []
  const invoices = invoicesResult.success ? invoicesResult.invoices : []; 
  
  const purchaseToInvoiceMap = new Map()
  invoices?.forEach(inv => purchaseToInvoiceMap.set(inv.purchaseId, inv.id))

  return (
    <div className="container py-12 px-4 md:px-6  mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">My Purchases</h1>
        <p className="text-muted-foreground mt-2">
          View and download all your purchased assets and invoices
        </p>
      </div>

      {purchases.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <Package className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold">No purchases yet</h3>
                <p className="text-muted-foreground mt-1">
                  You haven&apos;t purchased any assets yet. Start exploring our marketplace!
                </p>
              </div>
              <Button asChild className="mt-4">
                <a href="/marketplace">Browse Marketplace</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Your Assets ({purchases.length})
              </CardTitle>
              <CardDescription>
                All your purchased digital assets in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchases.map(({ purchase, asset }) => (
                  <div 
                    key={purchase.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={asset.fileUrl} 
                        alt={asset.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium truncate text-lg">{asset?.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>Purchased on {new Date(purchase.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <Button size="sm" asChild className="flex-1 sm:flex-none">
                        <a href={`/api/download/${asset.id}`} download>
                          <Download className="mr-2 w-4 h-4"/>
                          Download
                        </a>
                      </Button>
                      
                      {purchaseToInvoiceMap.has(purchase.id) && (
                        <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                          <a 
                            href={`/api/invoice/${purchaseToInvoiceMap.get(purchase.id)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <FileText className="mr-2 w-4 h-4" />
                            Invoice
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
