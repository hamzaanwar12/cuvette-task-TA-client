import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

const FilterComponent = ({ onApplyFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    company: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Only include non-empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim() !== '')
    );
    
    // Apply filters (sending back to parent component)
    onApplyFilters(activeFilters);
  };

  const clearFilters = () => {
    setFilters({
      company: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    onApplyFilters({});
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value.trim() !== '');

  return (
    <div className="mb-6 border border-gray-200 rounded-lg shadow-sm">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FiFilter className="mr-2 text-gray-600" />
          <h3 className="font-medium text-gray-900">
            Filter Jobs
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                Active
              </span>
            )}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown />
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-4 pt-0 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={filters.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Filter by company"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center px-3 py-2 text-sm cursor-pointer text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FiX className="mr-1" /> Clear
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Filters
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FilterComponent;