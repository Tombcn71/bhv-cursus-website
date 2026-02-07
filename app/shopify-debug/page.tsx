import { getProducts } from "@/lib/shopify";

export default async function ShopifyDebugPage() {
  const products = await getProducts({});

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8">Shopify Producten</h1>
        
        {products.length === 0 ? (
          <p className="text-muted-foreground">Geen producten gevonden. Controleer je Shopify store en API token.</p>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-navy mb-2">{product.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">Product ID: {product.id}</p>
                
                <h3 className="font-medium text-navy mb-2">Variants:</h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="bg-muted p-3 rounded-md">
                      <p className="font-medium">{variant.title}</p>
                      <p className="text-sm text-muted-foreground">Variant ID: <code className="bg-background px-2 py-1 rounded">{variant.id}</code></p>
                      <p className="text-sm text-muted-foreground">Prijs: {variant.price.amount} {variant.price.currencyCode}</p>
                      <p className="text-sm text-muted-foreground">Beschikbaar: {variant.availableForSale ? "Ja" : "Nee"}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
