import { useCallback, useEffect, useState } from "react";
import "../home.css";
import { ShoppingCart } from "lucide-react";
import { getTrending } from "../apiCalls/suggestionAPI";
import { useRetry } from "../../contexts/retryLogic/autoRetry";
import { useCart } from "../../contexts/cartContext/cartContext";
import type { ProductType } from "../../contexts/cartContext/Types";

type TrendingProduct = Omit<ProductType, "quantity" | "stock"> &
  Partial<Pick<ProductType, "quantity" | "stock">> & {
  total?: number;
};

type TrendingResponse = {
  trendingProducts?: TrendingProduct[];
};

export function Trending() {
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>(
    [],
  );
  const [toastMessage, setToastMessage] = useState("");
  const [toastKey, setToastKey] = useState(0);
  const { autoRetry } = useRetry();
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(
    async (product: TrendingProduct) => {
      const cartProduct: ProductType = {
        ...product,
        quantity: 1,
        stock: product.stock ?? 0,
      };

      try {
        await addToCart(cartProduct);
        setToastMessage(`${product.name} added to cart`);
        setToastKey((prev) => prev + 1);
      } catch {
        // The cart context owns user-facing error handling for this action.
      }
    },
    [addToCart],
  );

  useEffect(() => {
    let isActive = true;

    async function loadTrendingProducts() {
      try {
        const res = (await autoRetry({}, getTrending)) as TrendingResponse;
        if (isActive) {
          setTrendingProducts(res.trendingProducts ?? []);
        }
      } catch {
        if (isActive) {
          setTrendingProducts([]);
        }
      }
    }

    void loadTrendingProducts();

    return () => {
      isActive = false;
    };
  }, [autoRetry]);

  return (
    <section className="trendingSection" aria-labelledby="trending-title">
      {toastMessage && (
        <div
          key={toastKey}
          className="toast"
          role="status"
          aria-live="polite"
          onAnimationEnd={() => {
            setToastMessage("");
          }}
        >
          {toastMessage}
        </div>
      )}
      <div className="sectionHeader">
        <div>
          <span className="sectionKicker">Popular now</span>
          <h2 id="trending-title">Trending Products</h2>
        </div>
      </div>
      <div className="trendingContainer">
        {trendingProducts.map((product) => (
          <ItemCard
            key={`${product.name}-${product.price}`}
            product={product}
            handleAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

function ItemCard({
  product,
  handleAddToCart,
}: {
  product: TrendingProduct;
  handleAddToCart: (product: TrendingProduct) => Promise<void>;
}) {
  return (
    <div className="productContainer">
      <div className="imageContainer">
        <img
          className="image"
          src={
            product.url ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7H5SO_PbMIDuCocFhyTIbet6O18XKTpOrqY0QURzlCBm939T2hMG0eMc&s"
          }
          alt={product.name ?? "Product image"}
        />
      </div>
      <div className="productInfo">
        <h3>{product.name}</h3>
        <span className="productPrice">₹{product.price}</span>
        <span className="productMeta">
          {product.total} bought in the last 100 days
        </span>
      </div>
      <button
        className="addToCartButton"
        onClick={() => {
          handleAddToCart(product);
        }}
      >
        <ShoppingCart size={18} aria-hidden="true" />
        Add to cart
      </button>
    </div>
  );
}
