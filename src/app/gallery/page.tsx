import { getCategoriesAction } from "@/actions/dashboard-actions";
import { getPublicAssetsAction } from "@/actions/public-actions";
import { PaginationControls } from "@/components/gallery/pagination-controls";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense} from "react";


interface GalleryPageProps {
	searchParams: {
		category?: string; 
		page?: string; 
	}
}

export default function GalleryPage({searchParams}:GalleryPageProps){

	return (
		<Suspense fallback={
			<div className="flex items-center justify-center min-h-[65vh]">
				<Loader2 className="h-8 w-8 animate-spin text-black"/>
			</div>
		} >

			<GalleryContent searchParams={searchParams} />

		</Suspense>
	) 
}


async function GalleryContent({searchParams}:GalleryPageProps){
	const categoryId =  searchParams.category ? parseInt(searchParams.category): undefined
	const currentPage = searchParams.page ? parseInt(searchParams.page) : 1
	const categories = await getCategoriesAction()
	const {assets, totalPages} = await getPublicAssetsAction(currentPage, categoryId)
	//const assets = await getPublicAssetsAction(categoryId)

	return <div className="container mx-auto min-h-screen px-4 bg-white">
		<div className="sticky top-0 z-30 g-white border-b py-3 px-4">
			<div className="container flex overflow-x-auto gap-2">
				<Button variant={ !categoryId ? 'default' : 'outline'} size="sm" className={
					!categoryId ? 'bg-black text-white' : ''
				}>

					<Link  href="/gallery">All</Link>

				</Button>
				{
					categories.map(c =>(
						<Button key={c.id} variant={categoryId == c.id ? 'default' : 'outline'} 
							size="sm"
							className={
								categoryId == c.id ? 'bg-black text-white' : ''
							}
							asChild
						>
							<Link href={`/gallery?category=${c.id}`}>{c.name}</Link>
						</Button>
					))
				}
			</div>

		</div>

		<div className="container py-12 " >
			{
				assets.length === 0 ? <p className="text-xl text-center font-bold" >No assets uploaded</p>
					: (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{
								assets.map(({asset,categoryName, userName})=>(
									<Link href={`/gallery/${asset.id}`} key={asset.id} className="block">
										<div className="group relative overflow-hidden rounded-lg aspect-square">
											<Image
												src={asset.fileUrl}
												alt={asset.title}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-105"
											/>

											<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">

												<div className="absolute bottom-0 left-0 right-0 p-4">
													<h3 className="text-white font-medium text-lg">{asset?.title}</h3>
													<div className="flex justify-between items-center mt-2">
														<span className="text-white/80 text-sm">{userName}</span>
														<span className="bg-white/25 text-white text-xs px-2 py-1 rounded-full">{categoryName}</span>
													</div>
												</div>

											</div>
										</div>
									</Link>

								))
							}

						</div>
					)

			}

			{
				totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} searchParams={searchParams} />
			}

		</div>

	
		
	</div>
}
