import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import api from "../api/axios";

function AdminReturnRequestsTab() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({show: false, message: "", bg: "success"});

  const showToastMessage = (message, bg = "success") => {
    setToast({ show: true, message, bg });
  };


  useEffect(() => {
    loadReturnRequests();
  }, []);

  const loadReturnRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/return/requested");
      console.log(res.data);
      setRecords(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load return requests");
    } finally {
      setLoading(false);
    }
  };

  const approveReturn = async (id) => {
    if (!window.confirm("Approve this return?")) return;

    try {
      await api.post(`/admin/return-request/${id}/approve`);
      showToastMessage("✅ Return approved successfully!", "success");
      loadReturnRequests();
    } catch (err) {
      showToastMessage(err.response?.data || "❌ Something went wrong", "danger");
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">Return Requests</h5>

      {loading && <p>Loading...</p>}

      {!loading && records.length === 0 && (
        <p className="text-muted">No return requests found.</p>
      )}

      {records.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Book</th>
                <th>User</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {records.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{r.bookTitle}</td>
                  <td>{r.userName}</td>
                  <td>{r.issueDate}</td>
                  <td>{r.dueDate}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => approveReturn(r.id)}>
                      Approve Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer position="bottom-center" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={2500}
          autohide
          bg={toast.bg}
        >
          <Toast.Body className="text-white fw-semibold">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default AdminReturnRequestsTab;
