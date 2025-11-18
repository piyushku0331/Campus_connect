import React, { useState, useEffect } from 'react';
import { Check, X, Calendar, User, MapPin } from 'lucide-react';
import { adminAPI } from '../../services/api';
import BaseCard from './BaseCard';
import VisionButton from '../ui/VisionButton';
import toast, { Toaster } from 'react-hot-toast';

const EventManagement = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const response = await adminAPI.getPendingEvents();
      const eventsData = response.data.events || [];
      setPendingEvents(eventsData);
    } catch (err) {
      console.error('Failed to fetch pending events:', err);
      setPendingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await adminAPI.approveEvent(eventId);
      setPendingEvents(pendingEvents.filter(event => event._id !== eventId));
      toast.success('Event approved successfully');
    } catch (err) {
      console.error('Failed to approve event:', err);
      toast.error('Failed to approve event');
    }
  };

  const handleReject = async (eventId) => {
    try {
      await adminAPI.rejectEvent(eventId);
      setPendingEvents(pendingEvents.filter(event => event._id !== eventId));
      toast.success('Event rejected successfully');
    } catch (err) {
      console.error('Failed to reject event:', err);
      toast.error('Failed to reject event');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Events</h2>
        <div className="text-[#0CEBFF] animate-pulse">Loading pending events...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Pending Events</h2>
      <div className="space-y-4">
        {pendingEvents.length === 0 ? (
          <BaseCard className="text-center py-12">
            <p className="text-gray-300 text-lg">No pending events to review</p>
            <p className="text-gray-400 text-sm mt-2">New event submissions will appear here for approval.</p>
          </BaseCard>
        ) : (
          <div className="grid gap-4">
            {pendingEvents.map((event) => (
              <BaseCard key={event._id} className="transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-3 drop-shadow-[0_0_8px_rgba(0,217,255,0.3)]">{event.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-200">
                      <User className="w-4 h-4 text-[#8B5CF6]" />
                      <span>{event.organizer?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                      <MapPin className="w-4 h-4 text-[#FF3CF0]" />
                      <span>{event.campus || event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                      <Calendar className="w-4 h-4 text-[#00F59B]" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-200 mb-4">
                  <p className="line-clamp-3">{event.description}</p>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-linear-to-r from-[#8B5CF6]/20 to-[#FF3CF0]/20 text-[#06E1FF] rounded-full text-xs font-medium border border-[#8B5CF6]/30">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <VisionButton
                    variant="success"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleApprove(event._id)}
                  >
                    <Check className="w-4 h-4" /> Approve
                  </VisionButton>
                  <VisionButton
                    variant="danger"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleReject(event._id)}
                  >
                    <X className="w-4 h-4" /> Reject
                  </VisionButton>
                </div>
              </BaseCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;