
import { ProductCard } from "@/src/shared/components/product-card"
import { getRandomProducts } from "@/src/entities/product/services/productService"

export async function RandomProductList() {
  const products = await getRandomProducts()

  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => <ProductCard key={product.slug} product={product} />)}
    </div>
  )
}
