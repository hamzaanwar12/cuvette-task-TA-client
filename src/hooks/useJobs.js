import { useState, useEffect } from 'react';
import { fetchJobs, createJob, updateJob, deleteJob, filterJobs } from '../services/api';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [activeFilters, setActiveFilters] = useState({});
  
  const fetchData = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      
      let result;
      
      // If we have active filters, use the filter endpoint
      if (Object.keys(activeFilters).length > 0) {
        const filterOptions = {
          page,
          limit,
          filters: { ...activeFilters }
        };
        
        result = await filterJobs(filterOptions);
      } else {
        // Otherwise use the standard fetch endpoint
        result = await fetchJobs({ page, limit });
      }
      
      const { data, totalJobs, totalPages } = result;
      
      setJobs(data);
      setPagination({
        page,
        limit,
        total: totalPages,
        totalItems: totalJobs
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refetch when pagination changes or filters change
  useEffect(() => {
    fetchData(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, activeFilters]);

  const applyFilters = (filters) => {
    // Reset to page 1 when applying new filters
    setPagination(prev => ({ ...prev, page: 1 }));
    setActiveFilters(filters);
  };

  const handleCreate = async (jobData) => {
    await createJob(jobData);
    fetchData(pagination.page, pagination.limit);
  };

  const handleUpdate = async (id, updates) => {
    await updateJob(id, updates);
    fetchData(pagination.page, pagination.limit);
  };

  const handleDelete = async (id) => {
    await deleteJob(id);
    // If last item on page, go to previous page
    if (jobs.length === 1 && pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchData(pagination.page, pagination.limit);
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  return {
    jobs,
    loading,
    error,
    pagination,
    activeFilters,
    fetchData,
    createJob: handleCreate,
    updateJob: handleUpdate,
    deleteJob: handleDelete,
    applyFilters,
    clearFilters,
    setPage: (page) => setPagination(prev => ({ ...prev, page })),
  };
};