// client/App.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavTabs from "./components/Nav.jsx";
import LogoutNotification from "./components/LogoutNotification.jsx";
import { useColorScheme } from "./hooks/useColorScheme.js";
import { useTokenExpiration } from "./hooks/useTokenExpiration.js";

function App() {
  // Apply color scheme on every page load
  useColorScheme();

  // Monitor token expiration and handle automatic logout
  useTokenExpiration();

  return (
    <div className="app-container">
      <LogoutNotification />
      <NavTabs />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
