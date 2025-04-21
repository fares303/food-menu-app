import { motion } from 'framer-motion';
import { useState } from 'react';

const MenuItemCard = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  return (
    <motion.div
      className="menu-card max-w-md mx-auto"
      style={{
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(212, 175, 55, 0.1)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{
        y: -5,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.2)'
      }}
    >
      <div className="relative overflow-hidden">
        {imageError ? (
          <div
            style={{
              width: '100%',
              height: '250px',
              backgroundColor: '#222',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              borderBottom: '1px solid #333'
            }}
          >
            Image non disponible
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <motion.img
              src={item.image}
              alt={item.name}
              className="menu-item-image"
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
                borderBottom: '1px solid #333',
                opacity: imageLoaded ? 1 : 0.3,
                transition: 'opacity 0.3s ease'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {item.isPopular && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: '#d4af37',
                color: 'black',
                padding: '0.25rem 0.75rem',
                borderRadius: '2rem',
                fontWeight: '600',
                fontSize: '0.75rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                zIndex: 10
              }}>
                Populaire
              </div>
            )}
          </div>
        )}
        <motion.div
          className="image-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>
      <div className="p-6">
        <motion.h3
          className="menu-item-title"
          style={{
            color: 'white',
            fontSize: '22px',
            fontWeight: '600',
            marginBottom: '8px',
            borderLeft: '3px solid #d4af37',
            paddingLeft: '10px',
            textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
          }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {item.name}
        </motion.h3>
        <motion.p
          className="menu-item-description"
          style={{
            color: '#aaa',
            fontSize: '15px',
            lineHeight: '1.5',
            marginBottom: '16px',
            fontStyle: 'italic'
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {item.description}
        </motion.p>
        <motion.div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <p
            className="menu-item-price"
            style={{
              color: '#d4af37',
              fontSize: '20px',
              fontWeight: 'bold',
              padding: '4px 12px',
              border: '1px solid #d4af37',
              borderRadius: '20px',
              background: 'rgba(212, 175, 55, 0.1)',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
            }}
          >
            {item.price}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
