# MirrorLog Frontend

A modern, productivity-focused frontend for MirrorLog - a custom logger and roadmap visualizer tool built with React, Vite, and TailwindCSS.

## 🚀 Features

- **Authentication**: Complete JWT-based auth system with login/register
- **Dashboard**: Split-view layout with Logger and Roadmap
- **Logger**: Add, view, and manage logs with productive tags (@todo, @done, @stuck, etc.)
- **Roadmap**: Weekly goal tracking with progress visualization
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Responsive Design**: Mobile-friendly UI with TailwindCSS
- **Modern UI**: Clean, minimal design inspired by Notion and Linear

## 📁 Project Structure

```
frontend/src/
├── api/                 # API service functions
│   ├── axios.js        # Axios instance with interceptors
│   ├── auth.js         # Auth API calls
│   ├── user.js         # User API calls
│   ├── pages.js        # Pages API calls
│   ├── logs.js         # Logs API calls
│   ├── tags.js         # Tags API calls
│   └── roadmap.js      # Roadmap API calls
├── components/          # React components
│   ├── Navbar.jsx      # Navigation bar with user menu
│   ├── Footer.jsx      # Footer component
│   ├── ProtectedRoute.jsx  # Route protection wrapper
│   ├── Logger.jsx      # Log management component
│   └── Roadmap.jsx     # Roadmap visualization component
├── context/            # React Context
│   └── AuthContext.jsx # Global auth state management
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   └── Dashboard.jsx   # Main dashboard page
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **Context API** - State management

## 📦 Installation

```bash
cd frontend
npm install
```

## 🏃 Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Configuration

### API Base URL

The API base URL is configured in `src/api/axios.js`:
- Default: `http://localhost:5000/api`

To change it, update the `baseURL` in the axios instance.

## 🔐 Authentication Flow

1. User registers/logs in via `/register` or `/login`
2. JWT token is stored in `localStorage` as `token`
3. Token is automatically added to all API requests via axios interceptor
4. AuthContext manages global authentication state
5. Protected routes redirect to login if not authenticated

## 📝 Usage

### Adding Logs

1. Select a page from the dropdown in the Logger component
2. Click the "+" button to add a new log
3. Write your log with tags like `@todo`, `@done`, `@stuck`, `@high`, `@low`
4. Tags are automatically extracted and associated with the log

### Roadmap

1. Select a page from the dropdown
2. View weekly goals organized by subheadings
3. Click on todos to toggle completion
4. Progress percentage is calculated automatically

## 🎨 Design Philosophy

- **Minimal & Clean**: Distraction-free interface
- **Productivity-Focused**: Quick actions and clear visual hierarchy
- **Modern Aesthetics**: Subtle gradients, smooth animations
- **Responsive**: Works seamlessly on desktop and mobile

## 🔗 API Integration

All API calls are organized in the `api/` folder:

- `auth.js` - Authentication endpoints
- `user.js` - User management
- `pages.js` - Page CRUD operations
- `logs.js` - Log management
- `tags.js` - Tag operations
- `roadmap.js` - Roadmap management

## 🚧 Future Enhancements

- Page creation UI
- Tag management interface
- Advanced filtering for logs
- Roadmap creation/editing UI
- Dark mode support
- Export functionality

## 📄 License

MIT
