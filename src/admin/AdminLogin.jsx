import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

function AdminLogin() {
  const navigate = useNavigate();

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // Button loader
  const [btnLoading, setBtnLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", bg: "success" });

  const showToastMessage = (message, bg = "success") => setToast({ show: true, message, bg });

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },

    validationSchema: Yup.object({
      identifier: Yup.string().email("Enter a valid email").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),

    onSubmit: async (values) => {
      setBtnLoading(true); // start button loader
      try {
        const res = await api.post("/admin/login", values, { skipLoader: true });

        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminRole", res.data.role);
        localStorage.setItem("adminName", res.data.name);

        showToastMessage("✅ Login successful!", "success");

        // Redirect after a short delay to show toast
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
      } catch (err) {
        console.error(err);
        formik.setStatus("❌ Invalid credentials. Please try again.");
      } finally {
        setBtnLoading(false); // stop button loader
      }
    },
  });

  return (
    <div
      className="d-flex justify-content-center align-items-center p-3"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/library-admin-login-bg.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom right, rgba(0,0,0,0.65), rgba(0,0,0,0.35))",
          backdropFilter: "blur(3px)",
        }}
      >
        <div
          className="card shadow-lg p-5 rounded-4"
          style={{
            maxWidth: "450px",
            width: "100%",
            position: "relative",
            zIndex: 2,
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <h2 className="text-center mb-4 fw-bold text-primary">Admin Login</h2>
          <p className="text-center text-muted mb-4">Sign in to manage the system</p>

          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                name="identifier"
                type="text"
                className={`form-control ${formik.touched.identifier && formik.errors.identifier ? "is-invalid" : ""}`}
                value={formik.values.identifier}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter admin email"
              />
              {formik.touched.identifier && formik.errors.identifier && (
                <div className="invalid-feedback">{formik.errors.identifier}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <div className="input-group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} fs-5`}></i>
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback d-block">{formik.errors.password}</div>
              )}
            </div>

            {/* Server error */}
            {formik.status && (
              <p className="text-danger text-center mb-3">{formik.status}</p>
            )}

            {/* Submit Button with loader */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold d-flex justify-content-center align-items-center"
              style={{ padding: "10px", fontSize: "16px" }}
              disabled={btnLoading}
            >
              {btnLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-center" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={1500}
          autohide
          bg={toast.bg}
        >
          <Toast.Body className="text-white fw-semibold">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default AdminLogin;
