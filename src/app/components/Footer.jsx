"use client";
import React from "react";
const Footer = () => {
  return (
    <footer className="footer border z-10 border-t-gray-600 border-l-transparent border-r-transparent bg-black-500 text-white">
      <div className="container p-12 flex justify-between">
        <span>
          Contact :{" "}
          <a
            href="mailto:krishna.tejaswi@shenthar.com"
            className="text-yellow-500"
          >
            krishna.tejaswi@shenthar.com
          </a>
        </span>
        <p className="text-gray-300"> That's all folks!</p>
      </div>
    </footer>
  );
};

export default Footer;
