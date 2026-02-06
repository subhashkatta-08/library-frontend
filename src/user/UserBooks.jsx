// tabs/DashboardMyBooks.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

function UserBooks() {
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const res = await api.get("/user/my-books");
    setBooks(res.data);
  };

  const returnBook = async (id) => {
    if (!window.confirm("Return this book?")) return;
    await api.post(`/user/return/${id}`);
    loadBooks();
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <>
      <h5 className="fw-bold mt-4 mb-3">📘 My Issued Books</h5>

      {books.length === 0 ? (
        <div className="alert alert-info">No books issued</div>
      ) : (
        <div className="row g-3">
          {books.map(book => (
            <div key={book.id} className="col-md-4">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body">
                  <h6 className="fw-bold">{book.bookTitle}</h6>
                  <small className="text-muted"> Due Date : {new Date(book.dueDate).toLocaleDateString()}</small>
                  <button className="btn btn-sm btn-danger w-100 mt-3" onClick={() => returnBook(book.id)}>
                    Return Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default UserBooks;
