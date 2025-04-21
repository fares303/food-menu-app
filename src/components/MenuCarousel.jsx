import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import MenuItemCard from './MenuItemCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const MenuCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset current index when items change
  useEffect(() => {
    console.log('MenuCarousel items changed:', items);
    if (items && items.length > 0 && currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  if (!items || items.length === 0) {
    return <div className="text-center py-10" style={{ color: 'white' }}>Aucun élément à afficher</div>;
  }

  return (
    <div className="relative max-w-md mx-auto" {...handlers}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <MenuItemCard item={items[currentIndex]} />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        <motion.button
          onClick={goToPrevious}
          className="p-3 rounded-full shadow-md transition-colors"
          style={{
            backgroundColor: '#222',
            color: '#d4af37',
            border: '1px solid #333',
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)',
            color: '#f0d078'
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Précédent"
        >
          <FiChevronLeft size={24} />
        </motion.button>
        <div className="flex items-center space-x-1">
          {items.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="rounded-full"
              style={{
                width: index === currentIndex ? '10px' : '8px',
                height: index === currentIndex ? '10px' : '8px',
                backgroundColor: index === currentIndex ? '#d4af37' : '#4a4a4a',
                margin: '0 3px',
                border: index === currentIndex ? '1px solid #d4af37' : 'none',
                boxShadow: index === currentIndex ? '0 0 8px rgba(212, 175, 55, 0.6)' : 'none',
                transition: 'all 0.3s ease'
              }}
              whileHover={{
                scale: 1.2,
                backgroundColor: index === currentIndex ? '#f0d078' : '#666'
              }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Aller à l'élément ${index + 1}`}
            />
          ))}
        </div>
        <motion.button
          onClick={goToNext}
          className="p-3 rounded-full shadow-md transition-colors"
          style={{
            backgroundColor: '#222',
            color: '#d4af37',
            border: '1px solid #333',
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)',
            color: '#f0d078'
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Suivant"
        >
          <FiChevronRight size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default MenuCarousel;
