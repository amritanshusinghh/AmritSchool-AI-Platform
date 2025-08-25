import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeToken, isLoggedIn } from "../../utils/authUtils";
import { toast } from "react-hot-toast";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    toast.success("You have been logged out.");
    navigate("/login");
    setIsMenuOpen(false); // Close menu on logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            Amrit's School
          </Link>

          <button
            className={isMenuOpen ? "menu-toggle active" : "menu-toggle"}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
            <div className="nav-links">
              <Link to="/dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/ai" onClick={closeMenu}>
                AI Assistant
              </Link>
              <Link to="/chat" onClick={closeMenu}>
                Chat
              </Link>
              <Link to="/roadmap" onClick={closeMenu}>
                Roadmap
              </Link>
              {/* <Link to="/study-room" onClick={closeMenu}>
                Study Room
              </Link> */}

              <Link to="/quiz" onClick={closeMenu}>
                Quiz
              </Link>
            </div>
            <div className="auth-links">
              {isLoggedIn() ? (
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="register-btn"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
