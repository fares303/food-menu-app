import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MenuTabs from './components/MenuTabs';
import MenuCarousel from './components/MenuCarousel';
import Logo from './components/Logo';
import SpecialsSection from './components/SpecialsSection';
import { useMenu } from './context/MenuContext';

function App() {
  const [activeCategory, setActiveCategory] = useState('plats');
  const { menuData, categories, lastRefresh, refreshMenu, isLoading, isOnline } = useMenu();

  // Log when the app re-renders due to menu updates
  useEffect(() => {
    console.log('App re-rendered due to menu update at:', new Date().toLocaleTimeString());
    console.log('Current menu data:', menuData);
    console.log('Current active category:', activeCategory);
    console.log('Items in active category:', menuData[activeCategory]);
  }, [lastRefresh, menuData, activeCategory]);

  // Add a hidden refresh mechanism

  // Refresh data when component mounts
  useEffect(() => {
    console.log('App component mounted, refreshing data');
    refreshMenu();
  }, [refreshMenu]);

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#000', color: 'white' }}>
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <p style={{ color: '#d4af37', marginTop: '20px', fontSize: '18px', fontStyle: 'italic' }}>Découvrez nos délicieuses spécialités</p>
      </motion.header>

      {!isOnline && (
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          color: '#ef4444',
          padding: '0.5rem 1rem',
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
            Vous êtes en mode hors ligne. Certaines fonctionnalités peuvent être limitées.
          </p>
        </div>
      )}

      <main className="max-w-4xl mx-auto">
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
              <p style={{ color: '#d4af37' }}>Chargement du menu...</p>
            </div>
          </div>
        ) : (
          <>
            <SpecialsSection />

            <MenuTabs
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

            <div className="py-6">
              <MenuCarousel items={menuData[activeCategory]} />
            </div>
          </>
        )}
      </main>

      <footer className="mt-16 text-center text-sm" style={{ color: '#d4af37' }}>
        <p>© 2025 Casa Nova Restaurant. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
