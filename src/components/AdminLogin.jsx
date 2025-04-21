import { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn } from '../services/supabaseService';
import { useMenu } from '../context/MenuContext';

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { isOnline } = useMenu();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isOnline) {
        // Fallback for offline mode - use demo credentials
        if (username === 'admin' && password === 'casanova2025') {
          onLoginSuccess();
        } else {
          setError('Nom d\'utilisateur ou mot de passe incorrect');
        }
      } else {
        // Use Supabase authentication
        const { user, error } = await signIn(username, password);

        if (error) {
          setError('Erreur d\'authentification: ' + error.message);
        } else if (user) {
          onLoginSuccess();
        } else {
          setError('Nom d\'utilisateur ou mot de passe incorrect');
        }
      }
    } catch (err) {
      setError('Erreur de connexion: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.95) 100%)',
        backdropFilter: 'blur(10px)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="rounded-lg shadow-xl p-8 w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        style={{
          backgroundColor: '#111',
          border: '1px solid #333',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.3)',
          borderRadius: '12px',
          borderTop: '3px solid #d4af37',
          borderBottom: '3px solid #d4af37'
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div style={{
              color: '#d4af37',
              fontSize: '28px',
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: '2px',
              textShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
              marginBottom: '8px'
            }}>
              CASA NOVA
            </div>
            <div style={{
              color: '#d4af37',
              fontSize: '16px',
              textAlign: 'center',
              letterSpacing: '3px',
              textTransform: 'uppercase'
            }}>
              Administration
            </div>
          </motion.div>

          <div className="flex justify-between items-center w-full mb-6">
            <h2 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '500',
              borderLeft: '2px solid #d4af37',
              paddingLeft: '10px'
            }}>
              Connexion Sécurisée
            </h2>
            <button
              onClick={onCancel}
              style={{
                color: '#d4af37',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '5px 10px',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Fermer
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-2" style={{ color: '#d4af37' }} htmlFor="username">
              Nom d'utilisateur
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  paddingLeft: '40px',
                  backgroundColor: '#222',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </motion.div>

          <motion.div
            className="mb-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-2" style={{ color: '#d4af37' }} htmlFor="password">
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  paddingLeft: '40px',
                  backgroundColor: '#222',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: '#d4af37',
                color: 'black',
                fontWeight: '600',
                padding: '12px 30px',
                borderRadius: '30px',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
              disabled={isLoading}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#e9c349';
                e.target.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#d4af37';
                e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }}>
                    <style>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                    <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.25)" strokeWidth="4" fill="none" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="black" strokeWidth="4" fill="none" />
                  </svg>
                  Connexion...
                </div>
              ) : 'Se connecter'}
            </button>
          </motion.div>

          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#999',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '5px 10px',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#d4af37'}
              onMouseOut={(e) => e.target.style.color = '#999'}
              disabled={isLoading}
            >
              Retour au menu
            </button>
          </motion.div>
        </form>

        <motion.div
          className="mt-8 text-xs text-center"
          style={{
            color: '#666',
            padding: '10px',
            borderTop: '1px solid #333',
            marginTop: '20px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.7 }}
        >
          
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;
