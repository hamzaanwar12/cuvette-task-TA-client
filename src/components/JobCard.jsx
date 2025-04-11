import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiExternalLink, FiEdit2, FiTrash2 } from 'react-icons/fi';

const JobCard = ({ job, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Status color mapping
  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-purple-100 text-purple-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start space-x-3">
        {/* Company Avatar (Minimalist) */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            {job.company.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {job.company}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[job.status]}`}>
              {job.status}
            </span>
          </div>
          
          <p className="text-gray-600 truncate">{job.role}</p>
          
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>
              Applied: {new Date(job.appliedDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Animated Action Buttons */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          height: isHovered ? 'auto' : 0
        }}
        className="mt-3 flex space-x-2 overflow-hidden"
      >
        {job.jobLink && (
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
          >
            <FiExternalLink className="mr-1" /> Link
          </a>
        )}
        <button
          onClick={() => onEdit(job)}
          className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
        >
          <FiEdit2 className="mr-1" /> Edit
        </button>
        <button
          onClick={() => onDelete(job._id)}
          className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          <FiTrash2 className="mr-1" /> Delete
        </button>
      </motion.div>
    </motion.div>
  );
};

export default JobCard;