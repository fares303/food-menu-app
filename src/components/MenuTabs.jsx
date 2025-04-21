import { motion } from 'framer-motion';
import { useMenu } from '../context/MenuContext';

const MenuTabs = ({ activeCategory, setActiveCategory }) => {
  const { categories } = useMenu();
  return (
    <div className="flex justify-center mb-8 border-b overflow-x-auto" style={{ borderColor: '#333', paddingBottom: '8px' }}>
      <div className="flex space-x-6">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className="menu-tab relative"
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              color: activeCategory === category.id ? '#d4af37' : '#999',
              fontWeight: activeCategory === category.id ? '600' : '400',
              padding: '8px 16px',
              fontSize: '18px',
              letterSpacing: '1px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              textShadow: activeCategory === category.id ? '0 0 10px rgba(212, 175, 55, 0.3)' : 'none'
            }}
          >
            {category.name}
            {activeCategory === category.id && (
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '0',
                  right: '0',
                  height: '3px',
                  backgroundColor: '#d4af37',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)'
                }}
                layoutId="underline"
                initial={{ width: 0, left: '50%', right: '50%' }}
                animate={{ width: '100%', left: '0%', right: '0%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MenuTabs;
