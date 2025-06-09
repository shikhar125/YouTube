# YouTube Clone (MERN Stack)

A full-stack YouTube clone built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication with JWT
- Video browsing and playback
- Channel creation and management
- Video upload, edit and delete
- Comments section with CRUD operations
- Search and filter functionality
- Responsive design for all devices

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Lucide React (icons)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd youtube-clone
   ```

2. Install server dependencies:
   ```
   npm install
   ```

3. Install client dependencies:
   ```
   cd frontend
   npm install
   ```

4. Create a `.env` file in the root directory with the following:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Create an `uploads` folder in the root directory:
   ```
   mkdir uploads
   ```

### Running the Application

1. For development (run both server and client):
   ```
   npm run dev
   ```

2. For server only:
   ```
   npm run server
   ```

3. For client only:
   ```
   npm run client
   ```

### Seeding the Database

To seed the database with sample data:
```
npm run data:import
```

To clear the database:
```
npm run data:destroy
```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Create a new video
- `GET /api/videos/:id` - Get a video by ID
- `PUT /api/videos/:id` - Update a video
- `DELETE /api/videos/:id` - Delete a video
- `POST /api/videos/:id/comments` - Add a comment to a video
- `PUT /api/videos/:id/like` - Like a video

### Channels
- `GET /api/channels` - Get all channels
- `POST /api/channels` - Create a new channel
- `GET /api/channels/:id` - Get a channel by ID
- `PUT /api/channels/:id` - Update a channel

### Comments
- `GET /api/comments/:videoId` - Get all comments for a video
- `PUT /api/comments/:videoId/:commentId` - Update a comment
- `DELETE /api/comments/:videoId/:commentId` - Delete a comment

## Project Structure

```
youtube-clone/
│
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Express app
│
├── frontend/
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # React components
│       ├── context/      # Context providers
│       ├── screens/      # Page components
│       ├── utils/        # Utility functions
│       ├── App.jsx       # Main app component
│       └── main.jsx      # Entry point
│
├── uploads/              # Uploaded files
│
├── .env                  # Environment variables
├── package.json          # npm dependencies
└── README.md             # Project documentation
```