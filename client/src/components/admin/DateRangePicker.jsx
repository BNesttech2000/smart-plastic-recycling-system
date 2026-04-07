// client/src/components/admin/DateRangePicker.jsx
import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ onRangeChange, onApply }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [preset, setPreset] = useState('month');
  
  const presets = {
    week: { label: 'Last 7 Days', days: 7 },
    month: { label: 'Last 30 Days', days: 30 },
    quarter: { label: 'Last 90 Days', days: 90 },
    year: { label: 'Last Year', days: 365 }
  };
  
  const handlePreset = (key) => {
    setPreset(key);
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - presets[key].days);
    setStartDate(start);
    setEndDate(end);
    if (onRangeChange) {
      onRangeChange({ start, end, preset: key });
    }
    if (onApply) {
      onApply({ start, end, preset: key });
    }
  };
  
  const handleApply = () => {
    if (startDate && endDate && onApply) {
      onApply({ start: startDate, end: endDate, preset: 'custom' });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
        </div>
        
        <div className="flex space-x-2">
          {Object.keys(presets).map(key => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                preset === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {presets[key].label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">to</span>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;