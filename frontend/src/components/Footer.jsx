import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

const Footer = () => (
  <footer className="bg-ink text-white">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <Logo dark />
        <p className="mt-4 text-sm text-white/60 max-w-sm leading-relaxed">
          Manufacturing all types of adhesive tapes, home appliance parts, and automotive child parts.
        </p>
      </div>

      <div>
        <h4 className="text-xs font-semibold tracking-[0.15em] text-white/40 mb-4">SITE</h4>
        <ul className="space-y-2.5 text-sm text-white/70">
          <li><Link to="/" className="hover:text-signal transition-colors">Home</Link></li>
          <li><Link to="/products" className="hover:text-signal transition-colors">Products</Link></li>
          <li><Link to="/contact" className="hover:text-signal transition-colors">Contact</Link></li>
          <li><Link to="/admin/login" className="hover:text-signal transition-colors">Admin</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-semibold tracking-[0.15em] text-white/40 mb-4">CONTACT</h4>
        <ul className="space-y-2.5 text-sm text-white/70">
          <li>Plot No. PAP-IS-10, Ranjangaon MIDC, Karegaon, Shirur, Pune, Maharashtra 412220</li>
          <li><a href="tel:+917986867243" className="hover:text-signal transition-colors">+91 79868 67243</a></li>
          <li>Monday – Saturday, 8:00 AM – 6:30 PM</li>
          <li>Sunday: Closed</li>
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
        <span>© {new Date().getFullYear()} Alpha Enterprise Solution Pvt Ltd. All rights reserved.</span>
        <span>Built for showcasing products &amp; enquiries only.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
