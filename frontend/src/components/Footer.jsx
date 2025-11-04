import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-title">RetailSync Support</h3>
        <p>📧 Email: support@retailsync.com</p>
        <p>📞 Phone: +91 98765 43210</p>
        <p>🏢 Address: RetailSync HQ, Hyderabad, India</p>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} RetailSync. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
