import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="py-12 px-4 text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <h2 className="text-4xl mb-4 font-semibold">Contact Me</h2>
      <p className="text-xl mx-auto max-w-2xl">
        If you'd like to get in touch, feel free to send me an email or connect
        with me on LinkedIn.
      </p>
      <div className="mt-8">
        <a
          href="mailto:your-email@example.com"
          className="bg-white text-blue-500 py-2 px-4 rounded mr-2 shadow-lg hover:bg-blue-500 hover:text-white transition duration-300"
        >
          Email Me
        </a>
        <a
          href="https://www.linkedin.com/in/krishnatejaswi-shenthar/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-500 py-2 px-4 rounded ml-2 shadow-lg hover:bg-blue-500 hover:text-white transition duration-300"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
