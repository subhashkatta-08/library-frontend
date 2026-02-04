import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UserStats from "./UserStats";
import UserBooks from "./UserBooks";
import UserDetailsTab from "./UserDetailsTab";
import UserActivityTab from "./UserActivityTab";
import AvailableBooks from "./AvailableBooks";

function UserDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const userName = localStorage.getItem("userName") || "User";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/user/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { id: "profile", label: "User Details", icon: "bi-person" },
    { id: "my-books", label: "Available Books", icon: "bi-book" },
    { id: "activity", label: "Activity", icon: "bi-clock-history" }
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <div className="p-4 shadow d-none d-lg-flex flex-column" style={{ width: "250px", background: "#0d6efd", color: "white" }}>
        <h4 className="fw-bold mb-4">📚 User Panel</h4>
        <div className="mb-3">
              <h6 className="fw-bold">Welcome, {userName} 👋</h6>
        </div>
        <ul className="list-unstyled flex-grow-1">
          {menuItems.map(item => (
            <li key={item.id} className={`mb-3 p-2 rounded ${
                activeSection === item.id ? "bg-primary bg-opacity-25" : ""
              }`} style={{ cursor: "pointer" }} onClick={() => setActiveSection(item.id)}>
              {item.label}
            </li>
          ))}
        </ul>

        <div className="mt-auto p-2 rounded bg-danger bg-opacity-25" style={{ cursor: "pointer" }} onClick={handleLogout}>
          🚪 Logout
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* -------- MOBILE TOP NAV -------- */}
        <nav className="navbar bg-white shadow-sm d-lg-none sticky-top px-3">
          <span className="fw-bold">Welcome, {userName} 👋</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </nav>

        {/* -------- CONTENT -------- */}
        <div className="p-3 p-lg-4 flex-grow-1">
          {/* DASHBOARD */}
          {activeSection === "dashboard" && (
            <>
              <UserStats />
              <UserBooks />
            </>
          )}

          {/* USER DETAILS */}
          {activeSection === "profile" && <UserDetailsTab />}

          {/* AVAILABLE BOOKS */}
          {activeSection === "my-books" && <AvailableBooks />}

          {/* ACTIVITY */}
          {activeSection === "activity" && <UserActivityTab />}
        </div>

        {/* ================= MOBILE BOTTOM NAV ================= */}
        <div className="d-lg-none bg-white shadow-sm py-2 px-3 d-flex justify-content-around"
          style={{position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000}}>
          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-center ${
                activeSection === item.id ? "text-primary" : "text-muted"
              }`}
              style={{ cursor: "pointer" }}
            >
              <i className={`bi ${item.icon} fs-5`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
