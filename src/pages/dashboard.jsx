import { useState } from "react";
import { JobFormModal, Pagination, JobCard } from "../components";
import { useJobs } from "../hooks/useJobs";
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FilterComponent } from "../components";

const Dashboard = () => {
  const {
    jobs,
    loading,
    pagination,
    createJob,
    updateJob,
    deleteJob,
    setPage,
    filterJobs,
  } = useJobs();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    company: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    // Only include filled filters
    const filledFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim() !== "")
    );

    setActiveFilters(filledFilters);

    // Call API with filters
    filterJobs({
      page: 1, // Reset to page 1 when filtering
      limit: pagination.limit,
      filters: filledFilters,
    });
  };

  const clearFilters = () => {
    setFilters({
      company: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    setActiveFilters({});
    filterJobs({ page: 1, limit: pagination.limit, filters: {} });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => value !== ""
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <div className="flex space-x-2">
          {/* <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition flex items-center"
          >
            <FiFilter className="mr-2" />
            Filter
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-primary-500 rounded-full"></span>
            )}
          </button> */}
          <button
            onClick={() => {
              setEditingJob(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add Job
          </button>
        </div>
      </div>

      {/* Minimalist Filter Panel */}
      <AnimatePresence>
        {/* {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={filters.company}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any company"
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
                  onChange={handleFilterChange}
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
                  onChange={handleFilterChange}
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
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-primary-600"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )} */}

        <FilterComponent
          onApplyFilters={(filledFilters) => {
            setActiveFilters(filledFilters);
            filterJobs({
              page: 1,
              limit: pagination.limit,
              filters: filledFilters,
            });
          }}
        />
      </AnimatePresence>

      {loading && !jobs.length ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <p className="text-gray-600 mb-2">No job applications found.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-primary-500 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={(job) => {
                  setEditingJob(job);
                  setIsFormOpen(true);
                }}
                onDelete={deleteJob}
              />
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total}
            onPageChange={setPage}
          />
        </>
      )}

      <JobFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={
          editingJob ? (data) => updateJob(editingJob._id, data) : createJob
        }
        onDelete={deleteJob}
        initialData={editingJob}
      />
    </div>
  );
};

export default Dashboard;
