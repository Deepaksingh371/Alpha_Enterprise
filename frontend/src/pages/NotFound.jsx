import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="max-w-7xl mx-auto px-5 sm:px-8 py-28 text-center">
    <span className="font-display text-6xl font-semibold text-signal">404</span>
    <h1 className="mt-4 text-2xl font-display font-semibold text-ink">Page not found</h1>
    <p className="mt-2 text-steel">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="mt-6 inline-block text-signal font-medium">
      ← Back to home
    </Link>
  </div>
);

export default NotFound;
