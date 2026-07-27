import React, { useEffect, useState } from 'react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
        const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

        const response = await fetch(
          `https://${domain}/api/2026-07/graphql.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({
              query: `
                query {
                  products(first: 20) {
                    nodes {
                      id
                      title
                      handle
                      description
                      featuredImage {
                        url
                        altText
                      }
                      priceRange {
                        minVariantPrice {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              `,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Shopify could not be reached.');
        }

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0]?.message || 'Shopify returned an error.');
        }

        setProducts(data.data?.products?.nodes || []);
      } catch (err) {
        console.error(err);
        setError('We could not load the shop right now.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-20 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold">
            Shop
          </h1>

          <p className="mt-4 text-muted-foreground">
            Gifts for fragrance lovers.
          </p>
        </div>

        {loading && (
          <p className="text-center text-muted-foreground">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-center text-muted-foreground">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-muted-foreground">
            Products coming soon.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const price = product.priceRange?.minVariantPrice;

            return (
              <div
                key={product.id}
                className="border border-border/50 rounded-xl overflow-hidden"
              >
                {product.featuredImage && (
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    className="w-full aspect-square object-cover"
                  />
                )}

                <div className="p-5">
                  <h2 className="text-lg font-medium">
                    {product.title}
                  </h2>

                  {price && (
                    <p className="mt-2 text-primary">
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: price.currencyCode,
                      }).format(Number(price.amount))}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
