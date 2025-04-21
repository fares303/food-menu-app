import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminPage from './pages/AdminPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
