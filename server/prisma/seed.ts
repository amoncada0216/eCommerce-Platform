import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

import data from "../../zProject Docs/products.json" with { type: "json" };

const prisma = new PrismaClient();

async function main() {
  // ---- Create Admin User ----

  const adminEmail = "admin@admin.com";
  const adminPassword = "Admin123*";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created.");
  } else {
    console.log("Admin already exists.");
  }

  // ---- Seed Products ----

  const products = data as {
    name: string;
    brand: string;
    description: string;
    price: number;
    stock: number;
  }[];

  const formattedData = products.map((product) => {
    const slug = product.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    return {
      ...product,
      slug,
    };
  });

  await prisma.product.createMany({
    data: formattedData,
    skipDuplicates: true,
  });

  console.log("Products inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
