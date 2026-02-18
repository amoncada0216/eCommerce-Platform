"use client";

import { api } from "@/lib/api";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    api
      .get("/health")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main>
      <h1>Ecommerce v1</h1>
    </main>
  );
}
