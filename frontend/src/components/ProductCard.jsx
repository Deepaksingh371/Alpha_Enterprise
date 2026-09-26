import { Link } from 'react-router-dom';
import ProductImagePlaceholder from './ProductImagePlaceholder.jsx';

const ProductCard = ({ product, onQuickView }) => {
  const cover = product.images?.[0]?.url;

  return (
    <div className="group border border-line hover:border-ink transition-colors bg-white flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line">
        {cover ? (
          <img
            src={cover}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          <ProductImagePlaceholder className="w-full h-full" />
        )}
        <span className="absolute top-3 left-3 bg-white/95 border border-line text-[11px] font-medium tracking-wide px-2.5 py-1 text-steel">
          {product.category}
        </span>
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all bg-ink text-white text-sm font-medium py-2.5 hover:bg-signal"
          >
            Quick View
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-base text-ink leading-snug">{product.name}</h3>
        {product.specifications?.length > 0 && (
          <p className="mt-1.5 text-sm text-steel line-clamp-2">
            {product.specifications
              .slice(0, 2)
              .map((s) => `${s.key}: ${s.value}`)
              .join(' · ')}
          </p>
        )}
        <Link
          to={`/products/${product._id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-signal transition-colors"
        >
          View details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
