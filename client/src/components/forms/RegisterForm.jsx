import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterForm = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const passwordRequirements = [
    { label: 'At least 6 characters', test: (pwd) => pwd.length >= 6 },
    { label: 'Contains at least one letter', test: (pwd) => /[A-Za-z]/.test(pwd) },
    { label: 'Contains at least one number', test: (pwd) => /\d/.test(pwd) },
  ];

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const failedRequirements = passwordRequirements.filter(req => !req.test(formData.password));
      if (failedRequirements.length > 0) {
        newErrors.password = 'Password does not meet all requirements';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please provide a valid phone number';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleNext = () => {
    let newErrors = {};
    
    if (step === 1) {
      newErrors = validateStep1();
    } else if (step === 2) {
      newErrors = validateStep2();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateStep3();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, acceptTerms, ...userData } = formData;
      const result = await register(userData);

      if (result.success) {
        if (onSuccess) {
          onSuccess(result.data);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
      
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FaUser className="text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="John Doe"
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FaEnvelope className="text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Security</h3>
      
      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="mt-2 space-y-1">
          {passwordRequirements.map((req, index) => {
            const met = req.test(formData.password);
            return (
              <div key={index} className="flex items-center space-x-2 text-xs">
                {met ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-gray-300" />
                )}
                <span className={met ? 'text-green-600' : 'text-gray-400'}>
                  {req.label}
                </span>
              </div>
            );
          })}
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Additional Information</h3>
      
      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FaPhone className="text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field pl-10"
            placeholder="+260 97 000 0000"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Address Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3">
            <FaMapMarkerAlt className="text-gray-400" />
          </div>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="input-field pl-10"
            placeholder="Your address"
          />
        </div>
      </div>

      {/* Terms Acceptance */}
      <div>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-600">
            I accept the{' '}
            <a href="/terms" className="text-primary-600 hover:underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              s <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 ${
                s < step ? 'bg-primary-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        {step > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="flex-1 btn-outline"
            disabled={loading}
          >
            Previous
          </button>
        )}
        
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 btn-primary"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default RegisterForm;