import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import EnquiryModal from '../components/EnquiryModal.jsx';
import Loader from '../components/Loader.jsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);
  const [enquireProduct, setEnquireProduct] = useState(null);

  const fetchProducts = useCallback(async (params) => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setCategories(data.categories);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts({ search: search || undefined, category: category !== 'All' ? category : undefined, limit: 24 });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink">Product Catalog</h1>
        <p className="mt-3 text-steel leading-relaxed">
          Browse our current lineup of structural hardware, fasteners and mounting systems. Every
          listing includes full specifications — enquire directly from any product.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or keyword…"
            className="w-full border border-line pl-10 pr-4 py-3 text-sm text-ink placeholder:text-steel/50 focus:border-ink outline-none transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto spec-scroll pb-1 sm:pb-0">
          {['All', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-3 text-sm font-medium border transition-colors ${
                category === c ? 'bg-ink text-white border-ink' : 'border-line text-steel hover:border-ink hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-10">
        {loading ? (
          <Loader label="Loading products" />
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-line">
            <p className="text-ink font-medium">No products match your search.</p>
            <p className="mt-1 text-sm text-steel">Try a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onQuickView={setQuickView} />
            ))}
          </div>
        )}
      </div>

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

export default Products;
