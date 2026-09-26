import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                    isActive ? 'text-signal' : 'text-ink hover:text-signal'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className="ml-3 inline-flex items-center bg-ink text-white text-sm font-medium px-5 py-2.5 cut-corner-sm hover:bg-signal transition-colors"
            >
              Get a Quote
            </NavLink>
          </nav>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`block h-0.5 w-6 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-white">
          <nav className="flex flex-col px-5 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-base font-medium border-b border-line last:border-none ${
                    isActive ? 'text-signal' : 'text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
