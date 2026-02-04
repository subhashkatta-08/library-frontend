import { useEffect, useState } from "react";
import api from "../api/axios";

function UserStats() {
  const [actions, setActions] = useState({
    TOTAL: 0,
    ISSUED: 0,
    PENDING: 0,
    RETURNED: 0
  });

  useEffect(() => {
    api.get("/user/actions").then(res => setActions(res.data));
  }, []);

  const stats = [
    { label: "Total Books", value: actions.TOTAL, color: "text-dark" },
    { label: "Issued", value: actions.ISSUED, color: "text-success" },
    { label: "Pending", value: actions.PENDING, color: "text-warning" },
    { label: "Returned", value: actions.RETURNED, color: "text-info" }
  ];

  return (
    <>
      <h4 className="fw-bold mb-3">Dashboard Overview</h4>

      <div className="row g-3">
        {stats.map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="card p-3 shadow-sm border-0 rounded-4 text-center">
              <small className="text-muted">{s.label}</small>
              <h4 className={`fw-bold ${s.color}`}>{s.value}</h4>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default UserStats;
