import React, { useState, useEffect } from 'react';
import {
  FaRecycle,
  FaWeightHanging,
  FaMapMarkerAlt,
  FaCamera,
  FaNotesMedical,
  FaInfoCircle,
  FaCheckCircle,
  FaTrash,
  FaSpinner,
  FaLocationArrow,
  FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const plasticTypes = [
  { value: 'PET', label: 'PET (Plastic #1)', description: 'Water bottles, soda bottles', points: 10, color: 'blue' },
  { value: 'HDPE', label: 'HDPE (Plastic #2)', description: 'Milk jugs, detergent bottles', points: 8, color: 'green' },
  { value: 'PVC', label: 'PVC (Plastic #3)', description: 'Pipes, window frames', points: 6, color: 'red' },
  { value: 'LDPE', label: 'LDPE (Plastic #4)', description: 'Shopping bags, food wraps', points: 5, color: 'yellow' },
  { value: 'PP', label: 'PP (Plastic #5)', description: 'Yogurt containers, straws', points: 7, color: 'purple' },
  { value: 'PS', label: 'PS (Plastic #6)', description: 'Styrofoam, disposable cups', points: 4, color: 'pink' },
  { value: 'OTHER', label: 'Other Plastics', description: 'Mixed or unidentified plastics', points: 2, color: 'gray' },
];

const units = [
  { value: 'kg', label: 'Kilograms (kg)', conversion: 1 },
  { value: 'g', label: 'Grams (g)', conversion: 0.001 },
  { value: 'lbs', label: 'Pounds (lbs)', conversion: 0.453592 },
];

const ContributionForm = ({ 
  onSubmit, 
  initialData = null,
  isEditing = false,
  onCancel,
  showPreview = true 
}) => {
  const [formData, setFormData] = useState({
    plasticType: initialData?.plasticType || '',
    quantity: initialData?.quantity || '',
    unit: initialData?.unit || 'kg',
    collectionPoint: initialData?.collectionPoint || '',
    notes: initialData?.notes || '',
    location: initialData?.location || null,
  });

  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [touched, setTouched] = useState({});

  // Calculate points whenever plastic type or quantity changes
  useEffect(() => {
    if (formData.plasticType && formData.quantity) {
      const type = plasticTypes.find(t => t.value === formData.plasticType);
      const quantityInKg = convertToKg(
        parseFloat(formData.quantity), 
        formData.unit
      );
      const points = type?.points * quantityInKg || 0;
      setCalculatedPoints(points);
    } else {
      setCalculatedPoints(0);
    }
  }, [formData.plasticType, formData.quantity, formData.unit]);

  const convertToKg = (quantity, unit) => {
    const unitConfig = units.find(u => u.value === unit);
    return quantity * (unitConfig?.conversion || 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'plasticType':
        if (!value) error = 'Please select a plastic type';
        break;
      case 'quantity':
        if (!value) error = 'Please enter the quantity';
        else if (parseFloat(value) <= 0) error = 'Quantity must be greater than 0';
        else if (parseFloat(value) > 1000) error = 'Quantity cannot exceed 1000 kg';
        break;
      case 'collectionPoint':
        if (value && value.length > 100) error = 'Collection point cannot exceed 100 characters';
        break;
      case 'notes':
        if (value && value.length > 500) error = 'Notes cannot exceed 500 characters';
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.plasticType) {
      newErrors.plasticType = 'Please select a plastic type';
      isValid = false;
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Please enter the quantity';
      isValid = false;
    } else if (parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
      isValid = false;
    } else if (parseFloat(formData.quantity) > 1000) {
      newErrors.quantity = 'Quantity cannot exceed 1000 kg';
      isValid = false;
    }

    if (formData.collectionPoint && formData.collectionPoint.length > 100) {
      newErrors.collectionPoint = 'Collection point cannot exceed 100 characters';
      isValid = false;
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Check total images limit
    if (validFiles.length + images.length > 5) {
      toast.error('You can only upload up to 5 images total');
      return;
    }

    setUploadingImages(true);

    try {
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
          });
          reader.onerror = reject;
        });
      });

      const newImages = await Promise.all(imagePromises);
      setImages(prev => [...prev, ...newImages]);
      toast.success(`${validFiles.length} image(s) added`);
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Failed to process images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    setImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    toast.loading('Getting your location...', { id: 'location' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          },
        }));
        toast.success('Location captured successfully!', { id: 'location' });
        setGettingLocation(false);
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
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const quantityInKg = convertToKg(
        parseFloat(formData.quantity), 
        formData.unit
      );

      const submissionData = {
        ...formData,
        quantity: quantityInKg,
        originalQuantity: {
          value: parseFloat(formData.quantity),
          unit: formData.unit
        },
        images: images.map(img => img.preview), // Base64 images
        points: calculatedPoints
      };

      await onSubmit(submissionData);
      
      // Clean up object URLs
      images.forEach(img => {
        if (img.preview?.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  const getPlasticTypeColor = (type) => {
    const colors = {
      PET: 'blue',
      HDPE: 'green',
      PVC: 'red',
      LDPE: 'yellow',
      PP: 'purple',
      PS: 'pink',
      OTHER: 'gray'
    };
    return colors[type] || 'gray';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preview Card - Shows estimated points */}
      {showPreview && calculatedPoints > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-${getPlasticTypeColor(formData.plasticType)}-50 border border-${getPlasticTypeColor(formData.plasticType)}-200 rounded-lg p-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-${getPlasticTypeColor(formData.plasticType)}-600 text-sm font-medium`}>
                Estimated Points
              </p>
              <p className={`text-3xl font-bold text-${getPlasticTypeColor(formData.plasticType)}-700`}>
                {calculatedPoints.toFixed(2)}
              </p>
              <p className={`text-xs text-${getPlasticTypeColor(formData.plasticType)}-500 mt-1`}>
                Based on {formData.quantity} {formData.unit} of {formData.plasticType}
              </p>
            </div>
            <div className={`bg-${getPlasticTypeColor(formData.plasticType)}-100 p-3 rounded-full`}>
              <FaRecycle className={`text-${getPlasticTypeColor(formData.plasticType)}-600 text-2xl`} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Plastic Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Plastic Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {plasticTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, plasticType: type.value }));
                validateField('plasticType', type.value);
              }}
              className={`
                p-3 rounded-lg border-2 transition-all text-left
                ${formData.plasticType === type.value 
                  ? `border-${type.color}-500 bg-${type.color}-50` 
                  : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className={`text-${type.color}-600 font-medium text-sm mb-1`}>
                {type.label}
              </div>
              <div className="text-xs text-gray-500">
                {type.points} pts/kg
              </div>
            </button>
          ))}
        </div>
        {touched.plasticType && errors.plasticType && (
          <p className="text-sm text-red-600 mt-1">{errors.plasticType}</p>
        )}
      </div>

      {/* Quantity Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Quantity <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              step="0.1"
              min="0.1"
              max="1000"
              className={`input-field ${errors.quantity ? 'border-red-500' : ''}`}
              placeholder="Enter quantity"
            />
          </div>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-24 input-field"
          >
            {units.map(unit => (
              <option key={unit.value} value={unit.value}>
                {unit.value}
              </option>
            ))}
          </select>
        </div>
        {touched.quantity && errors.quantity && (
          <p className="text-sm text-red-600">{errors.quantity}</p>
        )}
      </div>

      {/* Collection Point */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Collection Point
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FaMapMarkerAlt className="text-gray-400" />
          </div>
          <input
            type="text"
            name="collectionPoint"
            value={formData.collectionPoint}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field pl-10"
            placeholder="Where did you collect this plastic?"
          />
        </div>
        {touched.collectionPoint && errors.collectionPoint && (
          <p className="text-sm text-red-600">{errors.collectionPoint}</p>
        )}
      </div>

      {/* Location Capture */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Location (Optional)
        </label>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={getLocation}
            disabled={gettingLocation}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            {gettingLocation ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaLocationArrow />
            )}
            <span>{gettingLocation ? 'Getting location...' : 'Capture Current Location'}</span>
          </button>
          {formData.location && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, location: null }))}
              className="text-red-500 hover:text-red-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
        {formData.location && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2 bg-green-50 rounded-lg text-sm"
          >
            <div className="flex items-center text-green-600 mb-1">
              <FaCheckCircle className="mr-2" />
              <span className="font-medium">Location Captured</span>
            </div>
            <p className="text-xs text-green-700">
              Coordinates: {formData.location.coordinates[1].toFixed(6)}, {formData.location.coordinates[0].toFixed(6)}
              {formData.location.accuracy && ` (Accuracy: ±${formData.location.accuracy.toFixed(1)}m)`}
            </p>
          </motion.div>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
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
            <p className="text-sm text-gray-600">{images.length}/5 photos</p>
            <p className="text-xs text-gray-400 mt-1">Max 5MB per image</p>
          </div>
        </div>

        {/* Image Previews */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {(image.size / 1024).toFixed(1)} KB
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
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
            onBlur={handleBlur}
            rows="4"
            className="input-field pl-10"
            placeholder="Any additional information about this contribution..."
          />
        </div>
        <div className="flex justify-between">
          {touched.notes && errors.notes ? (
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
          <li>Contributions are verified within 24-48 hours</li>
          <li>Points are awarded after verification</li>
        </ul>
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || uploadingImages}
          className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>{isEditing ? 'Updating...' : 'Submitting...'}</span>
            </>
          ) : (
            <>
              <FaRecycle />
              <span>{isEditing ? 'Update Contribution' : 'Submit Contribution'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContributionForm;