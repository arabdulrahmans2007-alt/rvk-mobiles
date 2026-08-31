import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Tag, Plus, Edit2, Trash2, X, Sparkles, Bell, CheckCircle2, Star } from 'lucide-react';

export default function AdminOffersPage() {
  const { adminToken } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState("TODAY'S SPECIAL");
  const [originalPrice, setOriginalPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [discountText, setDiscountText] = useState('');
  const [targetService, setTargetService] = useState('Display Replacement');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
  const [isTodaysOffer, setIsTodaysOffer] = useState(true);

  const fetchOffers = () => {
    setLoading(true);
    fetch('/api/offers/admin/all', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOffers(data.offers || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching admin offers:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOffers();
  }, [adminToken]);

  const openNewModal = () => {
    setIsNew(true);
    setEditingOffer({});
    setTitle('');
    setDescription('');
    setBadge("TODAY'S SPECIAL");
    setOriginalPrice('');
    setOfferPrice('');
    setDiscountText('');
    setTargetService('Display Replacement');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
    setIsTodaysOffer(true);
  };

  const openEditModal = (o) => {
    setIsNew(false);
    setEditingOffer(o);
    setTitle(o.title);
    setDescription(o.description);
    setBadge(o.badge || "TODAY'S SPECIAL");
    setOriginalPrice(o.original_price || '');
    setOfferPrice(o.offer_price || '');
    setDiscountText(o.discount_text || '');
    setTargetService(o.target_service || 'Display Replacement');
    setStartDate(o.start_date || '');
    setEndDate(o.end_date || '');
    setIsTodaysOffer(o.is_todays_offer === 1);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      badge,
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      offer_price: offerPrice ? parseFloat(offerPrice) : null,
      discount_text: discountText,
      target_service: targetService,
      start_date: startDate,
      end_date: endDate,
      is_todays_offer: isTodaysOffer ? 1 : 0
    };

    try {
      const url = isNew ? '/api/offers/admin' : `/api/offers/admin/${editingOffer.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setEditingOffer(null);
        setPublishSuccess(isNew ? 'Offer created and in-app customer notification published!' : 'Offer updated successfully!');
        fetchOffers();
        setTimeout(() => setPublishSuccess(''), 5000);
      } else {
        alert(data.message || 'Failed to save offer');
      }
    } catch (err) {
      console.error('Error saving offer:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      const res = await fetch(`/api/offers/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) fetchOffers();
    } catch (err) {
      console.error('Error deleting offer:', err);
    }
  };

  return (
    <div className="space-y-6 antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Promotions & Today's Offer Management</h2>
          <p className="text-xs text-slate-400">Publishing an offer automatically updates homepage & sends in-app customer notifications.</p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </button>
      </div>

      {publishSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{publishSuccess}</span>
        </div>
      )}

      {/* Offers Table */}
      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">No offers configured.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
                <tr>
                  <th className="py-3 px-4">Offer Title & Badge</th>
                  <th className="py-3 px-4">Target Service</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Homepage Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/60 text-slate-300">
                {offers.map((o) => (
                  <tr key={o.id} className="hover:bg-navy-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-navy-700 text-brand-300 px-2 py-0.5 rounded">{o.badge}</span>
                        <p className="font-bold text-white text-sm line-clamp-1">{o.title}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{o.description}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{o.target_service}</td>
                    <td className="py-3 px-4">
                      <span className="font-black text-brand-300 text-sm">
                        {o.offer_price ? `₹${o.offer_price}` : 'Special'}
                      </span>
                      {o.original_price && <span className="text-[10px] line-through text-slate-500 ml-1">₹{o.original_price}</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {o.start_date} → {o.end_date}
                    </td>
                    <td className="py-3 px-4">
                      {o.is_todays_offer === 1 ? (
                        <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1 w-max">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Today's Offer
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Standard Active</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button onClick={() => openEditModal(o)} className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-brand-400">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(o.id)} className="p-1.5 rounded-lg bg-navy-800 hover:bg-red-950/40 text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-navy-850 rounded-3xl border border-navy-700 max-w-lg w-full p-6 space-y-4 text-white animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <h3 className="font-bold text-base font-display">{isNew ? 'Create New Offer' : 'Edit Offer'}</h3>
              <button onClick={() => setEditingOffer(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Offer Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. LCD Display Replacement + Free Tempered Glass"
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Offer Badge</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="TODAY'S SPECIAL"
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Target Service/Category</label>
                  <select
                    value={targetService}
                    onChange={(e) => setTargetService(e.target.value)}
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  >
                    <option>Display Replacement</option>
                    <option>Accessories</option>
                    <option>Doorstep Service</option>
                    <option>Storewide</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Savings / Discount Text</label>
                <input
                  type="text"
                  value={discountText}
                  onChange={(e) => setDiscountText(e.target.value)}
                  placeholder="e.g. Save ₹400 Today"
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Detailed description of the offer..."
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Expiry Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  />
                </div>
              </div>

              <div className="p-3 bg-navy-800 rounded-xl border border-navy-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Mark as Today's Highlight Offer</span>
                  <span className="text-[10px] text-slate-400">Featured prominently on the customer homepage</span>
                </div>
                <input
                  type="checkbox"
                  checked={isTodaysOffer}
                  onChange={(e) => setIsTodaysOffer(e.target.checked)}
                  className="w-5 h-5 rounded text-brand-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Publish Offer & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}