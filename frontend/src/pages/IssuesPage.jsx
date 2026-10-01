import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

const initialMembers = [
  { _id: 'm1', memberId: 'MEM-101', name: 'Aditi Sharma', email: 'aditi@gmail.com', mobile: '9876543210', status: 'ACTIVE' },
  { _id: 'm2', memberId: 'MEM-102', name: 'Rahul Verma', email: 'rahul@gmail.com', mobile: '9123456780', status: 'ACTIVE' },
  { _id: 'm3', memberId: 'MEM-103', name: 'Neha Singh', email: 'neha@gmail.com', mobile: '9988776655', status: 'INACTIVE' },
];

const MembersPage = ({ token }) => {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', memberId: '' });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (editingMember) {
      setMembers((prev) => prev.map((member) => member._id === editingMember._id ? { ...member, ...formData, status: member.status } : member));
    } else {
      setMembers((prev) => [{ _id: `m-${Date.now()}`, ...formData, status: 'ACTIVE' }, ...prev]);
    }
    setShowModal(false);
    setFormData({ name: '', email: '', mobile: '', memberId: '' });
    setEditingMember(null);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Are you sure?')) {
      setMembers((prev) => prev.filter((member) => member._id !== id));
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.includes(searchTerm) ||
    member.mobile?.includes(searchTerm)
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">Members</p>
            <h1 className="text-3xl font-bold text-slate-900">Members Management</h1>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setEditingMember(null); setFormData({ name: '', email: '', mobile: '', memberId: '' }); setShowModal(true); }} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
            <FiPlus /> <span>Add Member</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
          <input type="text" placeholder="Search by name, email, or mobile..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Member ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Mobile</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <motion.tr key={member._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{member.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.memberId}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.mobile}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${member.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => { setEditingMember(member); setFormData({ name: member.name, email: member.email, mobile: member.mobile, memberId: member.memberId }); setShowModal(true); }} className="text-blue-600 hover:text-blue-700"><FiEdit /></button>
                      <button onClick={() => handleDeleteMember(member._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              <input type="tel" placeholder="Mobile" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              <input type="text" placeholder="Member ID" value={formData.memberId} onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl">Save</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MembersPage;
