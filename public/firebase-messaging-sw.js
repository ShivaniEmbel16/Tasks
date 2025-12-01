// Service Worker for Firebase Cloud Messaging
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "AIzaSyAQld_pv6WBJ2gIEQyyqrG2ZN9Lo6qiSy8",
  authDomain: "notificationtask-1501c.firebaseapp.com",
  projectId: "notificationtask-1501c",
  storageBucket: "notificationtask-1501c.firebasestorage.app",
  messagingSenderId: "521531867488",
  appId: "1:521531867488:web:a4fcb238095336ab455e05",
  measurementId: "G-NVYWSVWMCH"
};

// Initialize Firebase in the service worker
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: payload.notification?.icon || "/vite.svg",
    badge: "/vite.svg",
    tag: payload.data?.tag || "notification",
    requireInteraction: false,
    data: payload.data || {}
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
