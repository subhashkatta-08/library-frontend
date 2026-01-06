import { useState, useEffect } from "react";
import api from "../api/axios";
import AdminBooksTab from "./AdminBooksTab";
import AdminRequestTab from "./AdminRequestsTab";
import AdminUsersTab from "./AdminUsersTab";
import AdminReturnRequestsTab from "./AdminReturnRequestsTab";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalIssued: 0,
    totalPending: 0,
    totalOverdue: 0
  });

  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();

    const storedName = localStorage.getItem("adminName");
    if (storedName) setAdminName(storedName);
  }, [activeSection]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminRole");
    setTimeout(() => {
      localStorage.clear();
      navigate("/admin/login");
    }, 800);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div
        className="p-4 shadow d-none d-lg-flex flex-column"
        style={{ width: "250px", background: "#0d6efd", color: "white" }}
      >
        <h4 className="fw-bold mb-4">📚 Admin Panel</h4>

        <ul className="list-unstyled flex-grow-1">
          {["dashboard", "books", "requests", "returns", "users"].map(section => (
            <li
              key={section}
              className={`mb-3 p-2 rounded ${
                activeSection === section ? "bg-primary bg-opacity-25" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </li>
          ))}
        </ul>

        {/* LOGOUT */}
        <div
          className="mt-auto p-2 rounded bg-danger bg-opacity-25"
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        >
          🚪 Logout
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* MOBILE NAV */}
        <nav className="navbar bg-white shadow-sm d-lg-none sticky-top px-3">
          <span className="fw-bold">Admin Panel</span>

          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </nav>

        <div className="p-3 p-lg-4 flex-grow-1">
          {/* GREETING */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold">👋 Hello, {adminName || "Admin"}</h5>
          </div>

          {/* DASHBOARD */}
          {activeSection === "dashboard" && (
            <>
              <h4 className="fw-bold mb-3 d-none d-lg-block">
                Dashboard Overview
              </h4>

              <div className="row g-3 mb-4">
                {["Total Books", "Issued", "Pending Requests", "Overdue"].map(
                  (label, idx) => {
                    const value =
                      label === "Total Books"
                        ? stats.totalBooks
                        : label === "Issued"
                        ? stats.totalIssued
                        : label === "Pending Requests"
                        ? stats.totalPending
                        : stats.totalOverdue;

                    const color =
                      label === "Issued"
                        ? "text-success"
                        : label === "Pending Requests"
                        ? "text-warning"
                        : label === "Overdue"
                        ? "text-danger"
                        : "text-dark";

                    return (
                      <div key={idx} className="col-6 col-md-3">
                        <div className="card p-3 shadow-sm border-0 rounded-4 text-center">
                          <small className="text-muted">{label}</small>
                          <h4 className={`fw-bold ${color}`}>{value}</h4>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}

          {/* BOOKS */}
          {activeSection === "books" && <AdminBooksTab />}

          {/* ISSUE REQUESTS */}
          {activeSection === "requests" && <AdminRequestTab />}

          {/* RETURN REQUESTS */}
          {activeSection === "returns" && <AdminReturnRequestsTab />}

          {/* USERS */}
          {activeSection === "users" && <AdminUsersTab />}
        </div>

        {/* MOBILE BOTTOM NAV */}
        <div className="d-lg-none bg-white shadow-sm py-2 px-3 d-flex justify-content-around" style={{position:"fixed", bottom: 0, left: 0, right: 0,zIndex: 1000}}>
          {[
            { id: "dashboard", icon: "bi-speedometer2" },
            { id: "books", icon: "bi-book" },
            { id: "requests", icon: "bi-list-check" },
            { id: "returns", icon: "bi-arrow-return-left" },
            { id: "users", icon: "bi-people" }
          ].map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{ cursor: "pointer" }}
              className={`text-center ${
                activeSection === tab.id ? "text-primary" : "text-muted"
              }`}
            >
              <i className={`bi ${tab.icon} fs-5`}></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
