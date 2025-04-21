import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data/menuData';
import AdminLogin from './AdminLogin';

const AdminPanel = ({ menuData, onUpdateMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('plats');
  const [editingItem, setEditingItem] = useState(null);

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
  };

  const handleSaveItem = () => {
    if (!editingItem) return;

    const updatedMenuData = { ...menuData };
    const itemIndex = updatedMenuData[selectedCategory].findIndex(item => item.id === editingItem.id);

    if (itemIndex !== -1) {
      updatedMenuData[selectedCategory][itemIndex] = editingItem;
      onUpdateMenu(updatedMenuData);
    }

    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setIsOpen(true);
    } else {
      setShowLoginForm(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginForm(false);
    setIsOpen(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <>
        <button
          onClick={handleAdminClick}
          className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-colors"
          style={{ backgroundColor: '#d4af37', color: 'white' }}
        >
          Admin
        </button>

        <AnimatePresence>
          {showLoginForm && (
            <AdminLogin
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => setShowLoginForm(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        style={{ backgroundColor: '#f8f8f8' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#333' }}>Panneau d'Administration</h2>
          <div>
            <button
              onClick={handleLogout}
              className="mr-2 text-sm"
              style={{ color: '#d4af37' }}
            >
              Déconnexion
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setEditingItem(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
            Catégorie
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-medium mb-2" style={{ color: '#333' }}>Éléments du menu</h3>
          <div className="space-y-2">
            {menuData[selectedCategory].map(item => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-md p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.price}</p>
                </div>
                <button
                  onClick={() => handleEditItem(item)}
                  className="px-3 py-1 rounded-md text-sm"
                  style={{ backgroundColor: '#d4af37', color: 'white' }}
                >
                  Modifier
                </button>
              </div>
            ))}
          </div>
        </div>

        {editingItem && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-medium mb-3" style={{ color: '#333' }}>Modifier l'élément</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingItem.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={editingItem.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
                  Prix
                </label>
                <input
                  type="text"
                  name="price"
                  value={editingItem.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
                  URL de l'image
                </label>
                <input
                  type="text"
                  name="image"
                  value={editingItem.image}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveItem}
                  className="px-4 py-2 rounded-md"
                  style={{ backgroundColor: '#d4af37', color: 'white' }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
