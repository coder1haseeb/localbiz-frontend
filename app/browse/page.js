import PublicCatalogue from '../../components/PublicCatalogue';
import PublicHeader from '../../components/PublicHeader';
import '../landing.css';

export default function BrowsePage() {
  return <div className="landing-page"><PublicHeader /><main><PublicCatalogue full /></main></div>;
}
