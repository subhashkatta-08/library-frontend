import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function UserRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNo: "",
      password: "",
      confirmPassword: ""
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),

      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

      mobileNo: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values, { setErrors }) => {
      try {
        const { confirmPassword, ...payload } = values;
        await api.post("/user/register", payload);
        alert("Registered successfully!");
        navigate("/user/login");
      } catch (err) {
        if (err.response && err.response.data) {
          const fieldError = err.response.data;
          const errors = {};
          fieldError.forEach(error => {
            errors[error.field] = error.message;
          });
          setErrors(errors);
        } else {
          alert("Something went wrong. Please try again later.");
        }
      }
    }
  });

  return (
    <div
      className="d-flex justify-content-center align-items-center p-3"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div className="card shadow-lg p-5 rounded-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center fw-bold text-primary mb-3">User Registration</h2>
        <p className="text-center text-muted mb-4">Enter your details to create an account</p>

        <form onSubmit={formik.handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              name="name"
              className={`form-control ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter full name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              name="email"
              type="email"
              className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>

          {/* Mobile */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Mobile Number</label>
            <input
              name="mobileNo"
              className={`form-control ${formik.touched.mobileNo && formik.errors.mobileNo ? "is-invalid" : ""}`}
              value={formik.values.mobileNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter mobile number"
            />
            {formik.touched.mobileNo && formik.errors.mobileNo && (
              <div className="invalid-feedback">{formik.errors.mobileNo}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
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
              >
                <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} fs-5`}></i>
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="input-group">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "is-invalid" : ""}`}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Re-enter password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`bi ${showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} fs-5`}></i>
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold" style={{ padding: "10px", fontSize: "16px" }}>
            Register
          </button>

          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/user/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default UserRegister;
