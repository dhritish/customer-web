import { useCallback, useEffect, useState } from "react";
import "../home.css";
import { getTrending } from "../apiCalls/suggestionAPI";
import { useRetry } from "../../contexts/retryLogic/autoRetry";

export function Trending() {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const { autoRetry } = useRetry();

  const getTrendingProducts = useCallback(async () => {
    try {
      const res = await autoRetry({}, getTrending);
      setTrendingProducts(res.trendingProducts ?? []);
    } catch (error) {
      setTrendingProducts([]);
    }
  }, [autoRetry]);

  useEffect(() => {
    getTrendingProducts();
  }, [getTrendingProducts]);

  return (
    <>
      <h2>Trending</h2>
      <div className="trendingContainer">
        {trendingProducts.map((product) => (
          <ItemCard
            key={`${product.name}-${product.price}`}
            product={product}
          />
        ))}
      </div>
      <button onClick={getTrendingProducts}>Get Trending</button>
    </>
  );
}

function ItemCard({ product }: { product: any }) {
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
        <span>{product.name}</span>
        <span style={{ color: "green", fontWeight: "bold", fontSize: "40px" }}>
          ₹{product.price}
        </span>
        <span>{product.total} bought in the last 100 days</span>
      </div>
    </div>
  );
}
