import React, { useState } from 'react'; // Remove useEffect if not used
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkIcon, Trash2, Clock, Search, Calendar, ArrowUpDown } from 'lucide-react';

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export function HistoryPage() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('qr-scan-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.result.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' 
        ? true 
        : filterType === 'url' 
          ? item.isUrl 
          : !item.isUrl;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      return sortOrder === 'desc' 
        ? b.timestamp - a.timestamp 
        : a.timestamp - b.timestamp;
    });

  const clearHistory = () => {
    setHistory([]);
    localStorage.setItem('qr-scan-history', JSON.stringify([]));
  };

  const deleteItem = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('qr-scan-history', JSON.stringify(newHistory));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-600" />
            Scan History
          </h1>
          {history.length > 0 && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={clearHistory}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </motion.button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search scans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="url">URLs Only</option>
              <option value="text">Text Only</option>
            </select>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
              className="px-4 py-2 border rounded-lg"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {filteredHistory.length > 0 ? (
            <motion.div className="space-y-4">
              {filteredHistory.map((item) => (
                <motion.div
                  key={item.id}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {item.isUrl ? (
                        <a href={item.result} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          <LinkIcon className="w-4 h-4 mr-2" />
                          {item.result}
                        </a>
                      ) : (
                        <p className="text-gray-700">{item.result}</p>
                      )}
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => deleteItem(item.id)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
              {history.length === 0 ? "No scan history yet." : "No results found."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
