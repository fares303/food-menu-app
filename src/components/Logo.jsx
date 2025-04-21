import { motion } from 'framer-motion';

const Logo = ({ size = 200 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        width: size,
        height: size * 0.8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="logo-container"
    >
      <div style={{
        backgroundColor: '#000',
        padding: '15px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}>
        <div style={{
          borderBottom: '1px solid #d4af37',
          borderTop: '1px solid #d4af37',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 0'
        }}>
          {/* Cloche/Dome Icon */}
          <div style={{ marginBottom: '5px' }}>
            <svg width={size * 0.4} height={size * 0.25} viewBox="0 0 100 60" fill="none">
              <circle cx="50" cy="10" r="3" stroke="#d4af37" strokeWidth="1.5" />
              <path d="M50 13 L50 20" stroke="#d4af37" strokeWidth="1.5" />
              <path d="M20 50 C20 30 35 20 50 20 C65 20 80 30 80 50" stroke="#d4af37" strokeWidth="1.5" fill="none" />
              <line x1="15" y1="50" x2="85" y2="50" stroke="#d4af37" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Restaurant Text */}
          <div style={{
            fontSize: size * 0.08,
            color: '#d4af37',
            fontFamily: 'serif',
            letterSpacing: '2px',
            marginBottom: '5px'
          }}>
            RESTAURANT
          </div>

          {/* Casa Nova Text */}
          <div style={{
            fontSize: size * 0.18,
            color: 'white',
            fontWeight: 'bold',
            letterSpacing: '3px',
            marginBottom: '5px'
          }}>
            CASA NOVA
          </div>

          {/* Stars */}
          <div style={{ color: '#d4af37', letterSpacing: '3px' }}>
            ★★★★★
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Logo;
