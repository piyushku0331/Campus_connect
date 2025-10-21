import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, Users, MessageCircle, Star, CheckCircle, X, Clock } from 'lucide-react';
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'event',
        title: 'New Event: Welcome Week Orientation',
        message: 'A new event has been created that might interest you.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), 
        read: false,
        icon: Calendar,
        gradient: 'from-[#6B9FFF] to-[#7F40FF]'
      },
      {
        id: 2,
        type: 'connection',
        title: 'Connection Request Accepted',
        message: 'Alice Johnson accepted your connection request.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), 
        read: false,
        icon: Users,
        gradient: 'from-[#FF7F50] to-[#FF4500]'
      },
      {
        id: 3,
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        message: 'Congratulations! You earned the "First Steps" badge.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), 
        read: true,
        icon: Star,
        gradient: 'from-[#00CED1] to-[#6B9FFF]'
      },
      {
        id: 4,
        type: 'message',
        title: 'New Message from Bob Smith',
        message: 'Hey! Want to study together for the upcoming exam?',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
        read: true,
        icon: MessageCircle,
        gradient: 'from-[#7F40FF] to-[#FF7F50]'
      },
      {
        id: 5,
        type: 'event',
        title: 'Event Reminder: Tech Talk',
        message: "Don't forget about the AI Tech Talk tomorrow at 2 PM.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
        read: true,
        icon: Clock,
        gradient: 'from-[#FF4500] to-[#7F40FF]'
      }
    ];
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <div className="min-h-screen pt-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-accent-gradient">
              Notifications
            </h1>
            <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto mb-8">
              Stay updated with your latest activities and campus happenings.
            </p>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-accent-gradient text-white font-medium px-6 py-3 rounded-full hover:shadow-[0_0_30px_#6B9FFF]/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <CheckCircle className="w-5 h-5" />
                Mark All as Read ({unreadCount})
              </button>
            )}
          </motion.div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-textMuted mt-4">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-gradient-to-br from-surface to-[#1A1A2A] border border-borderSubtle rounded-2xl p-6 hover:shadow-glow-primary transition-all duration-300 ${
                    !notification.read ? 'border-primary/40 shadow-[0_0_20px_rgba(107,159,255,0.2)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${notification.gradient} shadow-lg flex-shrink-0`}>
                      <notification.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold mb-1 ${
                            notification.read ? 'text-textPrimary' : 'text-primary'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-textMuted text-sm leading-relaxed mb-2">
                            {notification.message}
                          </p>
                          <p className="text-textMuted text-xs">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-textMuted hover:text-red-400 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="mt-3 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-textMuted mx-auto mb-4" />
              <p className="text-textMuted text-lg">No notifications yet.</p>
              <p className="text-textMuted text-sm">We&rsquo;ll notify you when there&rsquo;s something new!</p>
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  );
};
export default Notifications;
