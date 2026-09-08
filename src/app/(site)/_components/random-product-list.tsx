import { ProductCard } from "@/src/entities/product/ui/product-card"
import { getRandomProducts } from "@/src/entities/product/services/product-service"

export async function RandomProductList() {
  const products = await getRandomProducts()

  return (
    <div className="grid grid-cols-2 gap-3 max-[359px]:grid-cols-1 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  )
}
