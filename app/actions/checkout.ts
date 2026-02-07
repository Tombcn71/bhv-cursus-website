"use server";

import { createCart, addCartLines } from "@/lib/shopify";

export async function createCheckoutUrl(variantId: string, quantity: number = 1): Promise<string | null> {
  try {
    const cart = await createCart();
    
    const updatedCart = await addCartLines(cart.id, [
      {
        merchandiseId: variantId,
        quantity: quantity,
      },
    ]);

    // Add return_to parameter so "Return to shop" links to our site
    const separator = updatedCart.checkoutUrl.includes("?") ? "&" : "?";
    return `${updatedCart.checkoutUrl}${separator}return_to=${encodeURIComponent("https://bhv-certificering.nl")}`;
  } catch (error) {
    console.error("Error creating checkout:", error);
    return null;
  }
}
