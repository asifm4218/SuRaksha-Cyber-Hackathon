# VeriSafe - AI-Powered Secure Banking App

VeriSafe is a modern, proof-of-concept secure banking application built with Next.js and Firebase. It demonstrates how continuous authentication can be achieved using behavioral biometrics and AI-powered analysis to enhance user security beyond traditional login methods.

The application simulates a real banking environment where user interactions are non-intrusively monitored to detect anomalies, providing an extra layer of protection against unauthorized access.

![VeriSafe Dashboard](https://firebasestudio.ai/docs/verisafe-dashboard.png)

## Core Features

-   **Secure Authentication**:
    -   Standard email and password login.
    -   Passwordless, biometric sign-in using a simulated **WebAuthn** flow.
    -   Secure sign-up process with password strength validation and CAPTCHA verification.

-   **Behavioral Biometric Profiling**:
    -   During sign-up, the app captures a user's unique **behavioral baseline**, including typing speed, rhythm, and key pressure.
    -   This baseline is used for continuous authentication throughout the user's session.

-   **AI-Powered Anomaly Detection**:
    -   The system continuously analyzes user interactions (typing, navigation) against their established baseline.
    -   If a significant deviation is detected, the session is automatically terminated to prevent potential fraud.
    -   **Firebase Genkit** is used to generate AI-powered, human-readable summaries of security events for analysts.

-   **Real-time Security Feedback**:
    -   A dashboard component provides real-time feedback on the security status of the current session.
    -   Users are alerted to unusual activity and potential security risks.
    -   Simulated **2FA challenges** (MPIN) are triggered for critical actions like funds transfers.

-   **Geolocation Tracking**:
    -   The app tracks login locations and flags sign-ins from new or unrecognized locations.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (v15) with App Router
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
-   **Database**: Simulated using local JSON files (`users.json`, `transactions.json`, etc.) for rapid prototyping.
-   **Deployment**: Configured for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or a compatible package manager

### Setup and Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/verisafe.git
    cd verisafe
    ```

2.  **Install dependencies**:
    The project is set up to use `npm`.
    ```bash
    npm install
    ```

### Running the Application

This project uses Genkit for its AI features, which runs as a separate process alongside the Next.js development server.

1.  **Start the Genkit Server**:
    Open a terminal and run the following command to start the Genkit development server. This server handles all AI-related tasks.
    ```bash
    npm run genkit:watch
    ```

2.  **Start the Next.js Development Server**:
    In a separate terminal, start the Next.js application.
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

## Project Structure

-   `src/app/`: Contains all pages and layouts, following the Next.js App Router structure.
    -   `src/app/signin/`: Logic for user authentication.
    -   `src/app/signup/`: User registration and behavioral capture flows.
    -   `src/app/dashboard/`: Protected routes and main application interface.
-   `src/components/`: Reusable React components, including UI elements from ShadCN.
    -   `src/components/auth/`: Components related to authentication flows.
    -   `src/components/dashboard/`: Components used within the main user dashboard.
-   `src/ai/`: All Firebase Genkit-related code.
    -   `src/ai/flows/`: Genkit flows that define the AI logic for tasks like summarizing anomalies and sending notifications.
-   `src/services/`: Contains server-side and client-side logic for interacting with simulated backend services (e.g., `user-service.ts`, `transaction-service.ts`).
-   `*.json`: Root-level JSON files (`users.json`, `transactions.json`, `baselines.json`) act as a simulated database for the prototype.
