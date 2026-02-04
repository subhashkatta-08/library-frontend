import { useEffect, useState } from "react";
import api from "../api/axios";

function UserActivityTab() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true); // <-- new loading state

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get("/user/my-activity");
        setActivity(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // <-- stop loading after fetch
      }
    };

    fetchActivity();
  }, []);

  const getStatusBadge = (item) => {
    if (item.returnDate) return "success";
    if (item.issueDate) return "primary";
    return "warning";
  };

  const getStatusText = (item) => {
    if (item.returnDate) return "Returned";
    if (item.issueDate) return "Issued";
    return "Requested";
  };

  return (
    <>
      <h5 className="fw-bold mb-3">📊 My Activity</h5>

      {loading ? (
        <div className="text-center text-muted py-4">
          Loading activity...
        </div>
      ) : activity.length === 0 ? (
        <div className="alert alert-info">No activity found</div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4">
          <ul className="list-group list-group-flush">
            {activity.map((item, i) => (
              <li key={item.id || i} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">
                      📘 {item.bookTitle || "Book"}
                    </div>

                    <small className="text-muted d-block">
                      Requested: {item.requestDate || "-"}
                    </small>

                    {item.issueDate && (
                      <small className="text-muted d-block">
                        Issued: {item.issueDate}
                      </small>
                    )}

                    {item.returnDate && (
                      <small className="text-muted d-block">
                        Returned: {item.returnDate}
                      </small>
                    )}

                    {item.dueDate && !item.returnDate && (
                      <small className="text-danger d-block">
                        Due: {item.dueDate}
                      </small>
                    )}
                  </div>

                  <span className={`badge bg-${getStatusBadge(item)}`}>
                    {getStatusText(item)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default UserActivityTab;
