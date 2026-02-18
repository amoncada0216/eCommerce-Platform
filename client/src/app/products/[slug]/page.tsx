type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const API_URL = process.env["NEXT_PUBLIC_API_URL"];

  if (!API_URL) {
    throw new Error("API URL not defined");
  }

  const res = await fetch(`${API_URL}/api/v1/products/${slug}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Product not found");
  }

  const product = await res.json();

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.brand}</p>
      <p>${product.price}</p>
      <p>{product.description}</p>

      {isOutOfStock && <p style={{ color: "red" }}>Out of stock</p>}

      {isLowStock && (
        <p style={{ color: "orange" }}>Only {product.stock} left in stock</p>
      )}

      {!isOutOfStock && <button>Add to Cart</button>}
    </div>
  );
}
