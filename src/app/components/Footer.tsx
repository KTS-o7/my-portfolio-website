"use client";
import React from "react";
const Footer:React.FC = () => {
  return (
    <footer className="footer border z-10 border-t-gray-600 border-l-transparent border-r-transparent bg-black-500 text-white">
      <div className="container p-12 flex justify-between">
        <span>
          Contact :<span className="mx-2"> </span>
          <a
            href="mailto:krishna.tejaswi@shenthar.com"
            className="text-yellow-500"
          >
            Mail: krishna.tejaswi@shenthar.com
          </a>
          <span className="mx-2"> </span>
          <a href="tel:+917760951918" className="text-yellow-500">
            Phone: +91 (776)095-1918
          </a>
        </span>
        <p className="text-gray-300"> That&apos;s all folks!</p>
      </div>
    </footer>
  );
};

export default Footer;
