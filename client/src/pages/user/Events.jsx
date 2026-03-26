import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTicketAlt, FaSpinner, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Mock data - replace with real API
      setEvents([
        {
          id: 1,
          title: 'Community Recycling Drive',
          description: 'Bring your recyclable plastics to the community center',
          date: '2024-04-15T09:00:00',
          location: 'Lusaka Community Center',
          capacity: 200,
          registered: 45,
          imageUrl: '/event1.jpg'
        },
        {
          id: 2,
          title: 'Plastic Waste Workshop',
          description: 'Learn how to upcycle plastic waste into useful items',
          date: '2024-04-20T14:00:00',
          location: 'Green Hub, Lusaka',
          capacity: 50,
          registered: 32,
          imageUrl: '/event2.jpg'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    setRegistering(true);
    try {
      // Replace with actual API call
      await fetch(`/api/events/${eventId}/register`, { method: 'POST' });
      toast.success('Successfully registered for event!');
      fetchEvents(); // Refresh events
      setSelectedEvent(null);
    } catch (error) {
      toast.error('Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCalendarAlt className="text-primary-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Upcoming Events</h1>
          <p className="text-gray-600">Join us in making a difference</p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gray-200">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaCalendarAlt className="text-4xl text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <p className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-2" />
                    {format(new Date(event.date), 'EEEE, MMMM dd, yyyy • h:mm a')}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-2" />
                    {event.location}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    <FaUsers className="mr-2" />
                    {event.registered} / {event.capacity} registered
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    disabled={event.registered >= event.capacity}
                    className={`ml-4 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      event.registered >= event.capacity
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {event.registered >= event.capacity ? 'Full' : 'Register'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Register Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Register for Event</h2>
              <p className="text-gray-600 mb-4">
                You're registering for <strong>{selectedEvent.title}</strong>
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-500">Event Details:</p>
                <p className="text-sm text-gray-700">{format(new Date(selectedEvent.date), 'EEEE, MMMM dd, yyyy • h:mm a')}</p>
                <p className="text-sm text-gray-700">{selectedEvent.location}</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRegister(selectedEvent.id)}
                  disabled={registering}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {registering ? <FaSpinner className="animate-spin" /> : <FaTicketAlt />}
                  <span>{registering ? 'Registering...' : 'Confirm Registration'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
            <p className="text-gray-500">Check back later for exciting events!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;