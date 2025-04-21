import { useState } from 'react';
import { motion } from 'framer-motion';
import { specialsData } from '../data/menuData';

const SpecialsSection = () => {
  const [activeSpecial, setActiveSpecial] = useState(0);

  const handleNext = () => {
    setActiveSpecial((prev) => (prev === specialsData.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveSpecial((prev) => (prev === 0 ? specialsData.length - 1 : prev - 1));
  };

  return (
    <motion.div
      className="specials-section mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="text-center mb-6">
        <h2 style={{
          color: '#d4af37',
          fontSize: '1.75rem',
          fontWeight: '600',
          textShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
          marginBottom: '0.5rem'
        }}>
          Nos Spécialités du Jour
        </h2>
        <p style={{ color: '#999', fontStyle: 'italic' }}>
          Découvrez nos créations exclusives, disponibles uniquement aujourd'hui
        </p>
      </div>

      <div style={{
        position: 'relative',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#111',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.2)'
      }}>
        <div style={{ position: 'relative' }}>
          <motion.img
            src={specialsData[activeSpecial].image}
            alt={specialsData[activeSpecial].name}
            style={{
              width: '100%',
              height: '250px',
              objectFit: 'cover',
              borderBottom: '1px solid #333'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#d4af37',
            color: 'black',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            fontWeight: '600',
            fontSize: '0.875rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            Spécial
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#d4af37'
          }}>
            {specialsData[activeSpecial].name}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#ccc',
            marginBottom: '1rem',
            minHeight: '3rem'
          }}>
            {specialsData[activeSpecial].description}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#d4af37',
              padding: '0.5rem 1.5rem',
              border: '1px solid #d4af37',
              borderRadius: '2rem',
              backgroundColor: 'rgba(212, 175, 55, 0.1)'
            }}>
              {specialsData[activeSpecial].price}
            </span>
          </div>
        </div>

        {/* Navigation buttons */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '1rem',
          transform: 'translateY(-50%)',
          zIndex: 10
        }}>
          <motion.button
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </motion.button>
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '1rem',
          transform: 'translateY(-50%)',
          zIndex: 10
        }}>
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </motion.button>
        </div>

        {/* Dots indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0 1rem'
        }}>
          {specialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSpecial(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activeSpecial === index ? '#d4af37' : '#333',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialsSection;
