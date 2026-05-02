import { Trending } from "./components/trending.tsx";
import "./home.css";
import heroImage from "../assets/hero.png";

export default function Home() {
  return (
    <main className="homePage">
      <section className="homeHero" aria-labelledby="home-hero-title">
        <div className="heroContent">
          <span className="heroEyebrow">Fresh picks for your store</span>
          <h1 id="home-hero-title">Find fast-moving inventory in one place</h1>
          <p>
            Browse trending products, compare what shoppers are buying, and add
            the best items to your cart.
          </p>
        </div>
        <div className="heroImageWrap">
          <img src={heroImage} alt="" className="heroImage" />
        </div>
      </section>
      <Trending />
    </main>
  );
}
