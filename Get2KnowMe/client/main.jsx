// client/main.jsx
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Styles
import './styles/index.css';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Components and Pages
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ErrorPage from './pages/Error.jsx';

// Lazy load less critical pages
const CreatePassport = React.lazy(() => import('./pages/CreatePassport.jsx'));
const ViewPassport = React.lazy(() => import('./pages/ViewPassport.jsx'));
const PasscodeLookup = React.lazy(() => import('./pages/PasscodeLookup.jsx'));

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
      { 
        path: 'create-passport', 
        element: (
          <Suspense fallback={<div className="d-flex justify-content-center p-4"><div className="spinner-border" role="status"></div></div>}>
            <CreatePassport />
          </Suspense>
        )
      },
      { 
        path: 'passport-lookup', 
        element: (
          <Suspense fallback={<div className="d-flex justify-content-center p-4"><div className="spinner-border" role="status"></div></div>}>
            <PasscodeLookup />
          </Suspense>
        )
      },
      { 
        path: 'passport/view/:passcode', 
        element: (
          <Suspense fallback={<div className="d-flex justify-content-center p-4"><div className="spinner-border" role="status"></div></div>}>
            <ViewPassport />
          </Suspense>
        )
      },
    ],
  },
]);

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
} else {
  console.error('No root element found');
}