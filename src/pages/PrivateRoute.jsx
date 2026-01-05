import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRole }) {

  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("userToken");

  const role =
    localStorage.getItem("adminRole") ||
    localStorage.getItem("userRole");

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
