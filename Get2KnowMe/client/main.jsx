// client/main.jsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Styles
import "./styles/index.css";
import "./styles/App.css";
import "./styles/ColorSchemes.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Components and Pages

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ErrorPage from "./pages/Error.jsx";
import Settings from "./pages/Settings.jsx";
import PrivacyPolicy from "./pages/legal/UserInfo.jsx";
import { AuthProvider } from "./utils/AuthContext.jsx";
import ParentalConsent from "./pages/ParentalConsent.jsx";

// Lazy load MyPassport page
const MyPassport = React.lazy(() => import("./pages/MyPassport.jsx"));

// Lazy load less critical pages
const Profile = React.lazy(() => import("./pages/Profile.jsx"));
const CreatePassport = React.lazy(() => import("./pages/CreatePassport.jsx"));
const ViewPassport = React.lazy(() => import("./pages/ViewPassport.jsx"));
const PasscodeLookup = React.lazy(() => import("./pages/PasscodeLookup.jsx"));
const LearnMore = React.lazy(() => import("./pages/LearnMore.jsx"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword.jsx"));
const TermsOfService = React.lazy(
  () => import("./pages/legal/TermsOfService.jsx")
);
const ConsentThankYou = React.lazy(() => import("./pages/ConsentThankYou.jsx"));
const ConsentDeclined = React.lazy(() => import("./pages/ConsentDeclined.jsx"));
const Stories = React.lazy(() => import("./pages/Stories.jsx"));

// Settings pages
const SettingsOverview = React.lazy(
  () => import("./pages/settings/SettingsOverview.jsx")
);
const ProfileSettings = React.lazy(
  () => import("./pages/settings/ProfileSettings.jsx")
);
const SecuritySettings = React.lazy(
  () => import("./pages/settings/SecuritySettings.jsx")
);
const AppearanceSettings = React.lazy(
  () => import("./pages/settings/AppearanceSettings.jsx")
);
const DangerZone = React.lazy(() => import("./pages/settings/DangerZone.jsx"));

// Define routes for the application
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />, // Global error boundary
    children: [
      { index: true, element: <Home /> }, // Default route: /
      { path: "login", element: <Login /> }, // Route: /login
      { path: "register", element: <Register /> }, // Route: /register
      {
        path: "learn-more",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <LearnMore />
          </Suspense>
        ),
      },
      {
        path: "stories",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <Stories />
          </Suspense>
        ),
      },
      {
        path: "policy/UserInfo",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: "policy/terms-of-service",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <TermsOfService />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "my-passport",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <MyPassport />
          </Suspense>
        ),
      },
      {
        path: "create-passport",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <CreatePassport />
          </Suspense>
        ),
      },
      {
        path: "passport-lookup",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <PasscodeLookup />
          </Suspense>
        ),
      },
      {
        path: "passport/view/:passcode",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <ViewPassport />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            index: true,
            element: (
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center p-4">
                    <div className="spinner-border" role="status"></div>
                  </div>
                }
              >
                <SettingsOverview />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center p-4">
                    <div className="spinner-border" role="status"></div>
                  </div>
                }
              >
                <ProfileSettings />
              </Suspense>
            ),
          },
          {
            path: "security",
            // No auth guard: allow all users to access SecuritySettings
            element: (
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center p-4">
                    <div className="spinner-border" role="status"></div>
                  </div>
                }
              >
                <SecuritySettings />
              </Suspense>
            ),
          },
          {
            path: "appearance",
            element: (
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center p-4">
                    <div className="spinner-border" role="status"></div>
                  </div>
                }
              >
                <AppearanceSettings />
              </Suspense>
            ),
          },
          {
            path: "danger-zone",
            element: (
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center p-4">
                    <div className="spinner-border" role="status"></div>
                  </div>
                }
              >
                <DangerZone />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "parental-consent",
        element: <ParentalConsent />,
      },
      {
        path: "consent",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <ConsentThankYou />
          </Suspense>
        ),
      },
      {
        path: "consent/declined",
        element: (
          <Suspense
            fallback={
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status"></div>
              </div>
            }
          >
            <ConsentDeclined />
          </Suspense>
        ),
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
} else {
  console.error("No root element found");
}
