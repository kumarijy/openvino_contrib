/**
 * RequestModelModal component - Modal form for creating Jira model enablement requests
 */

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface RequestModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  requesterName: string;
  requesterEmail: string;
  requesterUsername: string; // Jira username
  modelName: string;
  modelFormat: string;
  modelLink: string;
  targetHW: string;
  additionalRequirements: string;
  customerInfo: string;
}

const INITIAL_FORM_DATA: FormData = {
  requesterName: '',
  requesterEmail: '',
  requesterUsername: '',
  modelName: '',
  modelFormat: '',
  modelLink: '',
  targetHW: 'CPU',
  additionalRequirements: '',
  customerInfo: '',
};

export const RequestModelModal: React.FC<RequestModelModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-populate user info from Windows environment on mount
  React.useEffect(() => {
    if (isOpen && !formData.requesterName && !formData.requesterEmail) {
      const username = window.navigator.userAgent.match(/Windows NT.*?\)/)?.[0] || '';
      // Try to get username from environment (works on Intel network)
      fetch('/api/user-info')
        .then(res => res.json())
        .then(data => {
          if (data.name || data.email || data.username) {
            setFormData(prev => ({
              ...prev,
              requesterName: data.name || prev.requesterName,
              requesterEmail: data.email || prev.requesterEmail,
              requesterUsername: data.username || prev.requesterUsername, // Windows username for Jira
            }));
          }
        })
        .catch(() => {
          // Silently fail - user can enter manually
        });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateTitle = () => {
    return formData.modelName ? `[Enable] "${formData.modelName}" model` : '[Enable] "Model name" model';
  };

  const generateDescription = () => {
    return `Requested by: ${formData.requesterName} (${formData.requesterEmail})
Request Date: ${new Date().toISOString().split('T')[0]}

Model Format (PyTorch, ONNX, other): ${formData.modelFormat || '[USER INPUT]'}
Model link (HuggingFace, GitHub, other): ${formData.modelLink || '[USER INPUT]'}
Target HW platform (CPU (default), GPU, NPU): ${formData.targetHW || 'CPU'}
Additional requirements (Performance, Latency, precision, ETA, other): ${formData.additionalRequirements || '[USER INPUT]'}
Additional Customer info (Design win, deal size, date to intercept): ${formData.customerInfo || '[USER INPUT]'}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Build Jira URL with pre-filled fields
      // CVS project ID: 26939
      const jiraBaseUrl = 'https://jira.devtools.intel.com/secure/CreateIssueDetails!init.jspa';

      const params = new URLSearchParams({
        pid: '26939', // CVS project ID (correct)
        issuetype: '21', // Requirement issue type (correct ID)
        summary: generateTitle(),
        description: generateDescription(),
        components: '168914', // Model Enabling component ID
        labels: 'model', // Labels
        priority: '3', // P3-Medium (priority ID)
        customfield_40905: '225908', // Regions of Interest Defined - Enable Model (correct ID)
        reporter: formData.requesterUsername || 'kumarijy', // Jira username from Windows environment
        customfield_11609: 'According to statuses (Inferred, Validated, Optimized): https://wiki.ith.intel.com/display/CVSDK/Models+flow', // Acceptance Criteria
      });

      const jiraUrl = `${jiraBaseUrl}?${params.toString()}`;

      // Open Jira in new tab with pre-filled form
      window.open(jiraUrl, '_blank');

      setSuccess(true);

      // Show success message and close modal
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request Model Enablement</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✓ Opening Jira with pre-filled information! Please review and click "Create" in the Jira tab.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-medium">Error: {error}</p>
              </div>
            )}

            {/* Requester Information Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requester Name */}
                <div>
                  <label htmlFor="requesterName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="requesterName"
                    name="requesterName"
                    required
                    value={formData.requesterName}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Requester Email */}
                <div>
                  <label htmlFor="requesterEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="requesterEmail"
                    name="requesterEmail"
                    required
                    value={formData.requesterEmail}
                    onChange={handleInputChange}
                    placeholder="e.g., john.doe@intel.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Model Information Section */}
            <div className="pt-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Model Details</h3>
            </div>

            {/* Model Name */}
            <div>
              <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="modelName"
                name="modelName"
                required
                value={formData.modelName}
                onChange={handleInputChange}
                placeholder="e.g., Llama-3-8B, BERT-base, ResNet-50"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Issue title will be: <span className="font-mono">{generateTitle()}</span>
              </p>
            </div>

            {/* Model Format */}
            <div>
              <label htmlFor="modelFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model Format <span className="text-red-500">*</span>
              </label>
              <select
                id="modelFormat"
                name="modelFormat"
                required
                value={formData.modelFormat}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select format</option>
                <option value="PyTorch">PyTorch</option>
                <option value="ONNX">ONNX</option>
                <option value="TensorFlow">TensorFlow</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Model Link */}
            <div>
              <label htmlFor="modelLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model Link <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="modelLink"
                name="modelLink"
                required
                value={formData.modelLink}
                onChange={handleInputChange}
                placeholder="e.g., https://huggingface.co/... or 'restricted - access needed'"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter a URL (HuggingFace, GitHub, etc.) or description if access is restricted
              </p>
            </div>

            {/* Target HW Platform */}
            <div>
              <label htmlFor="targetHW" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target HW Platform <span className="text-red-500">*</span>
              </label>
              <select
                id="targetHW"
                name="targetHW"
                required
                value={formData.targetHW}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="CPU">CPU (default)</option>
                <option value="GPU">GPU</option>
                <option value="NPU">NPU</option>
              </select>
            </div>

            {/* Additional Requirements */}
            <div>
              <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Requirements
              </label>
              <textarea
                id="additionalRequirements"
                name="additionalRequirements"
                rows={3}
                value={formData.additionalRequirements}
                onChange={handleInputChange}
                placeholder="Performance, Latency, precision, ETA, other..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Additional Customer Info */}
            <div>
              <label htmlFor="customerInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Customer Info
              </label>
              <textarea
                id="customerInfo"
                name="customerInfo"
                rows={3}
                value={formData.customerInfo}
                onChange={handleInputChange}
                placeholder="Design win, deal size, date to intercept..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Opening Jira...' : 'Open in Jira'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
