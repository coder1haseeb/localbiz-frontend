import Link from 'next/link';
import './landing.css';
import LandingActions from '../components/LandingActions';

const Icon = ({ name }) => <span className="material-symbols-outlined" aria-hidden="true">{name}</span>;

export default function Home() {
  return <div className="landing-page">
    <header className="landing-header">
      <Link href="/" className="landing-logo" aria-label="LocalBiz home"><span className="landing-logo-mark"><Icon name="storefront" /></span><span>LocalBiz<small>your local marketplace</small></span></Link>
      <nav className="landing-nav" aria-label="Main navigation"><a href="#discover">Discover</a><a href="#how-it-works">How it works</a><Link href="/business-register">For sellers</Link></nav>
      <LandingActions />
    </header>

    <main>
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-inner">
          <div className="landing-hero-copy"><span className="landing-eyebrow"><span className="landing-eyebrow-dot" /> A marketplace made for your neighborhood</span><h1 id="landing-title">Good finds.<br /><em>Closer to home.</em></h1><p>Discover independent shops, everyday essentials, and thoughtful products from businesses in your community.</p><div className="landing-hero-actions"><LandingActions placement="hero" /><Link href="/business-register" className="landing-button-text">Open your store <Icon name="north_east" /></Link></div><div className="landing-hero-note"><Icon name="favorite" /> Shop local. Find more to love.</div></div>
          <div className="landing-art" aria-hidden="true"><div className="landing-art-halo" /><div className="landing-art-card art-card-top"><span className="landing-art-icon lilac"><Icon name="storefront" /></span><span><strong>Local shops</strong><small>Discover nearby</small></span></div><div className="landing-art-main"><div className="landing-art-window"><div className="landing-art-awning" /><div className="landing-art-door" /><div className="landing-art-display one" /><div className="landing-art-display two" /><div className="landing-art-display three" /><div className="landing-art-ground" /></div></div><div className="landing-art-card art-card-bottom"><span className="landing-art-icon coral"><Icon name="shopping_bag" /></span><span><strong>Little discoveries</strong><small>From people around you</small></span></div><span className="landing-sparkle sparkle-one">✦</span><span className="landing-sparkle sparkle-two">✦</span></div>
        </div>
      </section>

      <section className="landing-value" aria-label="Why shop with LocalBiz"><div><Icon name="storefront" /><span>Independent local stores</span></div><div><Icon name="auto_awesome" /><span>Finds picked for you</span></div><div><Icon name="shopping_bag" /><span>Easy shopping in one place</span></div></section>

      <section id="discover" className="landing-section landing-discover"><div className="landing-section-intro"><span className="landing-label">DISCOVER MORE</span><h2>Your neighborhood has<br /><em>so much to offer.</em></h2><p>From everyday needs to unexpected favorites, explore the businesses and products that make your community special.</p><Link href="/login" className="landing-inline-link">Start exploring <Icon name="arrow_forward" /></Link></div><div className="landing-discover-cards"><div className="landing-discover-card discover-card-one"><span className="discover-icon"><Icon name="storefront" /></span><div><span className="landing-label">01 / EXPLORE</span><h3>Meet local stores</h3><p>Get to know the shops right around you.</p></div></div><div className="landing-discover-card discover-card-two"><span className="discover-icon"><Icon name="favorite" /></span><div><span className="landing-label">02 / FIND</span><h3>Find your kind of thing</h3><p>Browse products that feel like they were meant for you.</p></div></div></div></section>

      <section id="how-it-works" className="landing-section landing-how"><div className="landing-how-heading"><span className="landing-label">A SIMPLE WAY TO SHOP</span><h2>Local shopping,<br /><em>made lovely.</em></h2></div><div className="landing-steps"><article><span>01</span><Icon name="search" /><h3>Explore</h3><p>Browse stores and products from your community.</p></article><article><span>02</span><Icon name="auto_awesome" /><h3>Discover</h3><p>See recommendations and uncover new favorites.</p></article><article><span>03</span><Icon name="shopping_cart_checkout" /><h3>Shop</h3><p>Add what you love to your cart and check out.</p></article></div></section>

      <section className="landing-seller"><div><span className="landing-label">FOR LOCAL BUSINESSES</span><h2>Your store deserves<br /><em>to be discovered.</em></h2><p>Create your storefront and connect with customers looking to shop local.</p><Link href="/business-register" className="landing-button-primary">Become a seller <Icon name="arrow_forward" /></Link></div><div className="landing-seller-art" aria-hidden="true"><Icon name="storefront" /><span className="landing-seller-star">✦</span></div></section>
    </main>

    <footer className="landing-footer"><div><Link href="/" className="landing-logo"><span className="landing-logo-mark"><Icon name="storefront" /></span><span>LocalBiz<small>your local marketplace</small></span></Link><p>Find more to love, close to home.</p></div><nav aria-label="Footer navigation"><Link href="/login">Explore stores</Link><Link href="/register">Create account</Link><Link href="/business-register">For sellers</Link></nav><div className="landing-footer-bottom"><span>© {new Date().getFullYear()} LocalBiz</span><span>Made for local discovery</span></div></footer>
  </div>;
}
