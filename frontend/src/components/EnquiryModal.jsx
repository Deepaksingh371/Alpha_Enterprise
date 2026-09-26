import { useEffect, useState } from 'react';
import api from '../api/axios.js';

const initialForm = { name: '', email: '', phone: '', companyName: '', message: '' };

const EnquiryModal = ({ product, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

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

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[\d+\-\s()]{7,20}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.companyName.trim()) e.companyName = 'Company name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/enquiries', {
        ...form,
        productName: product.name,
        productId: product._id,
      });
      setSubmitted(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto cut-corner"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="font-display font-semibold text-ink">
            {submitted ? 'Enquiry Sent' : 'Enquire Now'}
          </h3>
          <button onClick={onClose} aria-label="Close" className="text-steel hover:text-signal p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-signal/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="mt-4 text-ink font-medium">Thanks, {form.name.split(' ')[0]}.</p>
            <p className="mt-1.5 text-sm text-steel leading-relaxed">
              Your enquiry about <span className="text-ink font-medium">{product.name}</span> has been
              received. Our team will reach out to you at {form.email} shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-ink text-white text-sm font-semibold py-3 hover:bg-signal transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="bg-mist border border-line px-3.5 py-2.5">
              <p className="text-[11px] tracking-wide text-steel uppercase">Enquiring about</p>
              <p className="text-sm font-medium text-ink">{product.name}</p>
            </div>

            <Field label="Full Name" required error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Jordan Patel"
                className={inputClass(errors.name)}
              />
            </Field>

            <Field label="Email Address" required error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="jordan@company.com"
                className={inputClass(errors.email)}
              />
            </Field>

            <Field label="Phone Number" required error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="+91 98765 43210"
                className={inputClass(errors.phone)}
              />
            </Field>

            <Field label="Company Name" required error={errors.companyName}>
              <input
                type="text"
                value={form.companyName}
                onChange={handleChange('companyName')}
                placeholder="Acme Manufacturing Co."
                className={inputClass(errors.companyName)}
              />
            </Field>

            <Field label="Message (optional)">
              <textarea
                value={form.message}
                onChange={handleChange('message')}
                rows={3}
                placeholder="Tell us about your requirement — quantity, timeline, specifications…"
                className={inputClass(false)}
              />
            </Field>

            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-signal text-white text-sm font-semibold py-3 hover:bg-signalDark transition-colors disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit Enquiry'}
            </button>
            <p className="text-[11px] text-steel text-center">
              Fields marked required must be filled to submit your enquiry.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, required, error, children }) => (
  <label className="block">
    <span className="text-xs font-medium text-ink">
      {label} {required && <span className="text-signal">*</span>}
    </span>
    <div className="mt-1.5">{children}</div>
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

const inputClass = (hasError) =>
  `w-full border ${
    hasError ? 'border-red-400' : 'border-line'
  } px-3.5 py-2.5 text-sm text-ink placeholder:text-steel/50 focus:border-ink outline-none transition-colors`;

export default EnquiryModal;
