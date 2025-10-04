# 🛠️ PROJECT TITLE: QuickChai – Smart Canteen Ordering System

## Idea Abstract
QuickChai is a real-time digital ordering and management system for college canteens. Students can browse the live menu, place and pay for orders seamlessly, while staff can update availability, verify payments, and manage orders instantly. The system ensures faster service, reduced confusion, and live menu sync using Socket.IO.

---

## 👥 Team Information

| Role | Name | GitHub Profile |
| :--- | :--- | :--- |
| **Team Member 1** | Milan Sajai | https://github.com/milansajai
| **Team Member 2** | N/A | -

---

## 🎯 Mandatory Features Implemented (MVP)

The following core features were successfully implemented and are showcased in the video demo:

| Feature | Status | Key Implementation |
| :--- | :--- | :--- |
| **Student Ordering Interface** | ✅ COMPLETE | Students browse live menu, add items to cart, place orders, and view last orders with QR-based payment flow. |
| **Staff Live Order Viewer** | ✅ COMPLETE | Staff can view incoming/past orders in real-time and track payment status. |
| **Staff Payment Verification** | ✅ COMPLETE | Staff verifies orders after UPI payment; verified orders generate tokens for collection. |

---

## 📼 Final Submission & Presentation

### 1. Project Demo Video (MANDATORY)

The link below leads to our mandatory video presentation, which is **not longer than 5 minutes**.

➡️ **YouTube Video Link:** **[INSERT YOUR PUBLIC YOUTUBE LINK HERE]**

### 2. Live Deployment (If Applicable)

Access the live prototype here. (If not deployed, please state 'N/A' or remove this section).

➡️ **Live Demo Link:** [Insert Vercel/Netlify/Render Link Here]

---

## 💻 Tech Stack Used

| Category | Technologies Used | Notes |
| :--- | :--- | :--- |
| **Frontend** | React.js, CSS Modules | Styled UI for student + staff dashboards|
| **Backend/Server** | Node.js, Express.js | REST API endpoints for menu + orders |
| **Database/BaaS** | JSON File (menu.json, orders.json) | Lightweight persistent storage (can be upgraded to MongoDB/MySQL) |
| **Realtime** | Socket.IO | Keeps student menu and staff dashboards in sync instantly |
| **QR Payment** | qrcode.react | Generates UPI QR codes for student payments |

---

## ⚙️ How to Run Locally

If a judge needs to run your project on their machine, provide clear steps here:

1.  **Clone Your Forked Repository:**
    ```bash
    git clone https://github.com/milansajai/QuickChai.git
    cd QuickChai
    ```
2.  **Install Dependencies:**
    ```bash

    # Backend
    cd backend
    npm install

    # Frontend
    cd ../frontend
    npm install

    ```
3.  **Setup Environment Variables (Mandatory for DB/Auth):**
    * Create a .env file in backend/ (if moving to DB or real UPI keys).
    * Add your API keys or database connection strings here:
        ```
        PORT=5000
        NODE_ENV=development

        ```
4.  **Start the Application:**
    ```bash
    cd backend
    node index.js
    cd frontend
    npm start


    ```
