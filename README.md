# 🛠️ PROJECT TITLE: QuickChai - Smart Canteen Keeping

## Idea Abstract

QuickChai is a real-time canteen ordering system for students and staff. It allows students to browse the menu, place orders, and view order history, while staff can see live orders and verify payments instantly.

---

## 👥 Team Information

| Role | Name | GitHub Profile |
| :--- | :--- | :--- |
| **Team Member 1** | Milan Sajai | https://github.com/milansajai |

---

## 🎯 Mandatory Features Implemented (MVP)

The following core features were successfully implemented and are showcased in the video demo:

| Feature | Status | Key Implementation |
| :--- | :--- | :--- |
| **Student Ordering Interface** | ✅ COMPLETE | Menu browsing, order placement, order history view |
| **Staff Live Order Viewer** | ✅ COMPLETE | Real-time data feed using Firebase, filtering by status |
| **Staff Payment Verification** | ✅ COMPLETE | Staff clicks "Verify" button to update order status in real-time |

---

## 📼 Final Submission & Presentation

### 1. Project Demo Video

The link below leads to our mandatory video presentation, which is **not longer than 5 minutes**.

➡️ **YouTube Video Link:** **[INSERT YOUR PUBLIC YOUTUBE LINK HERE]**

---

## 💻 Tech Stack Used

| Category | Technologies Used | Notes |
| :--- | :--- | :--- |
| **Frontend** | React, Tailwind CSS | Styled with Tailwind, uses React components for menu/order pages |
| **Backend/Server** | Node.js, Express | Handles API endpoints for orders, user authentication, and payment verification |
| **Database/BaaS** | Firebase Firestore | Stores student orders, menu items, and staff verification status |

---

## ⚙️ How to Run Locally

If a judge needs to run your project on their machine, provide clear steps here:

1.  **Clone Your Forked Repository:**
    ```bash
    git clone https://github.com/milansajai/QuickChai.git

    ```
2.  **Install Dependencies:**
    ```bash
    cd QuickChai
    npm install
    ```
3.  **Setup Environment Variables (Mandatory for DB/Auth):**
    * Create a file named `.env` in the root directory.
    * Add your firebase configuration:
        ```
        REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
        REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
        REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
        REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
        REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
        NODE_ENV=development

        ```
4.  **Start the Application:**
    ```bash
    npm run dev 
    ```
