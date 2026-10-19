import Link from 'next/link';
import LandingActions from '../components/LandingActions';
import PublicHeader from '../components/PublicHeader';
import PublicCatalogue from '../components/PublicCatalogue';
import './landing.css';

export default function Home() {
  return <div className="landing-page">
    <PublicHeader />
    <main>
      <section className="landing-hero">
        <div className="landing-hero-copy"><p className="landing-kicker">A place for local stores</p><h1>Find what you need, closer to home.</h1><p className="landing-intro">Browse products from independent shops in your area. See what is available, choose a store, and order in a few steps.</p><div className="landing-hero-actions"><LandingActions placement="hero" /><Link href="/business-register" className="landing-text-link">Have a shop? Join us <span aria-hidden="true">↗</span></Link></div></div>
        <div className="landing-hero-panel"><div className="landing-panel-top"><span>THE LOCAL WAY TO SHOP</span><span aria-hidden="true">↗</span></div><div className="landing-panel-center"><span className="material-symbols-outlined" aria-hidden="true">storefront</span><p>Good shops are often just around the corner.</p></div><div className="landing-panel-bottom"><span>Explore stores</span><span>Find products</span><span>Order online</span></div></div>
      </section>
      <PublicCatalogue />
      <section id="how-it-works" className="landing-how"><div className="landing-section-heading"><p className="landing-kicker">How it works</p><h2>From browsing to checkout.</h2><p>Everything you need to shop from local businesses in one place.</p></div><div className="landing-steps"><article><span>01</span><h3>Browse stores</h3><p>Look through local stores and see what they have in stock.</p></article><article><span>02</span><h3>Choose your items</h3><p>Compare products and add what you want to your cart.</p></article><article><span>03</span><h3>Place your order</h3><p>Check your details, place the order, and follow its progress.</p></article></div></section>
      <section className="landing-seller"><div><p className="landing-kicker">For shop owners</p><h2>Bring your store online.</h2><p>List your products, manage orders, and give more people a way to find your business.</p></div><Link href="/business-register" className="landing-seller-link">Create a store <span aria-hidden="true">↗</span></Link></section>
    </main>
    <footer className="landing-footer"><div><strong>LocalBiz</strong><p>Shop from businesses near you.</p></div><nav aria-label="Footer navigation"><Link href="/browse">Browse stores</Link><Link href="/register">Create an account</Link><Link href="/business-register">For shop owners</Link></nav><small>© {new Date().getFullYear()} LocalBiz</small></footer>
  </div>;
}
