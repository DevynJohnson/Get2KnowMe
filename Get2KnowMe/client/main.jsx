// client/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Styles
import './styles/index.css';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components and Pages
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ErrorPage from './pages/Error.jsx';

// Define routes for the application
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />, // Global error boundary
    children: [
      { index: true, element: <Home /> },        // Default route: /
      { path: 'login', element: <Login /> },     // Route: /login
      { path: 'register', element: <Register /> }, // Route: /register
    ],
  },
]);

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
} else {
  console.error('No root element found');
}