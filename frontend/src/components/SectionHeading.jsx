const SectionHeading = ({ index, title, description, align = 'left' }) => (
  <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
    <div className="flex items-center gap-3">
      {index && <span className="text-signal font-display font-semibold text-sm">{index}</span>}
      <div className="h-px flex-1 bg-line" style={{ maxWidth: index ? '100%' : 0 }} />
    </div>
    <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-ink leading-tight">{title}</h2>
    {description && <p className="mt-3 text-steel leading-relaxed">{description}</p>}
  </div>
);

export default SectionHeading;
