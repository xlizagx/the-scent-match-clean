import React, { useEffect, useMemo, useState } from 'react';

const API_VERSION = '2026-07';
const CART_STORAGE_KEY = 'scentMatchCartId';

const WANTED_COLLECTIONS = [
  {
    shopifyTitle: 'Fragrance Lovers Hoodies',
    displayTitle: 'Hoodies',
    type: 'hoodie',
  },
  {
    shopifyTitle: 'Fragrance Lovers Tote Bags',
    displayTitle: 'Tote Bags',
    type: 'tote',
  },
  {
    shopifyTitle: 'Fragrance Lovers Mugs',
    displayTitle: 'Mugs',
    type: 'mug',
  },
];

const COLLECTION_INTROS = {
  hoodie: 'Designs created for fragrance lovers.',
  tote: 'Designed for fragrance lovers on the go.',
  mug: 'For coffee, tea and conversations about perfume.',
};

const SIZE_GUIDE = [
  { size: 'S', length: '68.6 cm', width: '101.6 cm', halfChest: '50.8 cm' },
  { size: 'M', length: '71.1 cm', width: '111.8 cm', halfChest: '55.9 cm' },
  { size: 'L', length: '73.7 cm', width: '122 cm', halfChest: '61 cm' },
  { size: 'XL', length: '76.2 cm', width: '132 cm', halfChest: '66 cm' },
  { size: '2XL', length: '78.7 cm', width: '142.2 cm', halfChest: '71.1 cm' },
  { size: '3XL', length: '81.3 cm', width: '152.4 cm', halfChest: '76.2 cm' },
  { size: '4XL', length: '84 cm', width: '162 cm', halfChest: '81 cm' },
  { size: '5XL', length: '86 cm', width: '172 cm', halfChest: '86 cm' },
];

const COLLECTION_QUERY = `
  query ShopCollections {
    collections(first: 20) {
      nodes {
        id
        title
        handle
        products(first: 50) {
          nodes {
            id
            title
            handle
            availableForSale
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
    }
  }
`;

const PRODUCT_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      availableForSale

      featuredImage {
        url
        altText
      }

      images(first: 50) {
        nodes {
          id
          url
          altText
        }
      }

      options {
        id
        name
        values
      }

      variants(first: 100) {
        nodes {
          id
          title
          availableForSale

          price {
            amount
            currencyCode
          }

          selectedOptions {
            name
            value
          }

          image {
            url
            altText
          }
        }
      }
    }
  }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity

  cost {
    totalAmount {
      amount
      currencyCode
    }
  }

  lines(first: 100) {
    nodes {
      id
      quantity

      merchandise {
        ... on ProductVariant {
          id
          title

          price {
            amount
            currencyCode
          }

          selectedOptions {
            name
            value
          }

          image {
            url
            altText
          }

          product {
            title
            handle

            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

const CART_GET_QUERY = `
  query CartGet($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ${CART_FIELDS}
      }

      userErrors {
        field
        message
      }
    }
  }
`;

const CART_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }

      userErrors {
        field
        message
      }
    }
  }
`;

const CART_UPDATE_MUTATION = `
  mutation CartLinesUpdate(
    $cartId: ID!
    $lines: [CartLineUpdateInput!]!
  ) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }

      userErrors {
        field
        message
      }
    }
  }
`;

const CART_REMOVE_MUTATION = `
  mutation CartLinesRemove(
    $cartId: ID!
    $lineIds: [ID!]!
  ) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }

      userErrors {
        field
        message
      }
    }
  }
