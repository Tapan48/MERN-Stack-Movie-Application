# MERN Stack Movie Application

A full-stack movie web application with role-based access control, featuring IMDb Top 250 movies.

## Features

### User Features
- View movie details from IMDb's Top 250 Movies
- Search movies by name, description, director, or genre
- Sort movies by name, rating, release date, and duration
- User registration and login

### Admin Features
- Add new movie details
- Edit existing movies
- Delete movies

## Tech Stack

### Frontend
- **React.js** with Vite
- **Material-UI** for styling and responsiveness
- **React Router DOM** for routing
- **Context API** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bull** for distributed queue (optional Redis)
- **bcryptjs** for password hashing

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── queues/          # Bull queue for data insertion
│   ├── utils/           # Seed data utility
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   └── App.jsx      # Main app component
│   └── index.html
│
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| GET | `/api/auth/logout` | Logout user | Private |

### Movies
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/movies` | Get all movies (paginated) | Public |
| GET | `/api/movies/:id` | Get single movie | Public |
| GET | `/api/movies/search` | Search movies | Public |
| GET | `/api/movies/sorted` | Get sorted movies | Public |
| POST | `/api/movies` | Create movie | Admin |
| PUT | `/api/movies/:id` | Update movie | Admin |
| DELETE | `/api/movies/:id` | Delete movie | Admin |

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Redis (optional, for queue functionality)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/moviedb
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   REDIS_HOST=localhost
   REDIS_PORT=6379
   NODE_ENV=development
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (optional):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@movieapp.com | admin123 |
| User | user@movieapp.com | user123 |

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway/AWS)
1. Set environment variables
2. Deploy the backend folder

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables

## License

ISC
