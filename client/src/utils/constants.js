// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    VERIFY_EMAIL: '/users/verify-email',
    FORGOT_PASSWORD: '/users/forgot-password',
    RESET_PASSWORD: '/users/reset-password',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CONTRIBUTIONS: '/users/contributions',
    INCENTIVES: '/users/incentives',
    STATISTICS: '/users/statistics',
  },
  CONTRIBUTIONS: {
    BASE: '/contributions',
    STATISTICS: '/contributions/statistics',
    UPLOAD_IMAGES: (id) => `/contributions/${id}/images`,
    DELETE_IMAGE: (id, imageId) => `/contributions/${id}/images/${imageId}`,
    UPDATE_STATUS: (id) => `/contributions/${id}/status`,
  },
  INCENTIVES: {
    BASE: '/incentives',
    STATISTICS: '/incentives/statistics',
    REDEEM: (id) => `/incentives/${id}/redeem`,
  },
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER: (id) => `/admin/users/${id}`,
    CREATE_ADMIN: '/admin/create',
  },
  REPORTS: {
    BASE: '/reports',
    TEMPLATES: '/reports/templates',
    DOWNLOAD: (id) => `/reports/${id}/download`,
    SCHEDULE: '/reports/schedule',
    SCHEDULED: '/reports/scheduled',
    EXPORT: '/reports/export',
    COMPARE: '/reports/compare',
    SHARE: (id) => `/reports/${id}/share`,
    STATISTICS: '/reports/statistics',
  },
};

// Plastic Types
export const PLASTIC_TYPES = [
  { 
    id: 'PET', 
    label: 'PET (Polyethylene Terephthalate)', 
    code: '#1', 
    points: 10,
    examples: ['Water bottles', 'Soda bottles', 'Food containers'],
    recyclable: true,
    color: 'blue',
    description: 'Commonly used for beverage bottles. Highly recyclable.'
  },
  { 
    id: 'HDPE', 
    label: 'HDPE (High-Density Polyethylene)', 
    code: '#2', 
    points: 8,
    examples: ['Milk jugs', 'Detergent bottles', 'Shopping bags'],
    recyclable: true,
    color: 'green',
    description: 'Sturdy plastic used for containers. Widely recycled.'
  },
  { 
    id: 'PVC', 
    label: 'PVC (Polyvinyl Chloride)', 
    code: '#3', 
    points: 6,
    examples: ['Pipes', 'Window frames', 'Cable insulation'],
    recyclable: false,
    color: 'red',
    description: 'Rigid plastic used in construction. Limited recyclability.'
  },
  { 
    id: 'LDPE', 
    label: 'LDPE (Low-Density Polyethylene)', 
    code: '#4', 
    points: 5,
    examples: ['Shopping bags', 'Food wraps', 'Squeezable bottles'],
    recyclable: true,
    color: 'yellow',
    description: 'Flexible plastic. Recyclable at specialized facilities.'
  },
  { 
    id: 'PP', 
    label: 'PP (Polypropylene)', 
    code: '#5', 
    points: 7,
    examples: ['Yogurt containers', 'Straws', 'Bottle caps'],
    recyclable: true,
    color: 'purple',
    description: 'Heat-resistant plastic. Increasingly recyclable.'
  },
  { 
    id: 'PS', 
    label: 'PS (Polystyrene)', 
    code: '#6', 
    points: 4,
    examples: ['Styrofoam', 'Disposable cups', 'Take-out containers'],
    recyclable: false,
    color: 'pink',
    description: 'Foam plastic. Difficult to recycle.'
  },
  { 
    id: 'OTHER', 
    label: 'Other Plastics', 
    code: '#7', 
    points: 2,
    examples: ['Mixed plastics', 'Multi-layer packaging', 'Biodegradables'],
    recyclable: false,
    color: 'gray',
    description: 'Mixed or unidentified plastics. Limited recycling options.'
  },
];

// Reward Tiers
export const REWARD_TIERS = {
  BRONZE: {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 99,
    multiplier: 1.0,
    color: 'amber',
    benefits: ['Basic rewards', 'Standard points'],
    icon: 'medal-bronze',
  },
  SILVER: {
    name: 'Silver',
    minPoints: 100,
    maxPoints: 499,
    multiplier: 1.2,
    color: 'gray',
    benefits: ['Bonus points (20%)', 'Priority support'],
    icon: 'medal-silver',
  },
  GOLD: {
    name: 'Gold',
    minPoints: 500,
    maxPoints: 999,
    multiplier: 1.5,
    color: 'yellow',
    benefits: ['Bonus points (50%)', 'Exclusive offers', 'Monthly rewards'],
    icon: 'medal-gold',
  },
  PLATINUM: {
    name: 'Platinum',
    minPoints: 1000,
    maxPoints: Infinity,
    multiplier: 2.0,
    color: 'purple',
    benefits: ['Double points', 'Free collection', 'Annual bonus', 'VIP events'],
    icon: 'medal-platinum',
  },
};

