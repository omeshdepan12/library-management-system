import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import axios from 'axios';

const initialData = [
  { _id: 'b1', bookId: 'BK-1001', isbn: '978-1-2345-6789-0', bookName: 'Atomic Habits', quantity: 12, availableQuantity: 9, status: 'AVAILABLE' },
  { _id: 'b2', bookId: 'BK-1002', isbn: '978-0-1234-5678-9', bookName: 'The Alchemist', quantity: 8, availableQuantity: 4, status: 'ISSUED' },
  { _id: 'b3', bookId: 'BK-1003', isbn: '978-9-8765-4321-0', bookName: 'Rich Dad Poor Dad', quantity: 15, availableQuantity: 12, status: 'AVAILABLE' },
  { _id: 'b4', bookId: 'BK-1004', isbn: '978-2-3456-7890-1', bookName: 'Deep Work', quantity: 10, availableQuantity: 2, status: 'RESERVED' },
];

const BooksPage = ({ token }) => {
  const [books, setBooks] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    bookId: '',
    isbn: '',
    bookName: '',
    quantity: '',
  });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response?.data?.data?.length) setBooks(response.data.data);
      } catch (error) {
        console.log('Using demo books dataset');
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [token]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      availableQuantity: Number(formData.quantity),
      status: 'AVAILABLE',
    };

    if (editingBook) {
      setBooks((prev) => prev.map((book) => (book._id === editingBook._id ? { ...book, ...payload } : book)));
    } else {
      setBooks((prev) => [{
        _id: `b-${Date.now()}`,
        ...payload,
      }, ...prev]);
    }

    setShowModal(false);
    setFormData({ bookId: '', isbn: '', bookName: '', quantity: '' });
    setEditingBook(null);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure?')) {
      setBooks((prev) => prev.filter((book) => book._id !== id));
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.bookName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.includes(searchTerm) ||
      book.bookId?.includes(searchTerm)
  );

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" /></div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-600">Catalog</p>
            <h1 className="text-3xl font-bold text-slate-900">Books Management</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingBook(null);
              setFormData({ bookId: '', isbn: '', bookName: '', quantity: '' });
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
          >
            <FiPlus /> <span>Add Book</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ISBN, or Book ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white shadow-sm"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Book Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Book ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">ISBN</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Available</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <motion.tr key={book._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{book.bookName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{book.bookId}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{book.isbn}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{book.quantity}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{book.availableQuantity}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      book.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' :
                      book.status === 'ISSUED' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'} `}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => { setEditingBook(book); setFormData({ bookId: book.bookId, isbn: book.isbn, bookName: book.bookName, quantity: book.quantity }); setShowModal(true); }} className="text-blue-600 hover:text-blue-700"><FiEdit /></button>
                      <button onClick={() => handleDeleteBook(book._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
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
            <h2 className="text-2xl font-bold mb-6 text-slate-900">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleAddBook} className="space-y-4">
              <input type="text" placeholder="Book ID" value={formData.bookId} onChange={(e) => setFormData({ ...formData, bookId: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <input type="text" placeholder="ISBN" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <input type="text" placeholder="Book Name" value={formData.bookName} onChange={(e) => setFormData({ ...formData, bookName: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl">Save</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BooksPage;
