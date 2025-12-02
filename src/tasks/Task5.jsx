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
        const hasPermission = await requestNotificationPermission();
        setPermission(Notification.permission);
        
        if (hasPermission) {
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

        </div>

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
