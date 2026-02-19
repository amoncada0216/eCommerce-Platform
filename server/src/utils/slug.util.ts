import { Prisma } from "@prisma/client";

export function createBaseSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces → dash
    .replace(/-+/g, "-"); // collapse multiple dashes
}

export async function generateUniqueSlugTx(
  tx: Prisma.TransactionClient,
  name: string,
): Promise<string> {
  const baseSlug = createBaseSlug(name);

  const existing = await tx.product.findMany({
    where: {
      slug: { startsWith: baseSlug },
    },
    select: { slug: true },
  });

  if (existing.length === 0) return baseSlug;

  const slugSet = new Set(existing.map((p) => p.slug));

  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;

  while (slugSet.has(newSlug)) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }

  return newSlug;
}
