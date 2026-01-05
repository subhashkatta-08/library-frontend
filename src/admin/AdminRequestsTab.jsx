import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import api from "../api/axios";

function AdminRequestTab() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState({show: false, message: "", bg: "success"});


  const showToastMessage = (message, bg = "success") => {
    setToast({ show: true, message, bg });
  };


  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setLoading(true);

        api.get("/admin/requests/pending")
            .then(res => setRequests(res.data || []))
            .catch(() => setError("Failed to load pending requests"))
            .finally(() => setLoading(false));
  };

  const approveRequest = (id) => {
    setProcessingId(id);

    api.post(`/admin/requests/${id}/approve`)
        .then(() => {
          loadRequests();
          showToastMessage("✅ Request approved successfully!", "success");
        })
        .catch(() => showToastMessage("❌ Failed to approve request", "danger"))
        .finally(() => setProcessingId(null));
  };

  const rejectRequest = (id) => {
    setProcessingId(id);

    api.post(`/admin/requests/${id}/reject`)
        .then(() => {
          loadRequests();
          showToastMessage("✋ Request rejected", "warning");
        })
        .catch(() => showToastMessage("❌ Failed to approve request", "danger"))
        .finally(() => setProcessingId(null));
  };


  return (
    <div className="p-3">

      <h5 className="fw-bold mb-3">Pending Requests</h5>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border"></div>
          <p className="mt-2">Loading...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row g-3">

          {requests.length === 0 && (
            <p className="text-center mt-3">No pending requests</p>
          )}

          {requests.map((req) => (
            <div className="col-12 col-md-6 col-lg-4" key={req.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">

                  <h6 className="card-title fw-bold mb-2">
                    Request #{req.id}
                  </h6>

                  <p className="mb-1">
                    <strong>User:</strong> {req.userId}
                  </p>

                  <p className="mb-1">
                    <strong>Book:</strong> {req.bookId}
                  </p>

                  <p className="mb-1">
                    <strong>Requested:</strong> {req.requestDate}
                  </p>

                  <span className="badge bg-warning text-dark mt-2">
                    {req.status}
                  </span>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-success btn-sm w-50"
                      disabled={processingId === req.id}
                      onClick={() => approveRequest(req.id)}
                    >
                      {processingId === req.id ? "Processing..." : "Approve"}
                    </button>

                    <button
                      className="btn btn-danger btn-sm w-50"
                      disabled={processingId === req.id}
                      onClick={() => rejectRequest(req.id)}
                    >
                      {processingId === req.id ? "Processing..." : "Reject"}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

      <ToastContainer position="bottom-center" className="p-3">
        <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={2500} autohide bg={toast.bg}>
          <Toast.Body className="text-white fw-semibold">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
}

export default AdminRequestTab;
