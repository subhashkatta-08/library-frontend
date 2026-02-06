import { useEffect, useState } from "react";
import api from "../api/axios";

function UserActivityTab() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get("/user/my-activity");
        setActivity(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };


  return (
    <>
      <h5 className="fw-bold mb-3">📊 My Activity</h5>

      {loading ? (
        <div className="text-center text-muted py-4">Loading activity...</div>
      ) : activity.length === 0 ? (
        <div className="alert alert-info">No activity found</div>
      ) : (
        <>
          {/* Desktop List */}
          <ul className="list-group list-group-flush d-none d-lg-block">
            {activity.map((item, i) => (
              <li key={item.id || i} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">📘 {item.bookTitle || "Book"}</div>
                    <small className="text-muted d-block">
                      Requested: {formatDate(item.requestDate)}
                    </small>
                    
                    {item.issueDate && (
                      <small className="text-muted d-block">
                        Issued: {formatDate(item.issueDate)}
                      </small>
                    )}
                    
                    {item.returnDate && (
                      <small className="text-muted d-block">
                        Returned: {formatDate(item.returnDate)}
                      </small>
                    )}
                    
                    {item.dueDate && !item.returnDate && (
                      <small className="text-danger d-block">
                        Due: {formatDate(item.dueDate)}
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

          {/* Mobile Cards */}
          <div className="d-lg-none row g-3">
            {activity.map((item, i) => (
              <div className="col-12" key={item.id || i}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold">📘 {item.bookTitle || "Book"}</h6>
                    <p className="mb-1">
                      <strong>Requested:</strong> {formatDate(item.requestDate)}
                    </p>
                    {item.issueDate && (
                      <p className="mb-1">
                        <strong>Issued:</strong> {formatDate(item.issueDate)}
                      </p>
                    )}
                    {item.returnDate && (
                      <p className="mb-1">
                        <strong>Returned:</strong> {formatDate(item.returnDate)}
                      </p>
                    )}
                    {item.dueDate && !item.returnDate && (
                      <p className="mb-1 text-danger">
                        <strong>Due:</strong> {formatDate(item.dueDate)}
                      </p>
                    )}
                    <span className={`badge mt-auto bg-${getStatusBadge(item)}`}>
                      {getStatusText(item)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default UserActivityTab;
