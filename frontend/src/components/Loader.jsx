const Loader = ({ label = 'Loading' }) => (
  <div className="flex flex-col items-center justify-center py-20 text-steel">
    <div className="w-9 h-9 border-2 border-line border-t-signal rounded-full animate-spin" />
    <p className="mt-4 text-sm tracking-wide">{label}…</p>
  </div>
);

export default Loader;
