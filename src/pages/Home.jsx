
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center text-center" style={{ minHeight: "100vh", backgroundImage: "url('/library-home-bg.avif')", backgroundSize: "cover", backgroundPosition: "center"}}    >
      <div className="p-5 rounded-4 shadow-lg" style={{ maxWidth: "500px", width: "100%", background: "rgba(255, 255, 255, 0.25)", backdropFilter: "blur(6px)",}}>
        <h2 className="fw-bold text-primary mb-3">📚 Library Management</h2>
        <p className="text-muted mb-4">
          Login as a user to borrow books, or as admin to manage the library.
        </p>

        <div className="d-grid gap-3">
          <Link to="/user/login" className="btn btn-primary btn-lg">
            Login as User
          </Link>

          <Link to="/admin/login" className="btn btn-outline-dark btn-lg">
            Login as Admin
          </Link>
        </div>
      </div>
    </div>
  );
}