`;

function formatPrice(price) {
  if (price?.amount === undefined || price?.amount === null) {
    return '';
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currencyCode || 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(price.amount));
}

function getProductHandleFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('product');
}

function isSizeOption(name = '') {
  return name.toLowerCase() === 'size';
}

function isColourOption(name = '') {
  const normalised = name.toLowerCase();
  return normalised === 'colour' || normalised === 'color';
}

function optionValueForVariant(variant, optionName) {
  return variant?.selectedOptions?.find(
    (option) => option.name === optionName
  )?.value;
}

function productBelongsToCollection(collections, handle, type) {
  return collections.some(
    (collection) =>
      collection.type === type &&
      collection.products.nodes.some(
        (product) => product.handle === handle
      )
  );
}

export default function Shop() {
  const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [shopError, setShopError] = useState('');

  const [productHandle, setProductHandle] = useState(
    getProductHandleFromUrl()
  );

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productError, setProductError] = useState('');

  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const [cart, setCart] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBusy, setCartBusy] = useState(false);
  const [cartError, setCartError] = useState('');

  async function shopifyRequest(query, variables = {}) {
    if (!domain || !token) {
      throw new Error('Shopify connection details are missing.');
    }

    const response = await fetch(
      `https://${domain}/api/${API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Shopify could not be reached.');
    }

    const result = await response.json();

    if (result.errors?.length) {
      throw new Error(
        result.errors[0]?.message ||
          'Shopify returned an error.'
      );
    }

    return result.data;
  }

  useEffect(() => {
    async function loadCollections() {
      try {
        setLoadingCollections(true);
        setShopError('');

        const data = await shopifyRequest(COLLECTION_QUERY);
        const allCollections =
          data?.collections?.nodes || [];

        const organised = WANTED_COLLECTIONS
          .map((wanted) => {
            const collection = allCollections.find(
              (item) =>
                item.title === wanted.shopifyTitle
            );

            if (!collection) {
              return null;
            }

            return {
              ...collection,
              displayTitle: wanted.displayTitle,
              type: wanted.type,
            };
          })
          .filter(Boolean);

        setCollections(organised);
      } catch (error) {
        console.error(error);
        setShopError(
          'We could not load the shop right now.'
        );
      } finally {
        setLoadingCollections(false);
      }
    }

    loadCollections();
  }, []);

  useEffect(() => {
    function handlePopState() {
      setProductHandle(getProductHandleFromUrl());
      setSizeGuideOpen(false);
      setCartOpen(false);
    }

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, []);

  useEffect(() => {
    async function loadCart() {
      const savedCartId =
        localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCartId) {
        return;
      }

      try {
        const data = await shopifyRequest(
          CART_GET_QUERY,
          {
            cartId: savedCartId,
          }
        );

        if (data?.cart) {
          setCart(data.cart);
        } else {
          localStorage.removeItem(
            CART_STORAGE_KEY
          );
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem(
          CART_STORAGE_KEY
        );
      }
    }

    loadCart();
  }, []);

  useEffect(() => {
    if (!productHandle) {
      setProduct(null);
      setProductError('');
      return;
    }

    async function loadProduct() {
      try {
        setLoadingProduct(true);
        setProductError('');
        setProduct(null);
        setQuantity(1);
        setSelectedOptions({});
        setSelectedImage('');

        const data = await shopifyRequest(
          PRODUCT_QUERY,
          {
            handle: productHandle,
          }
        );

        if (!data?.product) {
          throw new Error('Product not found.');
        }

        const loadedProduct = data.product;

        setProduct(loadedProduct);

        const firstAvailableVariant =
          loadedProduct.variants?.nodes?.find(
            (variant) =>
              variant.availableForSale
          ) ||
          loadedProduct.variants?.nodes?.[0];

        const initialOptions = {};

        firstAvailableVariant?.selectedOptions?.forEach(
          (option) => {
            initialOptions[option.name] =
              option.value;
          }
        );

        loadedProduct.options?.forEach(
          (option) => {
            if (!initialOptions[option.name]) {
              initialOptions[option.name] =
                option.values?.[0] || '';
            }
          }
        );

        setSelectedOptions(initialOptions);

        setSelectedImage(
          loadedProduct.featuredImage?.url ||
            loadedProduct.images?.nodes?.[0]?.url ||
            ''
        );
      } catch (error) {
        console.error(error);
        setProductError(
          'We could not load this product.'
        );
      } finally {
        setLoadingProduct(false);
      }
    }

    loadProduct();
  }, [productHandle]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.nodes?.length) {
      return null;
    }

    return (
      product.variants.nodes.find((variant) =>
        variant.selectedOptions.every(
          (option) =>
            selectedOptions[option.name] ===
            option.value
        )
      ) || null
    );
  }, [product, selectedOptions]);

  const productIsHoodie = useMemo(() => {
    if (!product) {
      return false;
    }

    return productBelongsToCollection(
      collections,
      product.handle,
      'hoodie'
    );
  }, [product, collections]);

  useEffect(() => {
    if (!product || !selectedVariant?.image?.url) {
      return;
    }

    const variantOptions = selectedVariant.selectedOptions || [];
    const hasColourOption = variantOptions.some((option) =>
      isColourOption(option.name)
    );

    if (hasColourOption) {
      setSelectedImage(selectedVariant.image.url);
    }
  }, [selectedVariant, product]);

  function openProduct(handle) {
    const url = new URL(window.location.href);

    url.searchParams.set('product', handle);

    window.history.pushState({}, '', url);

    setProductHandle(handle);
    setSizeGuideOpen(false);
    setCartOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function backToShop() {
    const url = new URL(window.location.href);

    url.searchParams.delete('product');

    window.history.pushState({}, '', url);

    setProductHandle(null);
    setProduct(null);
    setSizeGuideOpen(false);
    setCartOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function changeOption(optionName, value) {
    setSelectedOptions((current) => ({
      ...current,
      [optionName]: value,
    }));
  }

  function optionValueAvailable(
    optionName,
    value
  ) {
    if (!product?.variants?.nodes) {
      return false;
    }

    return product.variants.nodes.some(
      (variant) => {
        if (!variant.availableForSale) {
          return false;
        }

        const requestedOption =
          optionValueForVariant(
            variant,
            optionName
          );

        if (requestedOption !== value) {
          return false;
        }

        return variant.selectedOptions.every(
          (option) => {
            if (option.name === optionName) {
              return true;
            }

            const currentValue =
              selectedOptions[option.name];

            if (!currentValue) {
              return true;
            }

            return (
              option.value === currentValue
            );
          }
        );
      }
    );
  }

  async function addToCart() {
    if (!selectedVariant?.availableForSale) {
      setCartError(
        'Please choose an available option.'
      );
      return;
    }

    try {
      setCartBusy(true);
      setCartError('');

      const savedCartId =
        localStorage.getItem(CART_STORAGE_KEY);

      let nextCart;

      if (savedCartId) {
        const data = await shopifyRequest(
          CART_ADD_MUTATION,
          {
            cartId: savedCartId,
            lines: [
              {
                merchandiseId:
                  selectedVariant.id,
                quantity,
              },
            ],
          }
        );

        const errors =
          data?.cartLinesAdd?.userErrors || [];

        if (errors.length) {
          throw new Error(
            errors[0].message
          );
        }

        nextCart =
          data?.cartLinesAdd?.cart;
      } else {
        const data = await shopifyRequest(
          CART_CREATE_MUTATION,
          {
            lines: [
              {
                merchandiseId:
                  selectedVariant.id,
                quantity,
              },
            ],
          }
        );

        const errors =
          data?.cartCreate?.userErrors || [];

        if (errors.length) {
          throw new Error(
            errors[0].message
          );
        }

        nextCart = data?.cartCreate?.cart;
      }

      if (!nextCart) {
        throw new Error(
          'Cart could not be created.'
        );
      }

      localStorage.setItem(
        CART_STORAGE_KEY,
        nextCart.id
      );

      setCart(nextCart);
      setCartOpen(true);
    } catch (error) {
      console.error(error);

      setCartError(
        error.message ||
          'We could not add this item to your cart.'
      );
    } finally {
      setCartBusy(false);
    }
  }

  async function updateCartLine(
    lineId,
    nextQuantity
  ) {
    if (!cart?.id) {
      return;
    }

    if (nextQuantity < 1) {
      await removeCartLine(lineId);
      return;
    }

    try {
      setCartBusy(true);
      setCartError('');

      const data = await shopifyRequest(
        CART_UPDATE_MUTATION,
        {
          cartId: cart.id,
          lines: [
            {
              id: lineId,
              quantity: nextQuantity,
            },
          ],
        }
      );

      const errors =
        data?.cartLinesUpdate?.userErrors || [];

      if (errors.length) {
        throw new Error(
          errors[0].message
        );
      }

      setCart(
        data?.cartLinesUpdate?.cart || null
      );
    } catch (error) {
      console.error(error);
      setCartError(
        'We could not update your cart.'
      );
    } finally {
      setCartBusy(false);
    }
  }

  async function removeCartLine(lineId) {
    if (!cart?.id) {
      return;
    }

    try {
      setCartBusy(true);
      setCartError('');

      const data = await shopifyRequest(
        CART_REMOVE_MUTATION,
        {
          cartId: cart.id,
          lineIds: [lineId],
        }
      );

      const errors =
        data?.cartLinesRemove?.userErrors ||
        [];

      if (errors.length) {
        throw new Error(
          errors[0].message
        );
      }

      setCart(
        data?.cartLinesRemove?.cart || null
      );
    } catch (error) {
      console.error(error);
      setCartError(
        'We could not remove this item.'
      );
    } finally {
      setCartBusy(false);
    }
  }

  function goToCheckout() {
    if (!cart?.checkoutUrl) {
      return;
    }

    window.location.href = cart.checkoutUrl;
  }

  function CartButton() {
    return (
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="font-body text-sm border border-primary/40 rounded-full px-5 py-2 text-foreground hover:border-primary hover:text-primary transition-colors"
      >
        Cart ({cart?.totalQuantity || 0})
      </button>
    );
  }

  function renderCart() {
    if (!cartOpen) {
      return null;
    }

    const lines = cart?.lines?.nodes || [];

    return (
      <div
        className="fixed inset-0 z-[100] bg-black/70"
        onClick={() => setCartOpen(false)}
      >
        <aside
          className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l border-border p-5 sm:p-7 overflow-y-auto"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="font-body text-2xl font-light tracking-wide">
              Your Cart
            </h2>

            <button
              type="button"
              onClick={() =>
                setCartOpen(false)
              }
              className="font-body text-3xl font-light leading-none hover:text-primary transition-colors"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {lines.length === 0 ? (
            <p className="font-body text-muted-foreground">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-6">
              {lines.map((line) => {
                const merchandise =
                  line.merchandise;

                const image =
                  merchandise.image ||
                  merchandise.product
                    ?.featuredImage;

                const options =
  (merchandise.selectedOptions || []).filter(
    (option) =>
      !(
        option.name === 'Title' &&
        option.value === 'Default Title'
      )
  );

                return (
                  <div
                    key={line.id}
                    className="flex gap-4 border-b border-border/50 pb-6"
                  >
                    {image?.url && (
                      <img
                        src={image.url}
                        alt={
                          image.altText ||
                          merchandise.product
                            ?.title ||
                          'Product'
                        }
                        className="w-24 h-24 object-cover rounded-lg bg-white"
                      />
                    )}

                    <div className="flex-1 min-w-0 font-body">
                      <h3 className="text-sm font-medium leading-snug">
                        {
                          merchandise.product
                            ?.title
                        }
                      </h3>

                      {options.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {options
                            .map(
                              (option) =>
                                `${option.name}: ${option.value}`
                            )
                            .join(' · ')}
                        </p>
                      )}

                      <p className="mt-2 text-primary">
                        {formatPrice(
                          merchandise.price
                        )}
                      </p>

                      <div className="flex items-center gap-3 mt-4">
                        <button
                          type="button"
                          disabled={cartBusy}
                          onClick={() =>
                            updateCartLine(
                              line.id,
                              line.quantity - 1
                            )
                          }
                          className="w-8 h-8 border border-border rounded-md hover:border-primary transition-colors disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="text-sm">
                          {line.quantity}
                        </span>

                        <button
                          type="button"
                          disabled={cartBusy}
                          onClick={() =>
                            updateCartLine(
                              line.id,
                              line.quantity + 1
                            )
                          }
                          className="w-8 h-8 border border-border rounded-md hover:border-primary transition-colors disabled:opacity-40"
                        >
                          +
                        </button>

                        <button
                          type="button"
                          disabled={cartBusy}
                          onClick={() =>
                            removeCartLine(
                              line.id
                            )
                          }
                          className="ml-auto text-xs underline underline-offset-4 hover:text-primary transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 font-body">
                <div className="flex justify-between text-lg mb-5">
                  <span>Total</span>

                  <span className="text-primary">
                    {formatPrice(
                      cart?.cost?.totalAmount
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={goToCheckout}
                  disabled={
                    !cart?.checkoutUrl ||
                    cartBusy
                  }
                  className="w-full rounded-full bg-primary text-primary-foreground px-6 py-4 text-sm font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}

          {cartError && (
            <p className="font-body mt-4 text-sm text-red-500">
              {cartError}
            </p>
          )}
        </aside>
      </div>
    );
  }

  function renderSizeGuide() {
    if (!sizeGuideOpen) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 z-[110] bg-black/75 flex items-center justify-center p-4"
        onClick={() =>
          setSizeGuideOpen(false)
        }
      >
        <div
          className="bg-background border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-8"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="font-body text-2xl md:text-3xl font-light tracking-wide">
              Hoodie Size Guide
            </h2>

            <button
              type="button"
              onClick={() =>
                setSizeGuideOpen(false)
              }
              className="font-body text-3xl font-light leading-none hover:text-primary transition-colors"
              aria-label="Close size guide"
            >
              ×
            </button>
          </div>

          <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
            Use the garment measurements
            below to help choose your size.
          </p>

          <div className="overflow-x-auto">
            <table className="font-body w-full border-collapse text-left text-sm md:text-base">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-5 font-medium">
                    Size
                  </th>
                  <th className="py-3 pr-5 font-medium">
                    Length
                  </th>
                  <th className="py-3 pr-5 font-medium">
                    Width
                  </th>
                  <th className="py-3 font-medium">
                    Half Chest
                  </th>
                </tr>
              </thead>

              <tbody>
                {SIZE_GUIDE.map((row) => (
                  <tr
                    key={row.size}
                    className="border-b border-border/50"
                  >
                    <td className="py-3 pr-5 font-medium">
                      {row.size}
                    </td>
                    <td className="py-3 pr-5">
                      {row.length}
                    </td>
                    <td className="py-3 pr-5">
                      {row.width}
                    </td>
                    <td className="py-3">
                      {row.halfChest}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="font-body mt-8 space-y-5 text-sm md:text-base text-muted-foreground">
            <div>
              <h3 className="text-foreground font-medium mb-1">
                Length
              </h3>

              <p>
                Place the end of a measuring
                tape beside the collar at the
                top of the hoodie, at the high
                point of the shoulder. Pull
                the tape down to the bottom of
                the hoodie.
              </p>
            </div>

            <div>
              <h3 className="text-foreground font-medium mb-1">
                Half Chest
              </h3>

              <p>
                Lay the garment on a flat
                surface and measure from left
                to right across the chest,
                about 2 cm below the arms.
              </p>
            </div>

            <div>
              <h3 className="text-foreground font-medium mb-1">
                Sleeve Length
              </h3>

              <p>
                Place the end of a measuring
                tape at the centre back of the
                collar. Pull the tape along
                the top seam of the sleeve,
                hold it in place at the
                shoulder, then continue down
                the sleeve to the hem.
              </p>
            </div>

            <p className="pt-2">
              Measurements are provided by
              the supplier and may vary by
              approximately +/- 2.5 cm
              (1 inch).
            </p>
          </div>
        </div>
      </div>
    );
  }

  function renderProductPage() {
    if (loadingProduct) {
      return (
        <main className="min-h-screen pt-32 pb-20 px-5">
          <p className="font-body text-center text-muted-foreground">
            Loading product...
          </p>
        </main>
      );
    }

    if (productError || !product) {
      return (
        <main className="min-h-screen pt-32 pb-20 px-5">
          <div className="max-w-7xl mx-auto">
            <button
              type="button"
              onClick={backToShop}
              className="font-body mb-8 text-sm underline underline-offset-4 hover:text-primary transition-colors"
            >
              ← Back to Shop
            </button>

            <p className="font-body text-muted-foreground">
              {productError ||
                'Product not found.'}
            </p>
          </div>
        </main>
      );
    }

    const images =
      product.images?.nodes || [];

    const options = (product.options || []).filter(
  (option) =>
    !(
      option.name === 'Title' &&
      option.values?.length === 1 &&
      option.values[0] === 'Default Title'
    )
);

    return (
      <main className="min-h-screen pt-28 md:pt-32 pb-20 px-4 sm:px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center gap-4 mb-8">
            <button
              type="button"
              onClick={backToShop}
              className="font-body text-sm underline underline-offset-4 hover:text-primary transition-colors"
            >
              ← Back to Shop
            </button>

            <CartButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
            <div>
              <div className="bg-white rounded-2xl overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full aspect-square object-contain"
                  />
                ) : (
                  <div className="font-body aspect-square flex items-center justify-center text-black">
                    No image available
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                  {images.map((image) => (
                    <button
                      type="button"
                      key={
                        image.id || image.url
                      }
                      onClick={() =>
                        setSelectedImage(
                          image.url
                        )
                      }
                      className={`bg-white rounded-lg overflow-hidden border transition-colors ${
                        selectedImage ===
                        image.url
                          ? 'border-primary'
                          : 'border-border/50 hover:border-primary/60'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={
                          image.altText ||
                          product.title
                        }
                        className="w-full aspect-square object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="font-body lg:pt-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide leading-tight">
                {product.title}
              </h1>

              <p className="text-xl mt-4 text-primary">
                {selectedVariant
                  ? formatPrice(
                      selectedVariant.price
                    )
                  : formatPrice(
                      product.variants
                        ?.nodes?.[0]?.price
                    )}
              </p>

              {product.descriptionHtml && (
                <div
                  className="mt-6 text-sm md:text-base leading-7 text-muted-foreground [&_p]:mb-4 [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:my-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:my-4 [&_ol]:pl-5 [&_ol]:list-decimal [&_li]:mb-1"
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml,
                  }}
                />
              )}

              <div className="mt-8 space-y-7">
                {options.map((option) => {
                  const isSize =
                    isSizeOption(option.name);

                  const isColour =
                    isColourOption(
                      option.name
                    );

                  return (
                    <div
                      key={
                        option.id ||
                        option.name
                      }
                    >
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <label className="text-sm font-medium tracking-wide">
                          {option.name}
                        </label>

                        {productIsHoodie &&
                          isSize && (
                            <button
                              type="button"
                              onClick={() =>
                                setSizeGuideOpen(
                                  true
                                )
                              }
                              className="text-sm text-primary underline underline-offset-4"
                            >
                              Size Guide
                            </button>
                          )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {option.values.map(
                          (value) => {
                            const selected =
                              selectedOptions[
                                option.name
                              ] === value;

                            const available =
                              optionValueAvailable(
                                option.name,
                                value
                              );

                            return (
                              <button
                                type="button"
                                key={value}
                                disabled={
                                  !available
                                }
                                onClick={() =>
                                  changeOption(
                                    option.name,
                                    value
                                  )
                                }
                                title={
                                  isColour
                                    ? value
                                    : undefined
                                }
                                aria-pressed={
                                  selected
                                }
                                className={`min-w-12 rounded-full border px-4 py-2 text-sm transition-colors ${
                                  selected
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border hover:border-primary'
                                } ${
                                  !available
                                    ? 'opacity-35 cursor-not-allowed'
                                    : ''
                                }`}
                              >
                                {value}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}

                <div>
                  <label className="text-sm font-medium tracking-wide block mb-3">
                    Quantity
                  </label>

                  <div className="inline-flex items-center border border-border rounded-full overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          (current) =>
                            Math.max(
                              1,
                              current - 1
                            )
                        )
                      }
                      className="w-11 h-11 hover:bg-primary/10 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span className="min-w-10 text-center text-sm">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          (current) =>
                            current + 1
                        )
                      }
                      className="w-11 h-11 hover:bg-primary/10 transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {!selectedVariant?.availableForSale && (
                <p className="mt-6 text-sm text-muted-foreground">
                  This combination is
                  currently unavailable.
                  Please choose another
                  option.
                </p>
              )}

              <button
                type="button"
                onClick={addToCart}
                disabled={
                  !selectedVariant?.availableForSale ||
                  cartBusy
                }
                className="w-full mt-8 rounded-full bg-primary text-primary-foreground px-6 py-4 text-sm font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {cartBusy
                  ? 'Adding...'
                  : selectedVariant?.availableForSale
                  ? 'Add to Cart'
                  : 'Unavailable'}
              </button>

              {cartError && (
                <p className="mt-3 text-sm text-red-500">
                  {cartError}
                </p>
              )}
            </div>
          </div>
        </div>

        {renderSizeGuide()}
        {renderCart()}
      </main>
    );
  }

  function renderShopPage() {
    return (
      <main className="min-h-screen pt-16 md:pt-20 pb-20">
        <section className="relative w-full h-[240px] overflow-hidden">
          <img
            src="/shop-hero.png"
            alt="Shop collection"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          
        </section>
<div className="max-w-7xl mx-auto px-4 sm:px-5 -mt-10">
          <div className="flex justify-end mt-6 mb-3">
            <CartButton />
          </div>

          <div className="text-center mb-6 md:mb-7">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
              Shop
            </h1>

            <p className="font-body mt-3 text-sm md:text-base text-foreground/80 tracking-wide">
              Gifts for fragrance lovers.
            </p>
          </div>

          {loadingCollections && (
            <p className="font-body text-center text-muted-foreground">
              Loading products...
            </p>
          )}

          {shopError && (
            <p className="font-body text-center text-muted-foreground">
              {shopError}
            </p>
          )}

          {!loadingCollections &&
            !shopError &&
            collections.length === 0 && (
              <p className="font-body text-center text-muted-foreground">
                Products coming soon.
              </p>
            )}

          {!loadingCollections &&
            !shopError &&
            collections.map(
              (collection) => (
                <section
                  key={collection.id}
                  className="mb-10 md:mb-12"
                >
                  <h2 className="font-heading text-2xl md:text-3xl font-light tracking-wide mb-2">
                    {
                      collection.displayTitle
                    }
                  </h2>

                  <p className="font-body text-sm md:text-base text-muted-foreground mb-5 md:mb-6">
                    {COLLECTION_INTROS[collection.type]}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {collection.products.nodes.map(
                      (item) => {
                        const price =
                          item.priceRange
                            ?.minVariantPrice;

                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() =>
                              openProduct(
                                item.handle
                              )
                            }
                            className="group text-left block w-full border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
                          >
                            {item.featuredImage ? (
                              <div className="overflow-hidden bg-white">
                                <img
                                  src={
                                    item
                                      .featuredImage
                                      .url
                                  }
                                  alt={
                                    item
                                      .featuredImage
                                      .altText ||
                                    item.title
                                  }
                                  className="w-full aspect-square object-cover group-hover:scale-[1.015] transition-transform duration-300"
                                />
                              </div>
                            ) : (
                              <div className="font-body w-full aspect-square flex items-center justify-center bg-muted">
                                No image
                              </div>
                            )}

                            <div className="font-body p-5">
                              <h3 className="text-base md:text-lg font-normal tracking-wide leading-snug">
                                {item.title}
                              </h3>

                              {price && (
                                <p className="mt-2 text-sm md:text-base text-primary">
                                  {formatPrice(
                                    price
                                  )}
                                </p>
                              )}

                              {!item.availableForSale && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                  Currently
                                  unavailable
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </section>
              )
            )}
        </div>

        {renderCart()}
      </main>
    );
  }

  return productHandle
    ? renderProductPage()
    : renderShopPage();
}
