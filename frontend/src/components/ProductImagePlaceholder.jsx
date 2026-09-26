// Shown when a product has no uploaded images yet
const ProductImagePlaceholder = ({ className = '' }) => (
  <div className={`flex items-center justify-center bg-mist text-steel/40 ${className}`}>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M3 15l4.5-4.5a1 1 0 0 1 1.4 0L13 14.5" />
      <path d="M14 13l1.5-1.5a1 1 0 0 1 1.4 0L21 15.5" />
      <circle cx="8" cy="8.5" r="1.5" />
    </svg>
  </div>
);

export default ProductImagePlaceholder;
