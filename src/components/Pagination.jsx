import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        Previous
      </motion.button>
      
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const page = currentPage <= 3 ? i + 1 : 
                    currentPage >= totalPages - 2 ? totalPages - 4 + i : 
                    currentPage - 2 + i;
        
        return page > 0 && page <= totalPages && (
          <motion.button
            key={page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-primary-500 text-white' : 'border'}`}
          >
            {page}
          </motion.button>
        );
      })}
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border disabled:opacity-[0.9]"
      >
        Next
      </motion.button>
    </div>
  );
};

export default Pagination;