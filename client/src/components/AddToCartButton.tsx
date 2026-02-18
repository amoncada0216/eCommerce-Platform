"use client";

import { useCart } from "@/context/CartContext";

type Props = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
};

export default function AddToCartButton(props: Props) {
  const { addToCart } = useCart();

  const isOutOfStock = props.stock === 0;

  return (
    <button
      disabled={isOutOfStock}
      className="cursor-pointer"
      onClick={() =>
        addToCart({
          id: props.id,
          name: props.name,
          price: props.price,
          imageUrl: props.imageUrl,
          stock: props.stock,
        })
      }
    >
      {isOutOfStock ? "Out of stock" : "Add to Cart"}
    </button>
  );
}
