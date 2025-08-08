# Student Management Frontend

A modern React application for managing student records with a dark, neon-themed UI.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling with custom dark theme
- **React Query** for server state management
- **React Hook Form** with Zod validation
- **React Router** for navigation
- **Axios** for API communication

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the app at [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

Creates optimized production build in `dist/`

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/          # API client and configuration
├── components/   # Reusable UI components
│   ├── layout/   # Layout components (ProtectedRoute)
│   └── ui/       # UI primitives (Button, Form, Input, etc.)
├── contexts/     # React contexts (AuthContext)
├── hooks/        # Custom React hooks
├── pages/        # Page components (Login, Students)
├── types/        # TypeScript type definitions
└── utils/        # Utility functions and constants
```

## Features

- **Authentication**: JWT-based login with protected routes
- **Student Management**: CRUD operations for student records
- **Dark Theme**: Custom neon-themed dark UI with animations
- **Form Validation**: Schema-based validation with Zod
- **Loading States**: Skeleton loaders and loading spinners
- **Error Handling**: Graceful error boundaries and API error handling

## Environment Variables

The app expects the backend API at `http://localhost:8080`. To change this, update `src/api/config.ts`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Integration

The frontend communicates with a Go backend API. Key endpoints:

- `POST /auth/login` - User authentication
- `GET /students` - List all students
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

## License

MIT
