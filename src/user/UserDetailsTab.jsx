import { useEffect, useState } from "react";
import api from "../api/axios";

function UserDetailsTab() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user/details");
        setUser(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user details");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4">
      <h5 className="fw-bold mb-3">👤 User Details</h5>

      {loading ? (
        <div className="text-center text-muted py-4">Loading user details...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobileNo}</p>
        </>
      )}
    </div>
  );
}

export default UserDetailsTab;
