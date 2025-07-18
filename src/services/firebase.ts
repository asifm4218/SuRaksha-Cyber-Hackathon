
"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";
import type { Analytics, EventParams } from "firebase/analytics";

// IMPORTANT: Add your Firebase project configuration here.
// You can find this in your Firebase project settings.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

let analytics: Analytics | undefined;
let isInitialized = false;

function initializeFirebase() {
  if (typeof window !== "undefined" && !isInitialized) {
    if (getApps().length === 0) {
      const app = initializeApp(firebaseConfig);
      // Only initialize Analytics if the config is not a placeholder
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        analytics = getAnalytics(app);
      }
      isInitialized = true;
    }
  }
}

// Call initialization
initializeFirebase();

/**
 * Logs a custom event to Firebase Analytics.
 * @param eventName The name of the event to log.
 * @param eventParams Optional parameters to associate with the event.
 */
export function logFirebaseEvent(eventName: string, eventParams?: EventParams) {
  if (!analytics) {
    console.log(`Firebase Analytics not initialized. Event not logged: ${eventName}`, eventParams);
    return;
  }
  logEvent(analytics, eventName, eventParams);
}

/**
 * Sets the user for Firebase Analytics.
 * @param email The user's unique email or ID.
 */
export function setFirebaseUser(email: string | null) {
  if (!analytics) {
    console.log("Firebase Analytics not initialized. User not set.");
    return;
  }
  setUserId(analytics, email || 'anonymous');
}

/**
 * Sets user properties for Firebase Analytics for audience segmentation.
 * @param properties An object of user properties.
 */
export function setFirebaseUserProperties(properties: { [key: string]: string }) {
    if (!analytics) {
        console.log("Firebase Analytics not initialized. User properties not set.");
        return;
    }
    setUserProperties(analytics, properties);
}
