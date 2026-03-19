import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import {
  FaRecycle,
  FaWeightHanging,
  FaMapMarkerAlt,
  FaCamera,
  FaNotesMedical,
  FaArrowLeft,
  FaInfoCircle,
  FaCheckCircle,
  FaTrash,
  FaSpinner,
  FaCloudUploadAlt,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const plasticTypes = [
  { value: 'PET', label: 'PET (Plastic #1)', description: 'Water bottles, soda bottles', points: 10 },
  { value: 'HDPE', label: 'HDPE (Plastic #2)', description: 'Milk jugs, detergent bottles', points: 8 },
  { value: 'PVC', label: 'PVC (Plastic #3)', description: 'Pipes, window frames', points: 6 },
  { value: 'LDPE', label: 'LDPE (Plastic #4)', description: 'Shopping bags, food wraps', points: 5 },
  { value: 'PP', label: 'PP (Plastic #5)', description: 'Yogurt containers, straws', points: 7 },
  { value: 'PS', label: 'PS (Plastic #6)', description: 'Styrofoam, disposable cups', points: 4 },
  { value: 'OTHER', label: 'Other Plastics', description: 'Mixed or unidentified plastics', points: 2 },
];

const SubmitContribution = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    plasticType: '',
    quantity: '',
    unit: 'kg',
    collectionPoint: '',
    notes: '',
    location: null,
  });
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Calculate points when plastic type or quantity changes
      if (name === 'plasticType' || name === 'quantity') {
        if (newData.plasticType && newData.quantity) {
          const type = plasticTypes.find(t => t.value === newData.plasticType);
          const points = type?.points * parseFloat(newData.quantity) || 0;
          setCalculatedPoints(points);
        }
      }
      
      return newData;
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = [];
    const errors = [];

    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image file`);
        continue;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} exceeds 5MB limit`);
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length === 0) return;

    // Check total images limit
    if (validFiles.length + images.length > 5) {
      toast.error('You can only upload up to 5 images total');
      return;
    }

    setUploadingImages(true);

    try {
      // Convert images to base64 for preview and storage
      const imagePromises = validFiles.map(async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve({
            file,
            preview: reader.result,
            name: file.name,
            size: file.size,
            type: file.type,
            uploading: false,
            uploaded: false
          });
          reader.onerror = error => reject(error);
        });
      });

      const newImages = await Promise.all(imagePromises);
      setImages(prev => [...prev, ...newImages]);
      
      toast.success(`${validFiles.length} image(s) added successfully`);
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Failed to process images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...', { id: 'location' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude],
            },
          }));
          toast.success('Location captured successfully!', { id: 'location' });
        },
        (error) => {
          let errorMessage = 'Could not get your location.';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          toast.error(errorMessage, { id: 'location' });
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.plasticType) {
      newErrors.plasticType = 'Please select a plastic type';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Please enter the quantity';
    } else if (parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (parseFloat(formData.quantity) > 1000) {
      newErrors.quantity = 'Quantity cannot exceed 1000 kg';
    }

    if (formData.collectionPoint && formData.collectionPoint.length > 100) {
      newErrors.collectionPoint = 'Collection point cannot exceed 100 characters';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare contribution data
      const contributionData = {
        plasticType: formData.plasticType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        collectionPoint: formData.collectionPoint,
        notes: formData.notes,
        location: formData.location,
      };

      // Create the contribution first
      const response = await userService.createContribution(contributionData);
      
      if (response.success) {
        const contributionId = response.data._id;

        // Upload images if any
        if (images.length > 0) {
          setUploadingImages(true);
          
          // Prepare FormData for image upload
          const imageFormData = new FormData();
          images.forEach((image, index) => {
            imageFormData.append('images', image.file);
          });

          // Upload images to the specific contribution
          const uploadResponse = await userService.uploadContributionImages(contributionId, imageFormData);
          
          if (uploadResponse.success) {
            toast.success(`${uploadResponse.data.count} image(s) uploaded successfully`);
          } else {
            toast.warning('Contribution created but images failed to upload');
          }
        }

        toast.success('Contribution submitted successfully!');
        
        // Clean up object URLs
        images.forEach(image => {
          if (image.preview && image.preview.startsWith('blob:')) {
            URL.revokeObjectURL(image.preview);
          }
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting contribution:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 413) {
        toast.error('Images too large. Please reduce image sizes.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit contribution');
      }
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
          disabled={loading}
        >
          <FaArrowLeft className="mr-2" /> Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaRecycle className="text-primary-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Submit Contribution</h1>
          <p className="text-gray-600">
            Log your plastic collection and earn points. Every contribution helps make a difference!
          </p>
        </motion.div>

        {/* Points Calculator Preview */}
        {calculatedPoints > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg p-6 mb-8 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-1">Estimated Points</p>
                <p className="text-4xl font-bold">{calculatedPoints.toFixed(2)}</p>
              </div>
              <FaCheckCircle className="text-5xl text-white opacity-50" />
            </div>
            <p className="text-sm text-primary-100 mt-2">
              Final points may vary based on verification
            </p>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plastic Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plastic Type <span className="text-red-500">*</span>
              </label>
              <select
                name="plasticType"
                value={formData.plasticType}
                onChange={handleChange}
                disabled={loading}
                className={`input-field ${errors.plasticType ? 'border-red-500' : ''}`}
              >
                <option value="">Select plastic type</option>
                {plasticTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.points} points/kg
                  </option>
                ))}
              </select>
              {errors.plasticType && (
                <p className="mt-1 text-sm text-red-600">{errors.plasticType}</p>
              )}
              {formData.plasticType && (
                <p className="mt-1 text-sm text-gray-500">
                  {plasticTypes.find(t => t.value === formData.plasticType)?.description}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    disabled={loading}
                    className={`input-field ${errors.quantity ? 'border-red-500' : ''}`}
                  />
                </div>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-24 input-field"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            {/* Collection Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Point
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="collectionPoint"
                  value={formData.collectionPoint}
                  onChange={handleChange}
                  placeholder="Where did you collect this plastic?"
                  disabled={loading}
                  className="input-field pl-10"
                />
              </div>
              {errors.collectionPoint && (
                <p className="mt-1 text-sm text-red-600">{errors.collectionPoint}</p>
              )}
            </div>

            {/* Location Capture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <button
                type="button"
                onClick={getLocation}
                disabled={loading}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 disabled:opacity-50"
              >
                <FaMapMarkerAlt />
                <span>Capture Current Location</span>
              </button>
              {formData.location && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <FaCheckCircle className="mr-1" /> 
                  Location captured: {formData.location.coordinates[1].toFixed(4)}, {formData.location.coordinates[0].toFixed(4)}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional - Max 5)
              </label>
              <div className="flex items-center space-x-4">
                <label className={`
                  cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg p-4 transition-colors
                  ${(images.length >= 5 || loading || uploadingImages) ? 'opacity-50 cursor-not-allowed' : ''}
                `}>
                  {uploadingImages ? (
                    <FaSpinner className="text-2xl text-gray-600 mx-auto mb-2 animate-spin" />
                  ) : (
                    <FaCamera className="text-2xl text-gray-600 mx-auto mb-2" />
                  )}
                  <span className="text-sm text-gray-600">
                    {uploadingImages ? 'Processing...' : 'Upload Photos'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={images.length >= 5 || loading || uploadingImages}
                    className="hidden"
                  />
                </label>
                <div>
                  <p className="text-sm text-gray-500">
                    {images.length}/5 images selected
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max 5MB per image • JPG, PNG, GIF
                  </p>
                </div>
              </div>

              {/* Image Previews */}
              <AnimatePresence>
                {images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4"
                  >
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Image overlay with delete button */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            disabled={loading}
                            className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>

                        {/* Image info */}
                        <div className="absolute bottom-1 left-1 right-1">
                          <p className="text-xs bg-black bg-opacity-50 text-white px-1 py-0.5 rounded truncate">
                            {(image.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <FaNotesMedical className="text-gray-400" />
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any additional information about this contribution..."
                  disabled={loading}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex justify-between mt-1">
                {errors.notes ? (
                  <p className="text-sm text-red-600">{errors.notes}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    <FaInfoCircle className="inline mr-1" />
                    Include details like condition, cleanliness, etc.
                  </p>
                )}
                <span className="text-sm text-gray-400">
                  {formData.notes.length}/500
                </span>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <FaInfoCircle className="mr-2" /> Submission Guidelines
              </h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Ensure plastics are clean and dry for accurate weighing</li>
                <li>Separate different types of plastics if possible</li>
                <li>Photos help speed up the verification process</li>
                <li>Maximum 5 photos, 5MB each</li>
                <li>Contributions are verified within 24-48 hours</li>
                <li>Points are awarded after verification</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : uploadingImages ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Uploading Images...</span>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt />
                  <span>Submit Contribution</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitContribution;