import { VALIDATION_RULES } from './constants';

// Email validation
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION_RULES.EMAIL.pattern.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  if (!password) return false;
  if (password.length < VALIDATION_RULES.PASSWORD.min) return false;
  return VALIDATION_RULES.PASSWORD.pattern.test(password);
};

// Name validation
export const isValidName = (name) => {
  if (!name) return false;
  if (name.length < VALIDATION_RULES.NAME.min) return false;
  if (name.length > VALIDATION_RULES.NAME.max) return false;
  return VALIDATION_RULES.NAME.pattern.test(name);
};

// Phone validation
export const isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  return VALIDATION_RULES.PHONE.pattern.test(phone);
};

// Quantity validation
export const isValidQuantity = (quantity) => {
  const num = parseFloat(quantity);
  if (isNaN(num)) return false;
  if (num < VALIDATION_RULES.QUANTITY.min) return false;
  if (num > VALIDATION_RULES.QUANTITY.max) return false;
  return true;
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Date validation
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Future date validation
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

// Past date validation
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

// Number range validation
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

// String length validation
export const hasValidLength = (str, min, max) => {
  if (!str && min > 0) return false;
  if (str && min !== undefined && str.length < min) return false;
  if (str && max !== undefined && str.length > max) return false;
  return true;
};

// File validation
export const isValidFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  } = options;

  if (!file) return false;
  if (file.size > maxSize) return false;
  if (!allowedTypes.includes(file.type)) return false;
  return true;
};

// Password match validation
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) return false;
  
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

// Zambian NRC validation
export const isValidNRC = (nrc) => {
  const cleaned = nrc.replace(/\s/g, '');
  const pattern = /^\d{6}\/\d{2}\/\d$/;
  return pattern.test(cleaned);
};

// Zambian phone number validation
export const isValidZambianPhone = (phone) => {
  const cleaned = phone.replace(/\s+/g, '').replace(/^\+260/, '0');
  const pattern = /^0(97|95|96|76|77|78|79)\d{7}$/;
  return pattern.test(cleaned);
};

// Strong password validation
export const isStrongPassword = (password) => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  const passedChecks = Object.values(checks).filter(Boolean).length;
  return {
    isValid: passedChecks >= 4, // At least 4 out of 5 checks must pass
    checks,
    strength: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passedChecks],
  };
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    // Required validation
    if (fieldRules.required && !value) {
      errors[field] = fieldRules.required.message || `${field} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !fieldRules.required) return;
    
    // Min length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength.value) {
      errors[field] = fieldRules.minLength.message || 
        `${field} must be at least ${fieldRules.minLength.value} characters`;
    }
    
    // Max length validation
    if (fieldRules.maxLength && value.length > fieldRules.maxLength.value) {
      errors[field] = fieldRules.maxLength.message || 
        `${field} cannot exceed ${fieldRules.maxLength.value} characters`;
    }
    
    // Pattern validation
    if (fieldRules.pattern && !fieldRules.pattern.value.test(value)) {
      errors[field] = fieldRules.pattern.message || `${field} is invalid`;
    }
    
    // Custom validation
    if (fieldRules.validate) {
      const customError = fieldRules.validate(value, values);
      if (customError) errors[field] = customError;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate email domain
export const isValidEmailDomain = (email, allowedDomains = []) => {
  if (!isValidEmail(email)) return false;
  if (allowedDomains.length === 0) return true;
  
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
};