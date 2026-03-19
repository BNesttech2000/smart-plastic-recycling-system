import { useState, useEffect, useCallback } from 'react';

export const useForm = (initialValues = {}, validationRules = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [isValid, setIsValid] = useState(false);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    if (validationRules[name]) {
      const fieldRules = validationRules[name];
      let error = '';

      // Required validation
      if (fieldRules.required && (!value || value.toString().trim() === '')) {
        error = fieldRules.required.message || `${name} is required`;
      }
      // Min length validation
      else if (fieldRules.minLength && value?.length < fieldRules.minLength.value) {
        error = fieldRules.minLength.message || 
          `${name} must be at least ${fieldRules.minLength.value} characters`;
      }
      // Max length validation
      else if (fieldRules.maxLength && value?.length > fieldRules.maxLength.value) {
        error = fieldRules.maxLength.message || 
          `${name} cannot exceed ${fieldRules.maxLength.value} characters`;
      }
      // Pattern validation
      else if (fieldRules.pattern && !fieldRules.pattern.value.test(value)) {
        error = fieldRules.pattern.message || `${name} is invalid`;
      }
      // Custom validation
      else if (fieldRules.validate) {
        const customError = fieldRules.validate(value, values);
        if (customError) error = customError;
      }

      return error;
    }
    return '';
  }, [validationRules, values]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return { isValid: formIsValid, errors: newErrors };
  }, [values, validationRules, validateField]);

  // Handle field change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue = value;

    // Handle different input types
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      newValue = files;
    } else if (type === 'number') {
      newValue = value === '' ? '' : Number(value);
    }

    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setSubmitCount(prev => prev + 1);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationRules).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const { isValid, errors } = validateForm();

    if (isValid && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors(prev => ({
          ...prev,
          form: error.message || 'Form submission failed'
        }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Reset form
  const resetForm = (newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Set field value programmatically
  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Set field error programmatically
  const setFieldError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Check if field has error
  const hasError = (name) => {
    return touched[name] && Boolean(errors[name]);
  };

  // Get field error
  const getFieldError = (name) => {
    return touched[name] ? errors[name] : '';
  };

  // Re-run validation when values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (submitCount > 0) {
        validateForm();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [values, submitCount, validateForm]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    hasError,
    getFieldError,
    setValues,
  };
};