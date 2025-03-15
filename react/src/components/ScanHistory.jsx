import { motion } from 'framer-motion';
import { Clock, Link as LinkIcon, Trash2 } from 'lucide-react';

export function ScanHistory({ history, onClearHistory }) {
  if (history.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full"
    >
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Scan History
        </h3>
        <button
          onClick={onClearHistory}
          className="text-red-600 hover:text-red-700 flex items-center text-sm font-medium px-3 py-1 rounded-md transition-all duration-200 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear History
        </button>
      </div>
      <div className="space-y-3">
        {history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            {item.isUrl ? (
              <a
                href={item.result}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-700 hover:text-blue-800 break-all font-medium transition-all duration-200"
              >
                <LinkIcon className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
                {item.result}
              </a>
            ) : (
              <p className="text-gray-800 break-all">{item.result}</p>
            )}
            <p className="text-xs text-gray-500 mt-2 italic">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}  