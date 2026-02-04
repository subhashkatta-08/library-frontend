import { useEffect, useState } from "react";
import api from "../api/axios";

function AvailableBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    bg: "success",
  });

  const showToast = (message, bg = "success") => {
    setToast({ show: true, message, bg });
    setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 3000);
  };

  const fetchAvailableBooks = async () => {
    try {
      const res = await api.get("/user/available-books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to fetch books", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableBooks();
  }, []);

  const handleRequestBook = async (bookId) => {
    try {
      await api.post(`/user/request/${bookId}`);
      showToast("📩 Book requested successfully!", "success");
      fetchAvailableBooks();
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to request book", "danger");
    }
  };

  const toastPosition =
    window.innerWidth >= 992
      ? { bottom: "20px", left: "50%", transform: "translateX(-50%)" } 
      : { top: "20px", left: "50%", transform: "translateX(-50%)" }; 

  return (
    <>
      {/* Toast */}
      {toast.show && (
        <div
          className={`position-fixed alert alert-${toast.bg} shadow`}
          style={{
            zIndex: 9999,
            minWidth: "250px",
            textAlign: "center",
            ...toastPosition,
          }}
        >
          {toast.message}
        </div>
      )}

      <h5 className="fw-bold mb-3">📚 Available Books</h5>

      {/* Desktop Table */}
      <div className="d-none d-lg-block card shadow-sm border-0 rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Total</th>
                <th>Available</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Loading books...
                  </td>
                </tr>
              )}
              {!loading && books.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No books available
                  </td>
                </tr>
              )}
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="fw-semibold">{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.totalCopies}</td>
                  <td>
                    <span
                      className={`badge ${
                        book.availableCopies > 0 ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {book.availableCopies}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={book.availableCopies === 0}
                      onClick={() => handleRequestBook(book.id)}
                    >
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="d-lg-none row g-3">
        {loading && (
          <div className="col-12 text-center text-muted py-4">Loading books...</div>
        )}
        {!loading && books.length === 0 && (
          <div className="col-12 text-center text-muted py-4">No books available</div>
        )}
        {books.map((book) => (
          <div className="col-12" key={book.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold">{book.title}</h6>
                <p className="mb-1"><strong>Author:</strong> {book.author}</p>
                <p className="mb-1"><strong>Category:</strong> {book.category}</p>
                <p className="mb-1"><strong>Total:</strong> {book.totalCopies}</p>
                <p className="mb-2">
                  <strong>Available:</strong>{" "}
                  <span
                    className={`badge ${
                      book.availableCopies > 0 ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {book.availableCopies}
                  </span>
                </p>
                <button
                  className="btn btn-primary btn-sm mt-auto"
                  disabled={book.availableCopies === 0}
                  onClick={() => handleRequestBook(book.id)}
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AvailableBooks;
