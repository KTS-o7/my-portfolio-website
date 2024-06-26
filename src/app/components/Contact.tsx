"use client";
import React, { useState, FC } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import emailjs from "emailjs-com";

const Contact: FC = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    //const { email, subject, message } = e.target.elements;
    emailjs
      .sendForm("service_kts", "template_kts", e.target, "WJtWKpUuqJ2IktWC3")
      .then((result) => {
        console.log("Email sent successfully!", result.status, result.text);
        setEmailSubmitted(true);
      })
      .catch((error) => {
        console.error("An error occurred while sending the email:", error.text);
      });
  };
  return (
    <section
      id="contact"
      className="grid md:grid-cols-2 my-12 md:my-12 py-24 gap-4 relative bg-black"
    >
      <div className="hidden md:block bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500 to-transparent rounded-full h-80 w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
      <div className="z-10">
        <h5 className="text-3xl font-bold text-yellow-500 my-2">
          Let&apos;s Connect
        </h5>
        <p className="text-gray-300 text-semibold-lg lg:text-xl mb-4 max-w-md">
          I&apos;m currently looking for new opportunities, my inbox is always
          open. Whether you have a question or just want to say hi, I&apos;ll
          try my best to get back to you!
        </p>
        <div className="socials flex flex-row gap-2">
          <Link href="https://www.github.com/KTS-o7/">
            <FontAwesomeIcon
              icon={faGithub}
              className="h-10 w-10 text-yellow-500"
            />
          </Link>
          <Link href="https://www.linkedin.com/in/krishnatejaswi-shenthar/">
            <FontAwesomeIcon
              icon={faLinkedin}
              className="h-10 w-10 text-yellow-500"
            />
          </Link>
        </div>
      </div>
      <div>
        {emailSubmitted ? (
          <p className="text-green-500 text-xl mt-2">
            Email sent successfully!
          </p>
        ) : (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="text-white block mb-2 text-xl font-medium"
              >
                Your email
              </label>
              <input
                name="email"
                type="email"
                id="email"
                required
                className="bg-gray-800 border border-gray-600 placeholder-gray-500 text-white text-xl rounded-lg block w-full p-2.5"
                placeholder="example@email.com"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="subject"
                className="text-white block text-xl mb-2 font-medium"
              >
                Name
              </label>
              <input
                name="name"
                type="text"
                id="name"
                required
                className="bg-gray-800 border border-gray-600 placeholder-gray-500 text-white text-xl rounded-lg block w-full p-2.5"
                placeholder="Your name please !"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="subject"
                className="text-white block text-xl mb-2 font-medium"
              >
                Subject
              </label>
              <input
                name="subject"
                type="text"
                id="subject"
                required
                className="bg-gray-800 border border-gray-600 placeholder-gray-500 text-white text-xl rounded-lg block w-full p-2.5"
                placeholder="Topic goes here"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="text-white block text-xl mb-2 font-medium"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                required
                className="bg-gray-800 border border-gray-600 placeholder-gray-500 text-white text-xl rounded-lg block w-full p-2.5"
                placeholder="Your message goes here"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
            >
              Send
            </button>
          </form>
        )}
        {isModalVisible && (
          <div className="modal">
            <div className="modal-content">
              <p>Your form was submitted successfully.</p>
              <button
                className="bg-yellow-300 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                onClick={() => setIsModalVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
