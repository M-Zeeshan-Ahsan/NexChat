import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./auth.scss";
import { showToast } from "../../utils/toast";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  });
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError((prev) => ({
      ...prev,
      [key]: "",
    }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    try {
      const result = await dispatch(login(formData)).unwrap();
      console.log("result", result);
      document.cookie = `token=${result.accessToken}; path=/; max-age=604800`;
      localStorage.setItem("login", formData.email);
      setFormData({
        email: "",
        password: "",
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      showToast(error || "Something went wrong", "error");
    }
  };
  return (
    <div className="auth-wrapper">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="">Email</label>
        <input
          type="email"
          name="email"
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        {error.email && <p className="error">{error.email}</p>}
        <label htmlFor="">Password</label>
        <input
          type="password"
          name="password"
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
        {error.password && <p className="error">{error.password}</p>}
        <button type="submit">Login</button>
      </form>
      <Link to="/signup">Sign Up</Link>
    </div>
  );
};

export default Login;
