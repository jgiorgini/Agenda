// Service Worker - Agenda Dr. Julio
const CACHE_NAME = 'agenda-julio-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(clientList => {
    for (const client of clientList) {
      if ('focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow('/');
  }));
});

// Check for due reminders every minute
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_CHECK') {
    const tasks = e.data.tasks || [];
    const now = Date.now();
    tasks.forEach(task => {
      if (!task.done && task.dueDate) {
        const due = new Date(task.dueDate).getTime();
        const diff = due - now;
        if (diff > 0 && diff < 60000) {
          setTimeout(() => {
            self.registration.showNotification('📋 Recordatorio', {
              body: task.text,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              tag: task.id,
              requireInteraction: true,
              vibrate: [200, 100, 200]
            });
          }, diff);
        }
      }
    });
  }
});
