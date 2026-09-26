import { Link } from 'react-router-dom';

const Logo = ({ dark }) => (
  <Link to="/" className="flex items-center gap-2.5 shrink-0">
    <img
      src="/alpha-enterprise-logo.png"
      alt="Alpha Enterprise Solution Pvt Ltd logo"
      className="h-11 w-11 shrink-0 object-contain"
    />
    <span className={`font-display font-semibold text-sm sm:text-base leading-tight ${dark ? 'text-white' : 'text-ink'}`}>
      ALPHA ENTERPRISE
      <span className="block text-[10px] sm:text-xs">SOLUTION PVT LTD</span>
    </span>
  </Link>
);

export default Logo;
