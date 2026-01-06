import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { Toast, ToastContainer } from "react-bootstrap";

function UserLogin() {
  const navigate = useNavigate();

  // Button loader state
  const [btnLoading, setBtnLoading] = useState(false);

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", bg: "success" });

  const showToastMessage = (message, bg = "success") => {
    setToast({ show: true, message, bg });
  };

  // Formik for form handling & validation
  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },

    validationSchema: Yup.object({
      identifier: Yup.string().required("Email or Mobile is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      setBtnLoading(true); // Start button loader
      try {
        // Call backend
        const res = await api.post("/user/login", values, { skipLoader: true });

        // Save data in localStorage
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userName", res.data.name);

        showToastMessage("✅ Login successful!", "success");

        // Navigate to dashboard after a short delay to show toast
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 500);
      } catch (err) {
        console.error(err);
        showToastMessage("❌ Invalid credentials", "danger");
      } finally {
        setBtnLoading(false); 
      }
    },
  });

  return (
    <div
      className="d-flex justify-content-center align-items-center p-3"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/library-user-login-bg.avif')",
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
          backgroundColor: "rgba(0, 0, 0, 0.35)",
        }}
      >
        <div
          className="card shadow-lg p-5 rounded-4"
          style={{
            maxWidth: "450px",
            width: "100%",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <h2 className="text-center mb-4 fw-bold text-primary">User Login</h2>
          <p className="text-center text-muted mb-4">Enter your credentials to continue</p>

          <form onSubmit={formik.handleSubmit}>
            {/* Identifier */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email / Mobile</label>
              <input
                name="identifier"
                type="text"
                className={`form-control ${
                  formik.touched.identifier && formik.errors.identifier ? "is-invalid" : ""
                }`}
                value={formik.values.identifier}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter email or mobile"
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
                  className={`form-control ${
                    formik.touched.password && formik.errors.password ? "is-invalid" : ""
                  }`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} fs-5`}></i>
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Submit Button with loader */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold d-flex justify-content-center align-items-center"
              style={{ padding: "10px", fontSize: "16px" }}
              disabled={btnLoading}
            >
              {btnLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <p className="text-center text-muted mt-3 mb-0">
              Don't have an account? <Link to="/user/register">Register</Link>
            </p>
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

export default UserLogin;
