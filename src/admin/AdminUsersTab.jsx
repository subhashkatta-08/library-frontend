import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import api from "../api/axios";

export default function AdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", bg: "success" });
  const [processingId, setProcessingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const showToastMessage = (message, bg = "success") => {
    setToast({ show: true, message, bg });
    setTimeout(() => setToast({ ...toast, show: false }), 2500);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/allusers");
      setUsers(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openDialog = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const clearFine = async () => {
    if (!selectedUser) return;
    setProcessingId(selectedUser.id);

    try {
      await api.post(`/admin/users/${selectedUser.id}/clear-fine`);
      showToastMessage(`✅ Fine cleared for ${selectedUser.name}`, "success");
      loadUsers(); // reload user list to update fine
    } catch (err) {
      console.error(err);
      showToastMessage("❌ Failed to clear fine", "danger");
    } finally {
      setProcessingId(null);
      closeDialog();
    }
  };

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">All Users</h5>

      {loading && <div className="text-center text-muted py-4">Loading users...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row g-3">
          {users.map(user => (
            <div className="col-12 col-md-6 col-lg-4" key={user.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold">{user.name}</h6>
                  <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                  <p className="mb-1"><strong>Mobile:</strong> {user.mobileNo}</p>
                  <p className="mb-1"><strong>Fine:</strong> ₹{user.fine}</p>

                  {user.fine > 0 && (
                    <button
                      className="btn btn-warning btn-sm mt-2"
                      onClick={() => openDialog(user)}
                    >
                      Clear Fine
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedUser && (
      <>
        {/* Backdrop */}
        <div className="modal-backdrop fade show"></div>

        {/* Modal */}
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Clear Fine?</h6>
                <button className="btn-close" onClick={closeDialog}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to clear fine for:<br />
                  <strong>{selectedUser.name}</strong> (₹{selectedUser.fine})
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeDialog}>
                  Cancel
                </button>
                <button
                  className="btn btn-warning"
                  onClick={clearFine}
                  disabled={processingId === selectedUser.id}
                >
                  {processingId === selectedUser.id ? "Clearing..." : "Yes, Clear Fine"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )}

      {/* Toast */}
      <ToastContainer position="bottom-center" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={2500}
          autohide
          bg={toast.bg}
        >
          <Toast.Body className="text-white fw-semibold">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
