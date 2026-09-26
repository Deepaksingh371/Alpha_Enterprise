import { useCallback, useEffect, useState } from 'react';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import socket from '../../socket.js';
const statusColors = {
  New: 'bg-signal/10 text-signalDark',
  Contacted: 'bg-blue-50 text-blue-700',
  Closed: 'bg-mist text-steel',
};

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/enquiries', {
        params: { search: search || undefined, status: status !== 'All' ? status : undefined, limit: 50 },
      });
      setEnquiries(data.enquiries);
    } catch {
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  }, [search, status]);
useEffect(() => {
  const handleNewEnquiry = (enquiry) => {
    setEnquiries((prev) => {
      const exists = prev.some(
        (e) => e._id === enquiry.id
      );

      if (exists) return prev;

      return [
        {
          _id: enquiry.id,
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          companyName: enquiry.companyName,
          productName: enquiry.productName,
          message: enquiry.message,
          status: 'New',
          createdAt: enquiry.createdAt,
        },
        ...prev,
      ];
    });
  };

  socket.on('newEnquiry', handleNewEnquiry);

  return () => {
    socket.off('newEnquiry', handleNewEnquiry);
  };
}, []);
  useEffect(() => {
    const timer = setTimeout(fetchAll, 300);
    return () => clearTimeout(timer);
  }, [fetchAll]);

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api.delete(`/enquiries/${deleting._id}`);
      setDeleting(null);
      setViewing(null);
      fetchAll();
    } catch {
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setStatusBusy(true);
    try {
      const { data } = await api.put(`/enquiries/${id}`, { status: newStatus });
      setEnquiries((prev) => prev.map((e) => (e._id === id ? data.enquiry : e)));
      setViewing((v) => (v && v._id === id ? data.enquiry : v));
    } finally {
      setStatusBusy(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink">Enquiries</h1>
      <p className="mt-1 text-sm text-steel">Customer product enquiries submitted from the website.</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, company or product…"
          className="flex-1 border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none bg-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none bg-white"
        >
          <option value="All">All statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="mt-6 bg-white border border-line overflow-x-auto">
        {loading ? (
          <Loader label="Loading enquiries" />
        ) : enquiries.length === 0 ? (
          <p className="text-center py-16 text-steel">No enquiries found yet.</p>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-line text-left text-xs text-steel uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {enquiries.map((e) => (
                <tr key={e._id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{e.name}</p>
                    <p className="text-xs text-steel">{e.email}</p>
                  </td>
                  <td className="px-4 py-3 text-steel">{e.productName}</td>
                  <td className="px-4 py-3 text-steel">{e.companyName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 ${statusColors[e.status] || 'bg-mist text-steel'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-steel">{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setViewing(e)} className="text-signal font-medium">
                        View
                      </button>
                      <button onClick={() => setDeleting(e)} className="text-steel hover:text-red-600 font-medium">
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

      {/* View enquiry details */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
          onClick={() => setViewing(null)}
        >
          <div className="bg-white w-full max-w-md cut-corner" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="font-display font-semibold text-ink">Enquiry Details</h3>
              <button onClick={() => setViewing(null)} className="text-steel hover:text-signal p-1" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <Row label="Full Name" value={viewing.name} />
              <Row label="Email" value={viewing.email} link={`mailto:${viewing.email}`} />
              <Row label="Phone" value={viewing.phone} link={`tel:${viewing.phone}`} />
              <Row label="Company" value={viewing.companyName} />
              <Row label="Product" value={viewing.productName} />
              <Row label="Received" value={new Date(viewing.createdAt).toLocaleString()} />
              {viewing.message && (
                <div>
                  <p className="text-xs text-steel uppercase tracking-wide">Message</p>
                  <p className="mt-1 text-ink leading-relaxed">{viewing.message}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-steel uppercase tracking-wide mb-1.5">Status</p>
                <div className="flex gap-2">
                  {['New', 'Contacted', 'Closed'].map((s) => (
                    <button
                      key={s}
                      disabled={statusBusy}
                      onClick={() => updateStatus(viewing._id, s)}
                      className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                        viewing.status === s ? 'bg-ink text-white border-ink' : 'border-line text-steel hover:border-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-line px-5 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleting(viewing);
                }}
                className="text-sm font-medium text-red-600"
              >
                Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleting && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
          onClick={() => setDeleting(null)}
        >
          <div className="bg-white w-full max-w-sm cut-corner p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-semibold text-ink">Delete enquiry?</h3>
            <p className="mt-2 text-sm text-steel">
              This will permanently remove the enquiry from <span className="text-ink font-medium">{deleting.name}</span>.
              This cannot be undone.
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

const Row = ({ label, value, link }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-xs text-steel uppercase tracking-wide shrink-0 pt-0.5">{label}</span>
    {link ? (
      <a href={link} className="text-ink font-medium text-right hover:text-signal">
        {value}
      </a>
    ) : (
      <span className="text-ink font-medium text-right">{value}</span>
    )}
  </div>
);

export default AdminEnquiries;
