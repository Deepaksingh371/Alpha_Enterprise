import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import socket from '../../socket.js';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setData(data);
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewEnquiry = (enquiry) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        stats: {
          ...prev.stats,
          totalEnquiries: prev.stats.totalEnquiries + 1,
          newEnquiries: prev.stats.newEnquiries + 1,
        },
        recentEnquiries: [
          {
            _id: enquiry.id,
            name: enquiry.name,
            companyName: enquiry.companyName,
            productName: enquiry.productName,
            createdAt: enquiry.createdAt,
          },
          ...prev.recentEnquiries,
        ].slice(0, 5),
      };
    });

    if (
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      new Notification('New Enquiry Received', {
        body: `${enquiry.name} - ${enquiry.productName}`,
      });
    }
  };

  useEffect(() => {
    loadDashboard();

    if ('Notification' in window) {
      Notification.requestPermission();
    }

    socket.on('newEnquiry', handleNewEnquiry);

    return () => {
      socket.off('newEnquiry', handleNewEnquiry);
    };
  }, []);

  if (loading) return <Loader label="Loading dashboard" />;

  if (!data) {
    return (
      <p className="text-steel">
        Couldn't load dashboard data.
      </p>
    );
  }

  const { stats, recentEnquiries, recentProducts } = data;

  const cards = [
    { label: 'Total Products', value: stats.totalProducts },
    { label: 'Active Products', value: stats.activeProducts },
    { label: 'Total Enquiries', value: stats.totalEnquiries },
    { label: 'New Enquiries', value: stats.newEnquiries },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink">
        Dashboard
      </h1>

      <p className="mt-1 text-sm text-steel">
        Overview of your catalog and incoming enquiries.
      </p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white border border-line p-5"
          >
            <p className="text-2xl font-display font-semibold text-ink">
              {c.value}
            </p>

            <p className="mt-1 text-xs text-steel">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-line">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <h2 className="font-display font-semibold text-ink">
              Recent Enquiries
            </h2>

            <Link
              to="/admin/enquiries"
              className="text-xs font-medium text-signal"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-line">
            {recentEnquiries.length === 0 && (
              <p className="px-5 py-6 text-sm text-steel">
                No enquiries yet.
              </p>
            )}

            {recentEnquiries.map((e) => (
              <div
                key={e._id}
                className="px-5 py-3.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">
                    {e.name}
                  </p>

                  <span className="text-xs text-steel">
                    {new Date(
                      e.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-steel mt-0.5">
                  {e.productName} · {e.companyName}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-line">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <h2 className="font-display font-semibold text-ink">
              Recent Products
            </h2>

            <Link
              to="/admin/products"
              className="text-xs font-medium text-signal"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-line">
            {recentProducts.length === 0 && (
              <p className="px-5 py-6 text-sm text-steel">
                No products yet.
              </p>
            )}

            {recentProducts.map((p) => (
              <div
                key={p._id}
                className="px-5 py-3.5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {p.name}
                  </p>

                  <p className="text-xs text-steel mt-0.5">
                    {p.category}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-2 py-1 ${
                    p.status === 'Active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-mist text-steel'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;