# **App Name**: VeriSafe

## Core Features:

- Secure Auth: Secure Firebase Authentication: Implement email/password login, secured with Firebase Auth to manage and protect user sessions.
- Anomaly AI: Behavioral Anomaly Detection: Train and deploy an ML tool, hosted in Firebase Cloud Functions, using Isolation Forest to analyze behavioral biometrics (typing speed, tap strength, swipe data) for anomaly detection.
- Real-time Alerts: Real-time Anomaly Alerts: Create a dashboard screen that displays real-time alerts triggered by the anomaly detection service, informing users of potentially suspicious activity.
- 2FA Simulation: 2FA Challenge Simulation: Implement a simulated 2FA challenge screen, triggered by anomaly alerts, to verify the user’s identity.
- Behavior Tracker: Behavior Tracking: Create modules to capture and abstract behavior metrics such as typing speed, tap strength/duration, and swipe velocity/angle from user interactions within the app.
- Firestore DB: Firestore Integration: Utilize Firestore to store user profiles, session-specific behavior data, and anomaly scores. Secure data access using Firestore rules and role-based access control via Firebase custom claims.
- Cloud Functions: Firebase Cloud Functions: Load and run the pre-trained scikit-learn Isolation Forest model inside Firebase Cloud Functions to analyze user behavior data and flag anomalies in real-time.

## Style Guidelines:

- Primary color: Deep Blue (#3F51B5) to evoke trust, security, and reliability, essential for a banking application.
- Background color: Very light blue (#E8EAF6), a desaturated tint of the primary color, which ensures a clean and professional interface.
- Accent color: Orange (#FF9800), an analogous color to blue, that draws attention to important interactive elements and alerts.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look.
- Use minimalist, vector-based icons with a focus on clarity and immediate recognition, ensuring intuitive navigation.
- Design a clean and structured layout to ensure usability. Important elements should have sufficient padding and negative space to improve readability.
- Incorporate subtle animations and transitions to enhance user experience, such as loading animations and visual feedback.