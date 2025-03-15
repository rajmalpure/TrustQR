import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QRScanner } from './components/QRScanner';
import { HistoryPage } from './pages/HistoryPage';
import { History, Home } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

function Layout() {
  const location = useLocation();

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="app-title">TrustQR</div>

          {/* Navigation Links (Left Side) */}
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <Home className="nav-icon" />
              Home
            </Link>
            <Link to="/history" className="nav-link">
              <History className="nav-icon" />
              History
            </Link>
          </div>

          {/* App Name (Right Side) */}
        </div>
      </nav>

      <div className="content-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<QRScanner />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
