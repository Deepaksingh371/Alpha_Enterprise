import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import ProductFormModal from './ProductFormModal.jsx';
import ProductImagePlaceholder from '../../components/ProductImagePlaceholder.jsx';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products/admin/all', {
          params: {
            search: search || undefined,
            category: category !== 'All' ? category : undefined,
            status: status !== 'All' ? status : undefined,
            limit: 50,
          },
        }),
        api.get('/products/meta/categories'),
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, status]);

  useEffect(() => {
    const timer = setTimeout(fetchAll, 300);
    return () => clearTimeout(timer);
  }, [fetchAll]);

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    fetchAll();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api.delete(`/products/${deleting._id}`);
      setDeleting(null);
      fetchAll();
    } catch {
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Products</h1>
          <p className="mt-1 text-sm text-steel">Add, edit or remove products shown on the public site.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="bg-signal text-white text-sm font-semibold px-5 py-2.5 hover:bg-signalDark transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name…"
          className="flex-1 border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none bg-white"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none bg-white"
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none bg-white"
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="mt-6 bg-white border border-line overflow-x-auto">
        {loading ? (
          <Loader label="Loading products" />
        ) : products.length === 0 ? (
          <p className="text-center py-16 text-steel">No products found. Add your first product to get started.</p>
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-line text-left text-xs text-steel uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-line shrink-0">
                        {p.images?.[0]?.url ? (
                          <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ProductImagePlaceholder className="w-full h-full" />
                        )}
                      </div>
                      <span className="font-medium text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-steel">{p.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 ${
                        p.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-mist text-steel'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-steel">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setFormOpen(true);
                        }}
                        className="text-signal font-medium"
                      >
                        Edit
                      </button>
                      <button onClick={() => setDeleting(p)} className="text-steel hover:text-red-600 font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {formOpen && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
          onClick={() => setDeleting(null)}
        >
          <div className="bg-white w-full max-w-sm cut-corner p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-semibold text-ink">Delete product?</h3>
            <p className="mt-2 text-sm text-steel">
              This will permanently remove <span className="text-ink font-medium">{deleting.name}</span> and its
              images. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleting(null)} className="text-sm font-medium text-steel px-4 py-2.5">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteBusy}
                className="bg-red-600 text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleteBusy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
