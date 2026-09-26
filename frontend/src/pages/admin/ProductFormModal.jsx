import { useState, useEffect } from 'react';
import api from '../../api/axios.js';

const emptySpec = () => ({ key: '', value: '' });

const ProductFormModal = ({ product, categories, onClose, onSaved }) => {
  const isEdit = !!product;
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || '');
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState(product?.description || '');
  const [status, setStatus] = useState(product?.status || 'Active');
  const [specs, setSpecs] = useState(product?.specifications?.length ? product.specifications : [emptySpec()]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => newPreviews.forEach((p) => URL.revokeObjectURL(p));
  }, [newPreviews]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeNewFile = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (publicId) => {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
    setRemovedImageIds((prev) => [...prev, publicId]);
  };

  const updateSpec = (idx, field, value) => {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };
  const addSpec = () => setSpecs((prev) => [...prev, emptySpec()]);
  const removeSpec = (idx) => setSpecs((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const finalCategory = newCategory.trim() || category;
    if (!name.trim() || !finalCategory || !description.trim()) {
      setError('Name, category and description are required.');
      return;
    }

    const cleanSpecs = specs.filter((s) => s.key.trim() && s.value.trim());

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('category', finalCategory);
    formData.append('description', description.trim());
    formData.append('status', status);
    formData.append('specifications', JSON.stringify(cleanSpecs));
    newFiles.forEach((f) => formData.append(isEdit ? 'newImages' : 'images', f));
    if (isEdit && removedImageIds.length) {
      formData.append('removedImageIds', JSON.stringify(removedImageIds));
    }

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/products/${product._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-ink/70 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl my-6 cut-corner max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 shrink-0">
          <h2 className="font-display font-semibold text-ink">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-steel hover:text-signal p-1" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-medium text-ink">Product Name *</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-ink">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-medium text-ink">Category *</span>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setNewCategory('');
                }}
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none bg-white"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-ink">Or add new category</span>
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Fasteners"
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-ink">Description *</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none"
            />
          </label>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink">Specifications</span>
              <button type="button" onClick={addSpec} className="text-xs font-medium text-signal">
                + Add row
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={s.key}
                    onChange={(e) => updateSpec(i, 'key', e.target.value)}
                    placeholder="Attribute (e.g. Material)"
                    className="flex-1 border border-line px-3 py-2 text-sm focus:border-ink outline-none"
                  />
                  <input
                    value={s.value}
                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                    placeholder="Value (e.g. Stainless Steel 316)"
                    className="flex-1 border border-line px-3 py-2 text-sm focus:border-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="px-2.5 text-steel hover:text-red-600"
                    aria-label="Remove row"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <span className="text-xs font-medium text-ink">Product Images</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div key={img.publicId} className="relative w-20 h-20 border border-line group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.publicId)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-ink text-white text-xs flex items-center justify-center rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={src} className="relative w-20 h-20 border border-signal">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-ink text-white text-xs flex items-center justify-center rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border border-dashed border-line flex items-center justify-center text-steel cursor-pointer hover:border-ink">
                <span className="text-xl">+</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </label>
            </div>
            <p className="mt-1.5 text-xs text-steel">Up to 8 images. JPG, PNG or WebP, 5MB max each.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="border-t border-line px-5 py-4 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="text-sm font-medium text-steel px-4 py-2.5 hover:text-ink">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-signal text-white text-sm font-semibold px-6 py-2.5 hover:bg-signalDark transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
