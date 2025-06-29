// client/App.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavTabs from "./components/Nav.jsx";

function App() {
  return (
    <div className="app-container">
      <NavTabs />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
