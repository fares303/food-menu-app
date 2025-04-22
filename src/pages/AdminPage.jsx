import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminLogin from '../components/AdminLogin';
import Logo from '../components/Logo';
import { useMenu } from '../context/MenuContext';
import { FiRefreshCw, FiUpload } from 'react-icons/fi';
import { uploadImage } from '../services/supabaseService';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    menuData,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    deleteCategory,
    resetToDefaults,
    debugState,
    refreshMenu,
    lastRefresh,
    isLoading,
    isOnline
  } = useMenu();

  // State for showing success message
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('plats');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: '', name: '', order: 0 });
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'categories'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Refresh data when component mounts
  useEffect(() => {
    console.log('AdminPage component mounted, refreshing data');
    refreshMenu();
  }, [refreshMenu]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log('Manual refresh requested from admin page');
    refreshMenu();

    // Show refresh animation for 1 second
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
  };

  const handleSaveItem = async (e) => {
    // Prevent default form submission behavior
    if (e && e.preventDefault) e.preventDefault();

    if (!editingItem) return;

    if (!editingItem.name || !editingItem.price) {
      alert('Veuillez remplir tous les champs obligatoires (nom et prix)');
      return;
    }

    try {
      console.log('Updating item:', editingItem);
      const success = await updateMenuItem(selectedCategory, editingItem);

      if (success) {
        setSuccessMessage('Produit modifié avec succès!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setEditingItem(null);
      } else {
        console.error('Failed to update item');
        alert('Erreur lors de la modification du produit. Veuillez vérifier la console pour plus de détails.');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert(`Erreur lors de la modification du produit: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem(prev => ({ ...prev, [name]: value }));
    } else if (newItem) {
      setNewItem(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Generate a unique file name
      const fileName = `menu_${Date.now()}`;

      // Upload the image to Supabase Storage
      const imageUrl = await uploadImage(file, fileName);

      if (imageUrl) {
        // Update the form state with the new image URL
        if (editingItem) {
          setEditingItem(prev => ({ ...prev, image: imageUrl }));
        } else if (newItem) {
          setNewItem(prev => ({ ...prev, image: imageUrl }));
        }

        setSuccessMessage('Image téléchargée avec succès!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert('Erreur lors du téléchargement de l\'image. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erreur lors du téléchargement de l\'image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddNewItem = () => {
    setNewItem({
      id: `${selectedCategory[0]}${Date.now()}`, // Generate a unique ID
      name: '',
      description: '',
      price: '',
      isPopular: false,
      // Use a smaller image size to improve performance
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=40' // Default image with lower quality
    });
    setEditingItem(null);
  };

  const handleSaveNewItem = async (e) => {
    // Prevent default form submission behavior
    if (e && e.preventDefault) e.preventDefault();

    if (!newItem || !newItem.name || !newItem.price) {
      alert('Veuillez remplir tous les champs obligatoires (nom et prix)');
      return;
    }

    try {
      console.log('Adding new item:', newItem);
      const success = await addMenuItem(selectedCategory, newItem);

      if (success) {
        setSuccessMessage('Produit ajouté avec succès!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setNewItem(null);
      } else {
        console.error('Failed to add item');
        alert('Erreur lors de l\'ajout du produit. Veuillez vérifier la console pour plus de détails.');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert(`Erreur lors de l\'ajout du produit: ${error.message}`);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      console.log('Deleting item:', itemId);
      const success = await deleteMenuItem(selectedCategory, itemId);

      if (success) {
        setSuccessMessage('Produit supprimé avec succès!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error('Failed to delete item');
        alert('Erreur lors de la suppression du produit. Veuillez vérifier la console pour plus de détails.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Erreur lors de la suppression du produit: ${error.message}`);
    }
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value,
      id: name === 'name' ? value.toLowerCase().replace(/\s+/g, '') : prev.id,
      order: prev.order || categories.length + 1
    }));
  };

  const handleAddCategory = () => {
    setIsAddingCategory(true);
  };

  const handleSaveCategory = async (e) => {
    // Prevent default form submission behavior
    if (e && e.preventDefault) e.preventDefault();

    if (!newCategory.id || !newCategory.name) {
      alert('Veuillez remplir tous les champs obligatoires (nom et identifiant)');
      return;
    }

    try {
      console.log('Adding new category:', newCategory);
      const success = await addCategory(newCategory);

      if (!success) {
        alert('Une catégorie avec cet identifiant existe déjà.');
        return;
      }

      setSuccessMessage('Catégorie ajoutée avec succès!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsAddingCategory(false);
      setNewCategory({ id: '', name: '', order: 0 });
    } catch (error) {
      console.error('Error adding category:', error);
      alert(`Erreur lors de l\'ajout de la catégorie: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (categoryId === 'plats' || categoryId === 'sandwichs' || categoryId === 'boissons' || categoryId === 'desserts') {
      alert('Impossible de supprimer une catégorie par défaut.');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie et tous ses éléments ?')) return;

    try {
      console.log('Deleting category:', categoryId);
      const success = await deleteCategory(categoryId);

      if (success) {
        setSuccessMessage('Catégorie supprimée avec succès!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        // If the deleted category was selected, switch to 'plats'
        if (selectedCategory === categoryId) {
          setSelectedCategory('plats');
        }
      } else {
        console.error('Failed to delete category');
        alert('Erreur lors de la suppression de la catégorie. Veuillez vérifier la console pour plus de détails.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(`Erreur lors de la suppression de la catégorie: ${error.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        backgroundColor: '#000',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
      }}>
        <motion.div
          style={{ marginBottom: '2rem' }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <Logo size={180} />
        </motion.div>
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => window.location.href = '/'}
        />
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#000',
      minHeight: '100vh',
      color: 'white',
      padding: '2rem',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
    }}>
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid #333',
          paddingBottom: '1.5rem'
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Logo size={120} />
        </motion.div>
        <div>
          <motion.h1
            style={{
              fontSize: '1.8rem',
              color: '#d4af37',
              marginBottom: '0.8rem',
              fontWeight: '600',
              letterSpacing: '1px',
              textShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
            }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Panneau d'Administration
          </motion.h1>
          <motion.div
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => {
                debugState();
                alert('Données du menu affichées dans la console (F12)');
              }}
              style={{
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                border: '1px solid #1976d2',
                color: '#1976d2',
                cursor: 'pointer',
                marginRight: '1rem',
                fontSize: '0.875rem',
                padding: '8px 16px',
                borderRadius: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(25, 118, 210, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Debug
            </button>
            <button
              onClick={resetToDefaults}
              style={{
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                border: '1px solid #d32f2f',
                color: '#d32f2f',
                cursor: 'pointer',
                marginRight: '1rem',
                fontSize: '0.875rem',
                padding: '8px 16px',
                borderRadius: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(211, 47, 47, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(211, 47, 47, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Réinitialiser
            </button>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid #d4af37',
                color: '#d4af37',
                cursor: 'pointer',
                marginRight: '1rem',
                fontSize: '0.875rem',
                padding: '8px 16px',
                borderRadius: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Déconnexion
            </button>
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={isRefreshing ? { duration: 1, ease: 'linear' } : { duration: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid #4CAF50',
                color: '#4CAF50',
                cursor: 'pointer',
                fontSize: '0.875rem',
                padding: '8px 16px',
                borderRadius: '20px',
                marginRight: '1rem'
              }}
            >
              <FiRefreshCw size={16} />
              Actualiser
            </motion.button>

            <Link
              to="/"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #333',
                color: '#d4af37',
                cursor: 'pointer',
                fontSize: '0.875rem',
                padding: '8px 16px',
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#d4af37';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#333';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Retour au site
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          className="fixed top-4 right-4 z-50 rounded-lg shadow-xl p-4 max-w-md"
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.5 }}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          <span style={{ fontWeight: '500' }}>{successMessage}</span>
        </motion.div>
      )}

      {!isOnline && (
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          color: '#ef4444',
          padding: '0.75rem 1rem',
          borderRadius: '0.375rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          maxWidth: '600px',
          margin: '0 auto 1.5rem'
        }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            Vous êtes en mode hors ligne. Les modifications seront enregistrées localement et synchronisées lorsque vous serez à nouveau en ligne.
          </p>
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '4px solid rgba(212, 175, 55, 0.1)',
              borderTop: '4px solid #d4af37',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ color: '#d4af37' }}>Chargement des données...</p>
          </div>
        </div>
      ) : (
        <motion.div
          className="rounded-lg shadow-xl p-6 w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: '#111', borderRadius: '0.5rem' }}
        >
        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #333',
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.5rem 1rem',
              marginRight: '1rem',
              backgroundColor: activeTab === 'products' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              color: activeTab === 'products' ? '#d4af37' : '#999',
              border: 'none',
              borderBottom: activeTab === 'products' ? '2px solid #d4af37' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'products' ? '600' : '400',
              transition: 'all 0.3s ease'
            }}
          >
            Produits
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === 'categories' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              color: activeTab === 'categories' ? '#d4af37' : '#999',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '2px solid #d4af37' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'categories' ? '600' : '400',
              transition: 'all 0.3s ease'
            }}
          >
            Catégories
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#d4af37' }}>
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #333',
                  backgroundColor: '#222',
                  color: 'white'
                }}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: '500', color: '#d4af37' }}>Éléments du menu</h3>
                <button
                  onClick={handleAddNewItem}
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    color: '#d4af37',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    border: '1px solid #d4af37',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> Ajouter un produit
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuData[selectedCategory].length === 0 ? (
                  <div style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#999',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '0.375rem',
                    border: '1px dashed #333'
                  }}>
                    Aucun produit dans cette catégorie. Cliquez sur "Ajouter un produit" pour commencer.
                  </div>
                ) : (
                  menuData[selectedCategory].map(item => (
                    <div
                      key={item.id}
                      style={{
                        border: '1px solid #333',
                        borderRadius: '0.375rem',
                        padding: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#222'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: '500' }}>{item.name}</p>
                        <p style={{ fontSize: '0.875rem', color: '#d4af37' }}>{item.price}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditItem(item)}
                          style={{
                            backgroundColor: '#d4af37',
                            color: 'black',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          style={{
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            color: '#ef4444',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            border: '1px solid rgba(220, 38, 38, 0.3)',
                            cursor: 'pointer'
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {newItem && (
              <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '1rem' }}>
                <h3 style={{ fontWeight: '500', marginBottom: '0.75rem', color: '#d4af37' }}>Ajouter un nouveau produit</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                      Nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #333',
                        backgroundColor: '#222',
                        color: 'white'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newItem.description}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #333',
                        backgroundColor: '#222',
                        color: 'white',
                        minHeight: '5rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                      Prix
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={newItem.price}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #333',
                        backgroundColor: '#222',
                        color: 'white'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                      URL de l'image
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        name="image"
                        value={newItem.image}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #333',
                          backgroundColor: '#222',
                          color: 'white'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4CAF50',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #4CAF50',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          whiteSpace: 'nowrap'
                        }}
                        disabled={isUploading || !isOnline}
                      >
                        <FiUpload size={16} />
                        {isUploading ? 'Téléchargement...' : 'Télécharger'}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={isUploading || !isOnline}
                      />
                    </div>
                    {!isOnline && (
                      <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                        Le téléchargement d'images n'est pas disponible en mode hors ligne.
                      </p>
                    )}
                    {newItem.image && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <img
                          src={newItem.image}
                          alt="Aperçu"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '150px',
                            borderRadius: '0.375rem',
                            border: '1px solid #333'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}>
                      <input
                        type="checkbox"
                        name="isPopular"
                        checked={newItem.isPopular || false}
                        onChange={(e) => {
                          setNewItem(prev => ({
                            ...prev,
                            isPopular: e.target.checked
                          }));
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ color: '#d4af37', fontSize: '0.875rem', fontWeight: '500' }}>
                        Marquer comme populaire
                      </span>
                    </label>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      onClick={() => setNewItem(null)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#999',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #333',
                        cursor: 'pointer'
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNewItem}
                      style={{
                        backgroundColor: '#d4af37',
                        color: 'black',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: '500', color: '#d4af37' }}>Catégories</h3>
                <button
                  onClick={handleAddCategory}
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    color: '#d4af37',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    border: '1px solid #d4af37',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> Ajouter une catégorie
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {categories.map(category => (
                  <div
                    key={category.id}
                    style={{
                      border: '1px solid #333',
                      borderRadius: '0.375rem',
                      padding: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#222'
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: '500' }}>{category.name}</p>
                      <p style={{ fontSize: '0.875rem', color: '#999' }}>ID: {category.id}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.1)',
                          color: '#d4af37',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          border: '1px solid #d4af37',
                          cursor: 'pointer'
                        }}
                      >
                        Voir les produits
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        style={{
                          backgroundColor: 'rgba(220, 38, 38, 0.1)',
                          color: '#ef4444',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          border: '1px solid rgba(220, 38, 38, 0.3)',
                          cursor: 'pointer',
                          opacity: category.id === 'plats' || category.id === 'sandwichs' || category.id === 'boissons' || category.id === 'desserts' ? '0.5' : '1'
                        }}
                        disabled={category.id === 'plats' || category.id === 'sandwichs' || category.id === 'boissons' || category.id === 'desserts'}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isAddingCategory && (
              <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '1rem' }}>
                <h3 style={{ fontWeight: '500', marginBottom: '0.75rem', color: '#d4af37' }}>Ajouter une nouvelle catégorie</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                      Nom de la catégorie
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newCategory.name}
                      onChange={handleCategoryInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #333',
                        backgroundColor: '#222',
                        color: 'white'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                      Identifiant (généré automatiquement)
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={newCategory.id}
                      onChange={handleCategoryInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #333',
                        backgroundColor: '#222',
                        color: '#999'
                      }}
                      readOnly
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      onClick={() => setIsAddingCategory(false)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#999',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #333',
                        cursor: 'pointer'
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCategory}
                      style={{
                        backgroundColor: '#d4af37',
                        color: 'black',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {editingItem && (
          <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '1rem' }}>
            <h3 style={{ fontWeight: '500', marginBottom: '0.75rem', color: '#d4af37' }}>Modifier l'élément</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingItem.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #333',
                    backgroundColor: '#222',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={editingItem.description}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #333',
                    backgroundColor: '#222',
                    color: 'white',
                    minHeight: '5rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                  Prix
                </label>
                <input
                  type="text"
                  name="price"
                  value={editingItem.price}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #333',
                    backgroundColor: '#222',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#d4af37' }}>
                  URL de l'image
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    name="image"
                    value={editingItem.image}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #333',
                      backgroundColor: '#222',
                      color: 'white'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      color: '#4CAF50',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #4CAF50',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                    disabled={isUploading || !isOnline}
                  >
                    <FiUpload size={16} />
                    {isUploading ? 'Téléchargement...' : 'Télécharger'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={isUploading || !isOnline}
                  />
                </div>
                {!isOnline && (
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                    Le téléchargement d'images n'est pas disponible en mode hors ligne.
                  </p>
                )}
                {editingItem.image && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={editingItem.image}
                      alt="Aperçu"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '150px',
                        borderRadius: '0.375rem',
                        border: '1px solid #333'
                      }}
                    />
                  </div>
                )}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={editingItem.isPopular || false}
                    onChange={(e) => {
                      setEditingItem(prev => ({
                        ...prev,
                        isPopular: e.target.checked
                      }));
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ color: '#d4af37', fontSize: '0.875rem', fontWeight: '500' }}>
                    Marquer comme populaire
                  </span>
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => setEditingItem(null)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#999',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #333',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveItem}
                  style={{
                    backgroundColor: '#d4af37',
                    color: 'black',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      )}

      <footer style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.875rem', color: '#d4af37' }}>
        <p>© 2025 Casa Nova Restaurant. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default AdminPage;
