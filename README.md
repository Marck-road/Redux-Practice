# Folder Structure Guide
```
src/
  components/
    Tasks.jsx        # Tasks page with CRUD functionality
    Login.jsx        # Login page with JWT handling
    Register.jsx     # Registration page
  store/
    authSlice.js    # Redux slice for authentication
    tasksSlice.js   # Redux slice for task management
    index.js        # Optional: central store configuration
  styles/
    App.css         # Global styles
    Tasks.css       # Tasks page styles
    Login.css       # Login page styles
    Register.css    # Register page styles
  App.jsx           # Main app with routes
  index.js          # React entry point


backend/
  config/
    db.js         # MySQL connection setup
  middleware/
    auth.js       # JWT authentication middleware
  routes/
    auth.js       # Login & register routes
    tasks.js      # CRUD routes for tasks
  server.js       # Express server entry point
```

# Setup Guide

## Backend
``` 
mkdir server
cd server
npm init -y
npm install express mysql bcryptjs jsonwebtoken dotenv cors
```

## Frontend 
```
npx create-react-app client
cd client
npm install react-redux @reduxjs/toolkit react-router-dom
```