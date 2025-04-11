import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTrash2 } from "react-icons/fi";

const JobFormModal = ({ isOpen, onClose, onSubmit, onDelete, initialData }) => {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    jobLink: "",
    appliedDate: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset form when initialData changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Format date for date input if it exists
        const formattedData = {
          ...initialData,
          appliedDate: initialData.appliedDate
            ? new Date(initialData.appliedDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        };
        setFormData(formattedData);
      } else {
        // Reset to defaults for new job
        setFormData({
          company: "",
          role: "",
          status: "Applied",
          jobLink: "",
          appliedDate: new Date().toISOString().split("T")[0],
        });
      }
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // In JobFormModal.jsx, modify the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // This is where the issue is - we need to make sure the job ID is preserved when updating
      const dataToSubmit = initialData?._id
        ? { ...formData, _id: initialData._id }
        : formData;

      await onSubmit(dataToSubmit);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save job application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(initialData._id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete job application");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Status options
  const statusOptions = ["Applied", "Interview", "Offer", "Rejected"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#847f7f2e] bg-opacity-50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            {/* Conditionally render delete confirmation or main form */}
            {showDeleteConfirm ? (
              <div className="p-4">
                <h2 className="text-xl font-medium text-gray-900 mb-3">
                  Confirm Deletion
                </h2>
                <p className="mb-4 text-gray-600">
                  Are you sure you want to delete this job application for{" "}
                  {formData.company}? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </motion.button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-xl font-medium text-gray-900">
                    {initialData
                      ? "Edit Job Application"
                      : "Add New Job Application"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Company*
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Role*
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="jobLink"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Job Link
                      </label>
                      <input
                        type="url"
                        id="jobLink"
                        name="jobLink"
                        value={formData.jobLink}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="appliedDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Applied Date
                      </label>
                      <input
                        type="date"
                        id="appliedDate"
                        name="appliedDate"
                        value={formData.appliedDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    {initialData && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center px-3 py-2 text-sm cursor-pointer text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    )}

                    <div className="flex space-x-3 ml-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2  cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {isSubmitting
                          ? "Saving..."
                          : initialData
                          ? "Update"
                          : "Create"}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JobFormModal;
