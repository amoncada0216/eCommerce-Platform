import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  imageUrl: string;
};

type ProductsResponse = {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;

  const currentPage = Number(page ?? "1");

  const API_URL = process.env["NEXT_PUBLIC_API_URL"];
  if (!API_URL) throw new Error("API URL not defined");

  const res = await fetch(`${API_URL}/api/v1/products?page=${currentPage}&limit=8`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const { data, meta }: ProductsResponse = await res.json();

  return (
    <div>
      <h1>Products</h1>

      <div>
        {data.map((product) => (
          <div key={product.id}>
            <Link href={`/products/${product.slug}`}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </Link>
          </div>
        ))}
      </div>

      <div>
        {currentPage > 1 && <a href={`/products?page=${currentPage - 1}`}>Previous</a>}

        {currentPage < meta.totalPages && (
          <a href={`/products?page=${currentPage + 1}`}>Next</a>
        )}
      </div>
    </div>
  );
}
