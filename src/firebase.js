// src/firebase.js
import { initializeApp } from 'firebase/app'
import {
	getMessaging,
	getToken,
	onMessage,
	isSupported,
} from 'firebase/messaging'
import { getAnalytics } from 'firebase/analytics'

// Firebase config
const firebaseConfig = {
	apiKey: 'AIzaSyAQld_pv6WBJ2gIEQyyqrG2ZN9Lo6qiSy8',
	authDomain: 'notificationtask-1501c.firebaseapp.com',
	projectId: 'notificationtask-1501c',
	storageBucket: 'notificationtask-1501c.firebasestorage.app',
	messagingSenderId: '521531867488',
	appId: '1:521531867488:web:a4fcb238095336ab455e05',
	measurementId: 'G-NVYWSVWMCH',
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

let messaging = null
isSupported().then((supported) => {
	if (supported) {
		messaging = getMessaging(app)
	}
})

// Crashlytics-like error logging utility
export const logError = (error, context = {}) => {
	const errorInfo = {
		message: error?.message || String(error),
		stack: error?.stack,
		context,
		timestamp: new Date().toISOString(),
	}

	// Log to console
	console.error('Error logged:', errorInfo)
	try {
		const errors = JSON.parse(localStorage.getItem('firebase_errors') || '[]')
		errors.push(errorInfo)
		if (errors.length > 10) errors.shift()
		localStorage.setItem('firebase_errors', JSON.stringify(errors))
	} catch (e) {
		console.error('Failed to store error:', e)
	}
}

// Register service worker for background notifications
export const registerServiceWorker = async () => {
	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register(
				'/firebase-messaging-sw.js',
				{
					scope: '/',
				}
			)
			console.log('Service Worker registered successfully:', registration)
			return registration
		} catch (err) {
			console.error('Service Worker registration failed:', err)
			logError(err, { function: 'registerServiceWorker' })
			return null
		}
	} else {
		console.warn('Service Workers are not supported in this browser.')
		return null
	}
}

// Request FCM token
export const requestForToken = async () => {
	try {
		if ('serviceWorker' in navigator) {
			try {
				const registration = await navigator.serviceWorker.ready
				console.log('Service Worker ready:', registration)
			} catch (err) {
				await registerServiceWorker()
				await navigator.serviceWorker.ready
			}
		}

		if (!messaging) {
			const supported = await isSupported()
			if (!supported) {
				console.warn(
					'Firebase Cloud Messaging is not supported in this browser.'
				)
				return null
			}
			messaging = getMessaging(app)
		}

		const serviceWorkerRegistration =
			'serviceWorker' in navigator ? await navigator.serviceWorker.ready : null

		const currentToken = await getToken(messaging, {
			vapidKey: 'DXv_w_X91PZE0XqHQ7xzPZcfTWIgFCFL1j_6DRhlHpc',
			...(serviceWorkerRegistration && { serviceWorkerRegistration }),
		})

		if (currentToken) {
			console.log('FCM Token:', currentToken)
			return currentToken
		} else {
			console.log(
				'No registration token available. Request permission to generate one.'
			)
			return null
		}
	} catch (err) {
		console.error('Error retrieving FCM token:', err)
		logError(err, { function: 'requestForToken' })
		return null
	}
}

// Request notification permission
export const requestNotificationPermission = async () => {
	try {
		if (!('Notification' in window)) {
			console.warn('This browser does not support notifications.')
			return false
		}

		const permission = await Notification.requestPermission()
		if (permission === 'granted') {
			console.log('Notification permission granted.')
			return true
		} else {
			console.log('Notification permission denied.')
			return false
		}
	} catch (err) {
		console.error('Error requesting notification permission:', err)
		logError(err, { function: 'requestNotificationPermission' })
		return false
	}
}

// Listen for foreground messages
export const setupMessageListener = (callback) => {
	if (!messaging) {
		isSupported().then((supported) => {
			if (supported) {
				messaging = getMessaging(app)
				onMessage(messaging, (payload) => {
					if (callback) callback(payload)
				})
			}
		})
	} else {
		onMessage(messaging, (payload) => {
			if (callback) callback(payload)
		})
	}
}

// Legacy support - returns a promise for one-time use
export const onMessageListener = () =>
	new Promise((resolve) => {
		setupMessageListener(resolve)
	})

// Test notification function
export const sendTestNotification = async () => {
	try {
		if ('Notification' in window && Notification.permission === 'granted') {
			new Notification('Test Notification', {
				body: 'This is a test notification from Firebase FCM!',
				icon: '/vite.svg',
				badge: '/vite.svg',
			})
		} else {
			console.warn('Notification permission not granted')
		}
	} catch (err) {
		console.error('Error sending test notification:', err)
		logError(err, { function: 'sendTestNotification' })
	}
}

export { analytics, app }
