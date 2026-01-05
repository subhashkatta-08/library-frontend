import { useEffect, useState } from "react";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";

const bookSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  author: Yup.string().trim().required("Author is required"),
  category: Yup.string().trim().required("Category is required"),
  totalCopies: Yup.number()
    .min(0, "Total must be 0 or more")
    .required("Total copies is required"),
  availableCopies: Yup.number()
    .min(0, "Available must be 0 or more")
    .required("Available copies is required")
    .test(
      "available-lte-total",
      "Available cannot be more than total",
      function (value) {
        return value <= this.parent.totalCopies;
      }
    )
});

function AdminBooksTab() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState({show: false, message: "", bg: "success"});

  const showToastMessage = (message, bg = "success") => {
    setToast({
      show: true,
      message,
      bg
    });
  };


  const loadBooks = () => {
    api.get("/admin/books").then((res) => setBooks(res.data));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // -------- ADD BOOK --------
  const addForm = useFormik({
    initialValues: {
      title: "",
      author: "",
      category: "",
      totalCopies: 0,
      availableCopies: 0
    },
    validationSchema: bookSchema,
    onSubmit: (values, actions) => {
      api.post("/admin/add-book", values).then(() => {
        actions.resetForm();
        setShowAddModal(false);
        loadBooks();
        showToastMessage("📚 Book added successfully!", "success");
      });
    }
  });

  // -------- EDIT BOOK --------
  const editForm = useFormik({
    enableReinitialize: true,
    initialValues: editingBook || {
      title: "",
      author: "",
      category: "",
      totalCopies: 0,
      availableCopies: 0
    },
    validationSchema: bookSchema,
    onSubmit: (values) => {
      api
        .put(`/admin/edit-book/${editingBook.id}`, values)
        .then(() => {
          setEditingBook(null);
          loadBooks();
          showToastMessage("✍️ Book updated successfully!", "primary");
        });
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this book?")) {
      api.delete(`/admin/delete-book/${id}`).then(() => {
        loadBooks();
        showToastMessage("🗑️ Book deleted successfully!", "danger");
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-3">
        <h5>Manage Books</h5>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          Add New Book
        </button>
      </div>

      <div className="row g-3">
        {books.map((book) => (
          <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
            <div className="card p-3 shadow-sm rounded-4 flex-fill">

              {/* VIEW */}
              {!editingBook || editingBook.id !== book.id ? (
                <>
                  <h6>{book.title}</h6>
                  <small className="text-muted">By {book.author}</small>

                  <p>Category: {book.category}</p>
                  <p>Total: {book.totalCopies}</p>
                  <p>Available: {book.availableCopies}</p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setEditingBook(book)}
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                // EDIT MODE
                <form onSubmit={editForm.handleSubmit} className="d-flex flex-column gap-2">

                  <label className="fw-semibold">Title</label>
                  <input
                    name="title"
                    className="form-control"
                    value={editForm.values.title}
                    onChange={editForm.handleChange}
                  />
                  {editForm.touched.title && editForm.errors.title && (
                    <small className="text-danger">{editForm.errors.title}</small>
                  )}

                  <label className="fw-semibold">Author</label>
                  <input
                    name="author"
                    className="form-control"
                    value={editForm.values.author}
                    onChange={editForm.handleChange}
                  />
                  {editForm.touched.author && editForm.errors.author && (
                    <small className="text-danger">{editForm.errors.author}</small>
                  )}

                  <label className="fw-semibold">Category</label>
                  <input
                    name="category"
                    className="form-control"
                    value={editForm.values.category}
                    onChange={editForm.handleChange}
                  />
                  {editForm.touched.category && editForm.errors.category && (
                    <small className="text-danger">{editForm.errors.category}</small>
                  )}

                  <label className="fw-semibold">Total Copies</label>
                  <input
                    type="number"
                    name="totalCopies"
                    className="form-control"
                    value={editForm.values.totalCopies}
                    onChange={editForm.handleChange}
                  />
                  {editForm.errors.totalCopies && (
                    <small className="text-danger">{editForm.errors.totalCopies}</small>
                  )}

                  <label className="fw-semibold">Available Copies</label>
                  <input
                    type="number"
                    name="availableCopies"
                    className="form-control"
                    value={editForm.values.availableCopies}
                    onChange={editForm.handleChange}
                  />
                  {editForm.errors.availableCopies && (
                    <small className="text-danger">{editForm.errors.availableCopies}</small>
                  )}

                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-success flex-fill" type="submit">
                      Save
                    </button>

                    <button
                      className="btn btn-secondary flex-fill"
                      type="button"
                      onClick={() => setEditingBook(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Book</Modal.Title>
        </Modal.Header>

        <form onSubmit={addForm.handleSubmit}>
          <Modal.Body className="d-flex flex-column gap-2">

            <label className="fw-semibold">Title</label>
            <input
              name="title"
              className="form-control"
              value={addForm.values.title}
              onChange={addForm.handleChange}
            />
            {addForm.touched.title && addForm.errors.title && (
              <small className="text-danger">{addForm.errors.title}</small>
            )}

            <label className="fw-semibold">Author</label>
            <input
              name="author"
              className="form-control"
              value={addForm.values.author}
              onChange={addForm.handleChange}
            />
            {addForm.touched.author && addForm.errors.author && (
              <small className="text-danger">{addForm.errors.author}</small>
            )}

            <label className="fw-semibold">Category</label>
            <input
              name="category"
              className="form-control"
              value={addForm.values.category}
              onChange={addForm.handleChange}
            />
            {addForm.touched.category && addForm.errors.category && (
              <small className="text-danger">{addForm.errors.category}</small>
            )}

            <label className="fw-semibold">Total Copies</label>
            <input
              type="number"
              name="totalCopies"
              className="form-control"
              value={addForm.values.totalCopies}
              onChange={addForm.handleChange}
            />
            {addForm.errors.totalCopies && (
              <small className="text-danger">{addForm.errors.totalCopies}</small>
            )}

            <label className="fw-semibold">Available Copies</label>
            <input
              type="number"
              name="availableCopies"
              className="form-control"
              value={addForm.values.availableCopies}
              onChange={addForm.handleChange}
            />
            {addForm.errors.availableCopies && (
              <small className="text-danger">{addForm.errors.availableCopies}</small>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>

            <Button variant="success" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <ToastContainer position="bottom-center" className="p-3">
        <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={2500} autohide bg={toast.bg} >
          <Toast.Body className="text-white fw-semibold">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
}

export default AdminBooksTab;
