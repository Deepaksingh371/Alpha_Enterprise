import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import EnquiryModal from '../components/EnquiryModal.jsx';
import Loader from '../components/Loader.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const companyFacts = [
  { value: 'Manufacturing plant', label: 'Business type' },
  { value: 'Adhesive tapes', label: 'Product range' },
  { value: 'Home appliance parts', label: 'Product range' },
  { value: 'Automotive child parts', label: 'Product range' },
];

const productsAndServices = [
  {
    title: 'Adhesive tapes',
    body: 'All types of adhesive tapes.',
  },
  {
    title: 'Home appliance parts',
    body: 'Parts for home appliances.',
  },
  {
    title: 'Automotive child parts',
    body: 'Automotive child parts manufacturing.',
  },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);
  const [enquireProduct, setEnquireProduct] = useState(null);
  const [generalEnquiry, setGeneralEnquiry] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    message: '',
  });
  const [enquiryStatus, setEnquiryStatus] = useState('');
  const [enquiryError, setEnquiryError] = useState('');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  useEffect(() => {
    api
      .get('/products/featured')
      .then(({ data }) => setFeatured(data.products))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const handleGeneralEnquiry = async (event) => {
    event.preventDefault();
    setEnquiryError('');
    setEnquiryStatus('');
    setSubmittingEnquiry(true);

    try {
      await api.post('/enquiries', {
        ...generalEnquiry,
        productName: 'General enquiry',
      });
      setGeneralEnquiry({ name: '', email: '', phone: '', companyName: '', message: '' });
      setEnquiryStatus('Thank you. Your enquiry has been sent.');
    } catch (error) {
      setEnquiryError(error.response?.data?.message || 'Could not send your enquiry. Please try again.');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const updateGeneralEnquiry = (event) => {
    const { name, value } = event.target;
    setGeneralEnquiry((current) => ({ ...current, [name]: value }));
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative border-b border-line overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] text-steel border border-line px-3 py-1.5">
              <span className="w-1.5 h-1.5 bg-signal" /> MANUFACTURING PLANT · RANJANGAON MIDC
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-ink leading-[1.08] tracking-tight">
              ALPHA ENTERPRISE SOLUTION PVT LTD
            </h1>
            <p className="mt-6 text-lg text-steel max-w-xl leading-relaxed">
              A manufacturing plant in Ranjangaon MIDC, Maharashtra, producing adhesive tapes, home appliance parts, and automotive child parts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-signal text-white font-semibold px-6 py-3.5 hover:bg-signalDark transition-colors"
              >
                Browse Products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-line text-ink font-semibold px-6 py-3.5 hover:border-ink transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-line divide-y divide-line">
              {companyFacts.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between px-5 py-4">
                  <span className="font-display text-2xl font-semibold text-ink">{s.value}</span>
                  <span className="text-sm text-steel text-right">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-1.5 bg-hazard-stripe" />
      </section>

      {/* Company intro */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <SectionHeading index="01" title="Company profile" />
        </div>
        <div className="lg:col-span-8">
          <p className="text-lg text-ink leading-relaxed">
            Alpha Enterprise Solution Pvt Ltd is a manufacturing plant located at Plot No. PAP-IS-10, Ranjangaon MIDC, Karegaon, Maharashtra.
          </p>
          <p className="mt-4 text-steel leading-relaxed max-w-2xl">
            Incorporated on February 10, 2026, the company manufactures all types of adhesive tapes, home appliance parts, and automotive child parts.
          </p>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-mist border-y border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading index="02" title="Featured products" />
            <Link to="/products" className="text-sm font-medium text-ink hover:text-signal transition-colors">
              View all products →
            </Link>
          </div>

          <div className="mt-10">
            {loading ? (
              <Loader label="Loading products" />
            ) : featured.length === 0 ? (
              <p className="text-steel">Products will appear here once they're added in the admin panel.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map((p) => (
                  <ProductCard key={p._id} product={p} onQuickView={setQuickView} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <SectionHeading index="03" title="Products & services" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
          {productsAndServices.map((r) => (
            <div key={r.title} className="bg-white p-6 sm:p-8">
              <h3 className="font-display font-semibold text-ink text-lg">{r.title}</h3>
              <p className="mt-2.5 text-sm text-steel leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold">
              Looking for adhesive tapes or manufactured parts?
            </h2>
            <p className="mt-3 text-white/60 max-w-lg leading-relaxed">
              Contact Alpha Enterprise Solution Pvt Ltd to discuss your manufacturing enquiry.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-signal text-white font-semibold px-6 py-3.5 hover:bg-signalDark transition-colors"
          >
            Contact Us
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-3xl">
          <SectionHeading index="04" title="Send an enquiry" />
          <p className="mt-3 text-sm text-steel">
            Tell us what you need and our team will get back to you.
          </p>

          <form onSubmit={handleGeneralEnquiry} className="mt-8 grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-xs font-medium text-ink">Full name <span className="text-signal">*</span></span>
              <input
                name="name"
                value={generalEnquiry.name}
                onChange={updateGeneralEnquiry}
                autoComplete="name"
                required
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm text-ink focus:border-ink outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-ink">Company name <span className="text-signal">*</span></span>
              <input
                name="companyName"
                value={generalEnquiry.companyName}
                onChange={updateGeneralEnquiry}
                autoComplete="organization"
                required
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm text-ink focus:border-ink outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-ink">Email address <span className="text-signal">*</span></span>
              <input
                type="email"
                name="email"
                value={generalEnquiry.email}
                onChange={updateGeneralEnquiry}
                autoComplete="email"
                required
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm text-ink focus:border-ink outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-ink">Phone number <span className="text-signal">*</span></span>
              <input
                type="tel"
                name="phone"
                value={generalEnquiry.phone}
                onChange={updateGeneralEnquiry}
                autoComplete="tel"
                required
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm text-ink focus:border-ink outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-ink">How can we help? <span className="text-steel">(optional)</span></span>
              <textarea
                name="message"
                value={generalEnquiry.message}
                onChange={updateGeneralEnquiry}
                rows={4}
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm text-ink focus:border-ink outline-none resize-y"
              />
            </label>
            <div className="sm:col-span-2 flex flex-col items-start gap-3">
              <button
                type="submit"
                disabled={submittingEnquiry}
                className="bg-signal text-white text-sm font-semibold px-6 py-3 hover:bg-signalDark transition-colors disabled:opacity-60"
              >
                {submittingEnquiry ? 'Sending…' : 'Send enquiry'}
              </button>
              {enquiryStatus && <p role="status" className="text-sm text-green-700">{enquiryStatus}</p>}
              {enquiryError && <p role="alert" className="text-sm text-red-600">{enquiryError}</p>}
            </div>
          </form>
        </div>
      </section>

      {quickView && (
        <ProductModal
          product={quickView}
          onClose={() => setQuickView(null)}
          onEnquire={(p) => {
            setQuickView(null);
            setEnquireProduct(p);
          }}
        />
      )}
      {enquireProduct && <EnquiryModal product={enquireProduct} onClose={() => setEnquireProduct(null)} />}
    </div>
  );
};

export default Home;
