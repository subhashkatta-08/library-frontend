import { useEffect, useState } from "react";
import api from "../api/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";

function UserDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [editing, setEditing] = useState(false);

  const [actions, setActions] = useState({ TOTAL: 0, ISSUED: 0, PENDING: 0, RETURNED: 0 });
  const [user, setUser] = useState({});
  const [userBooks, setUserBooks] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);

  const [loading, setLoading] = useState(true); // loader state
  const [toast, setToast] = useState({ show: false, message: "", bg: "success" });
  const showToastMessage = (message, bg = "success") => setToast({ show: true, message, bg });

  // ---------- API LOADERS ----------
  const loadActions = async () => { try { const res = await api.get("/user/actions"); setActions(res.data); } catch (e) { console.log(e); } };
  const loadOwnedBooks = async () => { try { const res = await api.get("/user/my-books"); setUserBooks(res.data); } catch (e) { console.log(e); } };
  const loadDetails = async () => {
    try {
      const res = await api.get("/user/details");
      setUser(res.data);
      formik.setValues({ name: res.data.name || "", email: res.data.email || "", mobileNo: res.data.mobileNo || "" });
    } catch (e) { console.log(e); }
  };
  const loadActivity = async () => { try { const res = await api.get("/user/my-activity"); setUserActivity(res.data); } catch (e) { console.log(e); } };
  const loadAvailableBooks = async () => { try { const res = await api.get("/user/available-books"); setAvailableBooks(res.data); } catch (e) { console.log(e); } };

  // ---------- ACTIONS ----------
  const returnBook = async (bookId) => {
    if (!window.confirm("Return this book?")) return;
    try {
      await api.post(`/user/return/${bookId}`);
      loadOwnedBooks();
      loadActivity();
      loadActions();
      showToastMessage("✅ Book returned successfully", "success");
    } catch (e) { console.error(e); showToastMessage(e?.response?.data || "Failed to return book", "danger"); }
  };

  const requestBook = async (id) => {
    try {
      await api.post(`/user/request/${id}`);
      loadActivity();
      loadActions();
      showToastMessage("✅ Book requested successfully", "success");
    } catch (e) { console.error(e); showToastMessage(e?.response?.data || "Failed to request book", "danger"); }
  };

  const handleLogout = () => {
    showToastMessage("👋 Logging out...", "info");
    setTimeout(() => { localStorage.clear(); window.location.href = "/user/login"; }, 800);
  };

  // ---------- EDIT FORM ----------
  const formik = useFormik({
    initialValues: { name: "", email: "", mobileNo: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobileNo: Yup.string().matches(/^[0-9]{10}$/, "Invalid mobile number").required("Mobile number is required")
    }),
    onSubmit: async (values) => {
      try {
        const res = await api.put("/user/edit-user", values);
        setUser(res.data);
        if (user.email !== values.email) { showToastMessage("ℹ️ Email updated. Please log in again.", "info"); handleLogout(); return; }
        setEditing(false);
        showToastMessage("✅ Profile updated successfully!", "success");
      } catch (e) { console.error(e); showToastMessage(e?.response?.data || "Update failed", "danger"); }
    }
  });

  useEffect(() => {
    // Show loader for a short time
    const timer = setTimeout(() => setLoading(false), 2.0); // 0.5s
    loadActions();
    loadOwnedBooks();
    loadDetails();
    loadActivity();
    loadAvailableBooks();
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2 fw-semibold">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div className="p-4 shadow d-none d-lg-flex flex-column" style={{ width: "250px", background: "#0d6efd", color: "white" }}>
        <h4 className="fw-bold mb-4">📖 User Panel</h4>
        <ul className="list-unstyled flex-grow-1 mt-3">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "details", label: "User Details" },
            { id: "activity", label: "Activity" },
            { id: "books", label: "All Books" }
          ].map((item) => (
            <li key={item.id} className={`mb-3 p-2 rounded ${activeSection === item.id ? "bg-primary bg-opacity-25" : ""}`} style={{ cursor: "pointer" }} onClick={() => setActiveSection(item.id)}>
              {item.label}
            </li>
          ))}
        </ul>
        <div className="mt-auto p-2 rounded bg-danger bg-opacity-25" style={{ cursor: "pointer" }} onClick={handleLogout}>🚪 Logout</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* MOBILE NAV */}
        <nav className="navbar bg-white shadow-sm d-lg-none sticky-top px-3">
          <span className="fw-bold">User Panel</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </nav>

        {/* SCROLLABLE MAIN AREA */}
        <div className="flex-grow-1 overflow-auto p-3 p-lg-4">
          {/* DASHBOARD */}
          {activeSection === "dashboard" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <h5 className="fw-bold">📊 Dashboard Stats</h5>
                <small className="opacity-75">👋 Hello, {user.name || "User"}</small>
              </div>

              <div className="row g-2 mb-4">
                {[
                  { label: "Total", value: actions.TOTAL },
                  { label: "Issued", value: actions.ISSUED },
                  { label: "Pending", value: actions.PENDING },
                  { label: "Returned", value: actions.RETURNED }
                ].map((it, i) => (
                  <div className="col-6 col-md-3" key={i}>
                    <div className="card p-2 shadow-sm rounded-3 text-center">
                      <small className="text-muted">{it.label}</small>
                      <h5 className="fw-bold">{it.value}</h5>
                    </div>
                  </div>
                ))}
              </div>

              <h5 className="fw-bold mb-3">📚 My Books</h5>
              {userBooks.length === 0 && <p>No books issued.</p>}
              {userBooks.map((b) => (
                <div key={b.id} className="card p-2 mb-2 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                  <div>
                    <div className="fw-bold">{b.bookTitle}</div>
                    <small className="text-muted">Due Date: {new Date(b.dueDate).toLocaleDateString()}</small>
                  </div>
                  <button className="btn btn-sm btn-outline-danger mt-2 mt-md-0" onClick={() => returnBook(b.id)}>Return</button>
                </div>
              ))}
            </>
          )}

          {/* ... OTHER SECTIONS: details, activity, books (unchanged) */}
        </div>

        {/* MOBILE BOTTOM NAV */}
        <div className="d-lg-none bg-white shadow-sm py-2 px-3 d-flex justify-content-around position-sticky bottom-0" style={{ zIndex: 10 }}>
          {[
            { id: "dashboard", icon: "bi-speedometer2" },
            { id: "details", icon: "bi-person" },
            { id: "activity", icon: "bi-clock" },
            { id: "books", icon: "bi-book" }
          ].map((tab) => (
            <div key={tab.id} onClick={() => setActiveSection(tab.id)} style={{ cursor: "pointer" }} className={`text-center ${activeSection === tab.id ? "text-primary" : "text-muted"}`}>
              <i className={`bi ${tab.icon} fs-5`}></i>
            </div>
          ))}
        </div>
      </div>

      {/* TOAST */}
      <ToastContainer position="bottom-center" className="p-3">
        <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={2500} autohide bg={toast.bg}>
          <Toast.Body className="text-white fw-semibold">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default UserDashboard;
