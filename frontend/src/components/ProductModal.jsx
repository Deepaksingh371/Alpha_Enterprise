import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImagePlaceholder from './ProductImagePlaceholder.jsx';

const ProductModal = ({ product, onClose, onEnquire }) => {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;
  const images = product.images || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto cut-corner"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sticky top-0 bg-white z-10">
          <span className="text-xs font-medium tracking-[0.15em] text-steel">{product.category}</span>
          <button onClick={onClose} aria-label="Close" className="text-steel hover:text-signal p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          <div>
            <div className="aspect-square border-b sm:border-b-0 sm:border-r border-line">
              {images.length ? (
                <img src={images[activeImg]?.url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ProductImagePlaceholder className="w-full h-full" />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto spec-scroll sm:border-r border-line">
                {images.map((img, i) => (
                  <button
                    key={img.publicId}
                    onClick={() => setActiveImg(i)}
                    className={`w-14 h-14 shrink-0 border ${
                      activeImg === i ? 'border-signal' : 'border-line'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6 flex flex-col">
            <h2 className="text-xl font-display font-semibold text-ink">{product.name}</h2>
            <p className="mt-3 text-sm text-steel leading-relaxed line-clamp-5">{product.description}</p>

            {product.specifications?.length > 0 && (
              <dl className="mt-5 border-t border-line divide-y divide-line text-sm">
                {product.specifications.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex justify-between py-2 gap-4">
                    <dt className="text-steel">{s.key}</dt>
                    <dd className="text-ink font-medium text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-auto pt-6 flex flex-col gap-2.5">
              <button
                onClick={() => onEnquire(product)}
                className="bg-signal text-white text-sm font-semibold py-3 hover:bg-signalDark transition-colors"
              >
                Enquire Now
              </button>
              <Link
                to={`/products/${product._id}`}
                onClick={onClose}
                className="text-center text-sm font-medium text-ink border border-line py-3 hover:border-ink transition-colors"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