// Contribution Status
export const CONTRIBUTION_STATUS = {
  PENDING: {
    value: 'pending',
    label: 'Pending',
    color: 'yellow',
    icon: 'clock',
    description: 'Awaiting verification',
  },
  APPROVED: {
    value: 'approved',
    label: 'Approved',
    color: 'green',
    icon: 'check-circle',
    description: 'Verified and approved',
  },
  REJECTED: {
    value: 'rejected',
    label: 'Rejected',
    color: 'red',
    icon: 'times-circle',
    description: 'Rejected by admin',
  },
  PROCESSED: {
    value: 'processed',
    label: 'Processed',
    color: 'blue',
    icon: 'cog',
    description: 'Processed for recycling',
  },
};

// Incentive Status
export const INCENTIVE_STATUS = {
  PENDING: {
    value: 'PENDING',
    label: 'Pending',
    color: 'yellow',
    icon: 'clock',
    description: 'Awaiting approval',
  },
  AWARDED: {
    value: 'AWARDED',
    label: 'Awarded',
    color: 'green',
    icon: 'gift',
    description: 'Ready to redeem',
  },
  REDEEMED: {
    value: 'REDEEMED',
    label: 'Redeemed',
    color: 'blue',
    icon: 'check-double',
    description: 'Successfully redeemed',
  },
  EXPIRED: {
    value: 'EXPIRED',
    label: 'Expired',
    color: 'red',
    icon: 'exclamation',
    description: 'Past expiry date',
  },
  CANCELLED: {
    value: 'CANCELLED',
    label: 'Cancelled',
    color: 'gray',
    icon: 'ban',
    description: 'Cancelled',
  },
};

// Units of Measurement
export const UNITS = [
  { value: 'kg', label: 'Kilograms', symbol: 'kg', conversion: 1 },
  { value: 'g', label: 'Grams', symbol: 'g', conversion: 0.001 },
  { value: 'lbs', label: 'Pounds', symbol: 'lb', conversion: 0.453592 },
  { value: 'oz', label: 'Ounces', symbol: 'oz', conversion: 0.0283495 },
];

// Time Periods
export const TIME_PERIODS = [
  { value: 'day', label: 'Today', days: 1 },
  { value: 'week', label: 'This Week', days: 7 },
  { value: 'month', label: 'This Month', days: 30 },
  { value: 'quarter', label: 'This Quarter', days: 90 },
  { value: 'year', label: 'This Year', days: 365 },
  { value: 'all', label: 'All Time', days: null },
];

// Chart Colors
export const CHART_COLORS = [
  '#0ea5e9', // primary blue
  '#8b5cf6', // purple
  '#10b981', // green
  '#f59e0b', // orange
  '#ef4444', // red
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f97316', // orange
  '#6b7280', // gray
];

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PRIMARY_COLOR: 'primaryColor',
  FONT_SIZE: 'fontSize',
  REMEMBERED_EMAIL: 'rememberedEmail',
  LANGUAGE: 'language',
  NOTIFICATIONS: 'notifications',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  DEFAULT: 'An error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Successfully logged out.',
  CONTRIBUTION_SUBMITTED: 'Contribution submitted successfully!',
  CONTRIBUTION_APPROVED: 'Contribution approved!',
  CONTRIBUTION_REJECTED: 'Contribution rejected.',
  PROFILE_UPDATED: 'Profile updated successfully!',
  INCENTIVE_REDEEMED: 'Incentive redeemed successfully!',
  REPORT_GENERATED: 'Report generated successfully!',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [10, 20, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  FILE: 'yyyy-MM-dd-HHmmss',
  MONTH_YEAR: 'MMMM yyyy',
  YEAR: 'yyyy',
};

// Validation Rules
export const VALIDATION_RULES = {
  NAME: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s-']+$/,
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    min: 6,
    pattern: /^(?=.*[A-Za-z])(?=.*\d)/,
  },
  PHONE: {
    pattern: /^[0-9+\-\s()]+$/,
  },
  QUANTITY: {
    min: 0.1,
    max: 1000,
  },
  NOTES: {
    max: 500,
  },
};