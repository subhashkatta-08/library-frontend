import { useFormik } from "formik";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";
import { Toast, ToastContainer } from "react-bootstrap";

function UserLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", bg: "success" });

  const showToastMessage = (message, bg = "success") => {
    setToast({ show: true, message, bg });
  };

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
      try {
        const res = await api.post("/user/login", values);
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userName", res.data.name);

        showToastMessage("✅ Login successful!", "success");

        // Redirect after a short delay to show the toast
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 100);
      } catch (err) {
        console.log(err);
        showToastMessage("❌ Invalid credentials", "danger");
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
            position: "relative",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <h2 className="text-center mb-4 fw-bold text-primary">User Login</h2>

          <p className="text-center text-muted mb-4">
            Enter your credentials to continue
          </p>

          <form onSubmit={formik.handleSubmit}>
            {/* Identifier */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email / Mobile</label>
              <input
                name="identifier"
                type="text"
                className={`form-control ${
                  formik.touched.identifier && formik.errors.identifier
                    ? "is-invalid"
                    : ""
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
                <input name="password" type={showPassword ? "text" : "password"} 
                  className={`form-control ${ formik.touched.password && formik.errors.password? "is-invalid" : ""}`}
                  value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter password" />
                <button type="button" className="btn btn-outline-secondary d-flex align-items-center" onClick={() => setShowPassword(!showPassword)} >
                  <i className={`bi ${ showPassword ? "bi-eye-slash-fill" : "bi-eye-fill" } fs-5`}></i>
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger mt-1">{formik.errors.password}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-semibold" style={{ padding: "10px", fontSize: "16px" }} >
              Login
            </button>

            <p className="text-center text-muted mt-3 mb-0">
              Don't have an account? <a href="/user/register">Register</a>
            </p>
          </form>
        </div>
      </div>

      {/* Toast */}
      <ToastContainer position="bottom-center" className="p-3">
        <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={100} autohide bg={toast.bg} >
          <Toast.Body className="text-white fw-semibold">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default UserLogin;
