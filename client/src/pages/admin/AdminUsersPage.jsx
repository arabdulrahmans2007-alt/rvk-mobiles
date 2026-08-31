import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Plus, Trash2, X, ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const { adminToken, admin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('admin');

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.admins || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [adminToken]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ username, email, password, full_name: fullName, role })
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        alert(data.message || 'Error creating admin');
      }
    } catch (err) {
      console.error('Error creating admin:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this admin account?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) fetchUsers();
      else alert(data.message);
    } catch (err) {
      console.error('Error deleting admin:', err);
    }
  };

  return (
    <div className="space-y-6 antialiased">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Staff & Administrator Accounts</h2>
          <p className="text-xs text-slate-400">Manage administrative credentials for RVK Mobiles portal access.</p>
        </div>

        <button
          onClick={() => { setIsModalOpen(true); setUsername(''); setEmail(''); setPassword(''); setFullName(''); }}
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Admin User
        </button>
      </div>

      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading administrators...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
              <tr>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Username / Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/60 text-slate-300">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-navy-800/50">
                  <td className="py-3 px-4 font-bold text-white">{u.full_name}</td>
                  <td className="py-3 px-4">
                    <p className="font-mono text-white">{u.username}</p>
                    <p className="text-slate-400 text-[10px]">{u.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-4 text-right">
                    {u.id !== admin?.id && (
                      <button onClick={() => handleDelete(u.id)} className="p-1 text-red-400 hover:bg-red-950/40 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-navy-850 rounded-3xl border border-navy-700 max-w-md w-full p-6 space-y-4 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <h3 className="font-bold text-base font-display">Create Administrator</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Krishna Moorthy"
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin_username"
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@rvkmobiles.com"
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Secure password"
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}