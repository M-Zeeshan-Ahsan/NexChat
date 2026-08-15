import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../store/slices/authSlice";
import "./auth.scss";
import { showToast } from "../../utils/toast";
const Signup = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
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
  const handleSignup = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
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
      const result = await dispatch(signup(formData)).unwrap();

      document.cookie = `token=${result.token}; path=/; max-age=604800`;

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      //   navigate("/");
    } catch (error) {
      console.error(error);
      showToast(error || "Something went wrong", "error");
    }
  };
  return (
    <div className="auth-wrapper">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <label htmlFor="">Name</label>
        <input
          type="text"
          placeholder="enter name"
          name="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        {error.name && <p className="error">{error.name}</p>}
        <label htmlFor="">Email</label>
        <input
          type="email"
          placeholder="enter email"
          name="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        {error.email && <p className="error">{error.email}</p>}
        <label htmlFor="">Password</label>
        <input
          type="password"
          placeholder="enter password"
          name="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
        {error.password && <p className="error">{error.password}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Signup;
