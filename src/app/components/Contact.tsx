"use client";
import React, { useState, FC } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import emailjs from "emailjs-com";
import DOMPurify from "dompurify";

interface FormErrors {
  email?: string;
  name?: string;
  subject?: string;
  message?: string;
  submission?: string;
}

const Contact: FC = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    // Email validation
    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.get("email") as string
      )
    ) {
      errors.email = "Please enter a valid email address";
    }

    // Name validation - alphanumeric with spaces
    if (!/^[a-zA-Z0-9 ]{5,50}$/.test(formData.get("name") as string)) {
      errors.name = "Name should be 5-50 characters (letters, numbers, spaces)";
    }

    // Subject validation - reasonable limit and format
    if (!/^[a-zA-Z0-9 .,!?-]{5,200}$/.test(formData.get("subject") as string)) {
      errors.subject = "Subject should be 5-200 characters";
    }

    // Message - reasonable limit
    const message = formData.get("message") as string;
    if (message.length < 5 || message.length > 1000) {
      errors.message = "Message should be 5-1000 characters";
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Sanitize form data before submission
    const sanitizedFormData = {
      email: DOMPurify.sanitize(formData.get("email") as string),
      name: DOMPurify.sanitize(formData.get("name") as string),
      subject: DOMPurify.sanitize(formData.get("subject") as string),
      message: DOMPurify.sanitize(formData.get("message") as string),
    };

    // Create a fresh sanitized template parameters object for emailjs
    const templateParams = {
      email: sanitizedFormData.email,
      name: sanitizedFormData.name,
      subject: sanitizedFormData.subject,
      message: sanitizedFormData.message,
    };

    emailjs
      .send("service_kts", "template_kts", templateParams, "WJtWKpUuqJ2IktWC3")
      .then((result) => {
        console.log("Email sent successfully!", result.status, result.text);
        setEmailSubmitted(true);
        setFormErrors({});
      })
      .catch((error) => {
        console.error("An error occurred while sending the email:", error.text);
        setFormErrors({
          submission: "Failed to send email. Please try again later.",
        });
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
                maxLength={100}
                className="bg-gray-800 border border-gray-600 placeholder-gray-500 text-white text-xl rounded-lg block w-full p-2.5"
                placeholder="example@email.com"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="text-white block text-xl mb-2 font-medium"
              >
                Name
              </label>
              <input
                name="name"
                type="text"
                id="name"
                required
                maxLength={50}
                className="bg-gray-800 border border-gray-600 placeholder-gray-500 text-white text-xl rounded-lg block w-full p-2.5"
                placeholder="Your name please !"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
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
                maxLength={100}
                className="bg-gray-800 border border-gray-600 placeholder-gray-500 text-white text-xl rounded-lg block w-full p-2.5"
                placeholder="Topic goes here"
              />
              {formErrors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.subject}
                </p>
              )}
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
                maxLength={1000}
                className="bg-gray-800 border border-gray-600 placeholder-gray-500 text-white text-xl rounded-lg block w-full p-2.5"
                placeholder="Your message goes here"
              ></textarea>
              {formErrors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.message}
                </p>
              )}
            </div>
            {formErrors.submission && (
              <p className="text-red-500 text-sm mb-4">
                {formErrors.submission}
              </p>
            )}
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
