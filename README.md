
# Campus Lost & Found System

A modern, full-stack web application for managing lost and found items on campus. Built with React, Node.js, and MongoDB.

## Features

*   **User Authentication**: Secure registration and login (Email/Password) using JWT.
*   **Report Items**: Easily report lost or found items with descriptions, locations, and images.
*   **Browse & Search**: Filter items by status (Lost/Found), category, or search by keywords.
*   **Claims System**:
    *   Users can claim "Found" items by providing proof of ownership.
    *   Item finders can review, approve, or reject claims.
*   **Dashboard**: Manage your reported items and track the status of your claims.
*   **Admin Controls**: Administrators can manage all items and statuses.

## Project Structure

```
/
├── public/          # Static assets
├── server/          # Backend (Node/Express)
│   ├── routes/      # API Routes (auth, items, claims)
│   ├── models/      # Mongoose Models (User, Item, Claim)
│   ├── middleware/  # Auth middleware
│   └── index.js     # Server entry point
├── src/             # Frontend (React)
│   ├── components/  # Reusable UI components (Navbar, ItemCard)
│   ├── context/     # React Context (AuthContext)
│   ├── pages/       # Application Pages (Login, Dashboard, etc.)
│   └── App.jsx      # Main App component
└── README.md        # Project documentation
```

## Tech Stack

*   **Frontend**: React (Vite), Vanilla CSS (Dark/Red Theme)
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: JSON Web Tokens (JWT) & bcrypt

## Prerequisites

*   [Node.js](https://nodejs.org/) (v14+)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Installed and running locally)

## Installation & Setup

1.  **Clone the repository** (if applicable) or navigate to the project folder.

2.  **Install Dependencies**:
    ```bash
    # Install root/frontend dependencies
    npm install

    # Install backend dependencies
    cd server
    npm install
    cd ..
    ```

3.  **Start MongoDB**:
    Ensure your local MongoDB service is running.
    *   Windows: `mongod` (or via Services)
    *   Mac/Linux: `brew services start mongodb-community`

4.  **Run the Application**:
    This project uses `concurrently` to run both the frontend and backend with a single command.
    ```bash
    npm run dev
    ```
    *   **Frontend**: http://localhost:5173
    *   **Backend API**: http://localhost:5000

## API Endpoints

*   `POST /api/auth/register` - Create a new account
*   `POST /api/auth/login` - Login
*   `GET /api/auth/me` - Get current user info
*   `GET /api/items` - Fetch all items (supports filtering)
*   `POST /api/items` - Report a new item
*   `GET /api/claims` - Fetch claims
*   `POST /api/claims` - Submit a claim
