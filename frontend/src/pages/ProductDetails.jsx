import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import EnquiryModal from '../components/EnquiryModal.jsx';
import ProductImagePlaceholder from '../components/ProductImagePlaceholder.jsx';
import Loader from '../components/Loader.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [enquiring, setEnquiring] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading product" />;

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="text-2xl font-display font-semibold text-ink">Product not found</h1>
        <p className="mt-2 text-steel">It may have been removed or is no longer active.</p>
        <Link to="/products" className="mt-6 inline-block text-signal font-medium">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <nav className="text-sm text-steel flex items-center gap-2">
        <Link to="/products" className="hover:text-ink transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Images */}
        <div>
          <div className="aspect-square border border-line">
            {images.length ? (
              <img src={images[activeImg]?.url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <ProductImagePlaceholder className="w-full h-full" />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto spec-scroll">
              {images.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 shrink-0 border-2 ${activeImg === i ? 'border-signal' : 'border-line'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="inline-block text-xs font-medium tracking-[0.15em] text-steel border border-line px-2.5 py-1">
            {product.category}
          </span>
          <h1 className="mt-4 text-3xl font-display font-semibold text-ink">{product.name}</h1>
          <p className="mt-4 text-steel leading-relaxed">{product.description}</p>

          <button
            onClick={() => setEnquiring(true)}
            className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-signal text-white font-semibold px-8 py-3.5 hover:bg-signalDark transition-colors"
          >
            Enquire Now
          </button>

          {product.specifications?.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display font-semibold text-ink text-lg">Technical Specifications</h2>
              <dl className="mt-4 border border-line divide-y divide-line text-sm">
                {product.specifications.map((s, i) => (
                  <div key={i} className="flex justify-between px-4 py-3 gap-4 odd:bg-mist">
                    <dt className="text-steel">{s.key}</dt>
                    <dd className="text-ink font-medium text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {enquiring && <EnquiryModal product={product} onClose={() => setEnquiring(false)} />}
    </div>
  );
};

export default ProductDetails;
