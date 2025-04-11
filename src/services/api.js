import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/jobs';


console.log(`API URL: ${API_URL}`); // Debugging line to check the API URL  
// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch jobs with optional filtering and pagination
 */
export const fetchJobs = async ({ 
  page = 1, 
  limit = 10, 
  status = null, 
  startDate = null, 
  endDate = null 
}) => {
  try {
    // Build query parameters
    const params = { page, limit };
    if (status) params.status = status;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get('/', { params });
    
    return {
      data: response.data.data,
      totalJobs: response.data.totalJobs,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get a single job by ID
 */
export const fetchJobById = async (id) => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new job
 */
export const createJob = async (jobData) => {
  try {
    const response = await apiClient.post('/', jobData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update an existing job
 * Using PATCH as it allows partial updates without overwriting unspecified fields
 */
export const updateJob = async (id, updates) => {
  try {
    const response = await apiClient.patch(`/${id}`, updates);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a job by ID
 */
export const deleteJob = async (id) => {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create multiple jobs in bulk
 */
export const bulkCreateJobs = async (jobsArray) => {
  try {
    const response = await apiClient.post('/bulk', { jobs: jobsArray });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Advanced filtering for jobs
 */
export const filterJobs = async (filterOptions) => {
  try {
    const response = await apiClient.post('/filter', filterOptions);
    return {
      data: response.data.data,
      totalJobs: response.data.totalJobs,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get job statistics
 */
export const getJobStats = async () => {
  try {
    const response = await apiClient.get('/stats');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Helper function to handle API errors
 */
const handleApiError = (error) => {
  if (error.response) {
    // The server responded with a status code outside the 2xx range
    return new Error(error.response.data.message || 'An error occurred with the API');
  } else if (error.request) {
    // The request was made but no response was received
    return new Error('No response received from server. Please check your network connection.');
  } else {
    // Something happened in setting up the request
    return new Error('Error setting up request: ' + error.message);
  }
};

export default {
  fetchJobs,
  fetchJobById,
  createJob,
  updateJob,
  deleteJob,
  bulkCreateJobs,
  filterJobs,
  getJobStats
};