import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  requestForToken, 
  setupMessageListener, 
  requestNotificationPermission,
  sendTestNotification,
  logError 
} from "../firebase";

function Task5() {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState(Notification.permission || "default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Request notification permission and token on mount
    const initializeNotifications = async () => {
      try {
        setIsLoading(true);
        
        // Request permission first
        const hasPermission = await requestNotificationPermission();
        setPermission(Notification.permission);
        
        if (hasPermission) {
          // Request FCM token
          const fcmToken = await requestForToken();
          setToken(fcmToken);
          
          if (fcmToken) {
            toast.success("Notifications initialized successfully!");
          }
        } else {
          toast.warn("Notification permission denied. Please enable notifications in your browser settings.");
        }
      } catch (err) {
        console.error("Error initializing notifications:", err);
        logError(err, { function: "initializeNotifications" });
        toast.error("Failed to initialize notifications");
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();

    // Set up foreground message listener
    setupMessageListener((payload) => {
      if (payload) {
        const title = payload.notification?.title || "New Notification";
        const body = payload.notification?.body || "You have a new message";
        
        toast.info(`${title}: ${body}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    });
  }, []);

  const handleTestNotification = async () => {
    try {
      setIsLoading(true);
      
      if (permission !== "granted") {
        const hasPermission = await requestNotificationPermission();
        setPermission(Notification.permission);
        
        if (!hasPermission) {
          toast.error("Please grant notification permission to test notifications");
          setIsLoading(false);
          return;
        }
      }

      // Send test notification
      await sendTestNotification();
      toast.success("Test notification sent!");
    } catch (err) {
      console.error("Error sending test notification:", err);
      logError(err, { function: "handleTestNotification" });
      toast.error("Failed to send test notification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestError = () => {
    try {
      // Simulate an error for Crashlytics testing
      throw new Error("Test error for Crashlytics logging");
    } catch (err) {
      logError(err, { 
        function: "handleTestError",
        test: true,
        userAction: "Test Error Button Clicked"
      });
      toast.info("Test error logged to Crashlytics (check console and localStorage)");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Firebase Notifications & Crashlytics
        </h1>
        {/* <p className="text-gray-600 mb-8">
          Real-time push notifications with Firebase Cloud Messaging and error logging
        </p> */}

        {/* <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Notification Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Permission Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                permission === "granted" 
                  ? "bg-green-100 text-green-800" 
                  : permission === "denied"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {permission.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">FCM Token:</span>
              <span className="text-sm text-gray-600 font-mono break-all">
                {token ? token.substring(0, 30) + "..." : "Not available"}
              </span>
            </div>

            {token && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Full Token (for testing):</p>
                <p className="text-xs font-mono text-gray-800 break-all bg-white p-2 rounded">
                  {token}
                </p>
              </div>
            )}
          </div>
        </div> */}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Test Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleTestNotification}
              disabled={isLoading || permission === "denied"}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Loading..." : "Send Test Notification"}
            </button>

            <button
              onClick={handleTestError}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Test Error Logging (Crashlytics)
            </button>
          </div>
{/* 
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> To receive push notifications from a server, use the FCM token above. 
              Background notifications are handled by the service worker automatically.
            </p>
          </div> */}
        </div>
{/* 
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">How It Works</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Foreground Notifications:</strong> Displayed as toast notifications when app is active</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Background Notifications:</strong> Handled by service worker (firebase-messaging-sw.js)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Crashlytics:</strong> Errors are logged and can be viewed in console/localStorage</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>FCM Token:</strong> Use this token to send notifications from your backend server</span>
            </li>
          </ul>
        </div> */}
      </div>

      <ToastContainer 
        position="top-right" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Task5;
