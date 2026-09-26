import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../../components/Logo.jsx';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-white border border-line cut-corner p-7">
          <h1 className="font-display font-semibold text-xl text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-steel">Sign in to manage products and enquiries.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-ink">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-ink">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink outline-none transition-colors"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white text-sm font-semibold py-3 hover:bg-signal transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="mt-5 text-center text-xs text-steel">
          First time here? Run <code className="bg-white border border-line px-1.5 py-0.5">npm run seed</code> in
          the backend to create an admin account.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
