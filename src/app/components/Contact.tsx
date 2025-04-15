"use client";
import React, { useState, FC } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import emailjs from "emailjs-com";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
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
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("An error occurred while sending the email:", error.text);
        setFormErrors({
          submission: "Failed to send email. Please try again later.",
        });
        setIsSubmitting(false);
      });
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-900 relative scroll-mt-20"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -bottom-24 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute top-24 -left-24 w-48 sm:w-72 h-48 sm:h-72 bg-yellow-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-black bg-opacity-40 backdrop-blur-sm p-5 sm:p-8 rounded-2xl border border-gray-800 shadow-xl"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-4 sm:mb-6">
              Let&apos;s Connect
            </h3>
            <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
              I&apos;m currently looking for new opportunities, my inbox is
              always open. Whether you have a question or just want to say hi,
              I&apos;ll try my best to get back to you!
            </p>

            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <div className="flex items-start">
                <div className="bg-yellow-500/10 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-medium text-gray-200">
                    Email
                  </h4>
                  <a
                    href="mailto:krishna.tejaswi@shenthar.com"
                    className="text-gray-400 hover:text-yellow-500 transition-colors text-sm sm:text-base"
                  >
                    krishna.tejaswi@shenthar.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-500/10 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-medium text-gray-200">
                    Phone
                  </h4>
                  <a
                    href="tel:+917760951918"
                    className="text-gray-400 hover:text-yellow-500 transition-colors text-sm sm:text-base"
                  >
                    +91 (776) 095-1918
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <h4 className="text-base sm:text-lg font-medium text-gray-200 mb-3 sm:mb-4">
                Find me on
              </h4>
              <div className="flex space-x-3 sm:space-x-4">
                <Link
                  href="https://www.github.com/KTS-o7/"
                  target="_blank"
                  className="bg-gray-800 hover:bg-gray-700 p-2 sm:p-3 rounded-lg text-yellow-500 transition-all hover:scale-110"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/krishnatejaswi-shenthar/"
                  target="_blank"
                  className="bg-gray-800 hover:bg-gray-700 p-2 sm:p-3 rounded-lg text-yellow-500 transition-all hover:scale-110"
                >
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {emailSubmitted ? (
              <div className="bg-black bg-opacity-40 backdrop-blur-sm p-5 sm:p-8 rounded-2xl border border-gray-800 shadow-xl">
                <div className="text-center p-4 sm:p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 mb-4 sm:mb-6">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-300 mb-5 sm:mb-6 text-sm sm:text-base">
                    Thank you for reaching out. I&apos;ll get back to you as
                    soon as possible.
                  </p>
                  <button
                    onClick={() => setEmailSubmitted(false)}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-black bg-opacity-40 backdrop-blur-sm p-5 sm:p-8 rounded-2xl border border-gray-800 shadow-xl">
                <h3 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-4 sm:mb-6">
                  Send Me a Message
                </h3>
                <form
                  className="space-y-4 sm:space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="text-gray-300 block mb-1.5 sm:mb-2 font-medium text-sm sm:text-base"
                    >
                      Your Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      id="email"
                      required
                      maxLength={100}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-colors text-sm sm:text-base"
                      placeholder="example@email.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="text-gray-300 block mb-1.5 sm:mb-2 font-medium text-sm sm:text-base"
                    >
                      Your Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      id="name"
                      required
                      maxLength={50}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-colors text-sm sm:text-base"
                      placeholder="Enter your name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="text-gray-300 block mb-1.5 sm:mb-2 font-medium text-sm sm:text-base"
                    >
                      Subject
                    </label>
                    <input
                      name="subject"
                      type="text"
                      id="subject"
                      required
                      maxLength={100}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-colors text-sm sm:text-base"
                      placeholder="What is this about?"
                    />
                    {formErrors.subject && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {formErrors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="text-gray-300 block mb-1.5 sm:mb-2 font-medium text-sm sm:text-base"
                    >
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      required
                      maxLength={1000}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-colors text-sm sm:text-base"
                      placeholder="Your message here..."
                    ></textarea>
                    {formErrors.message && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  {formErrors.submission && (
                    <div className="p-2.5 sm:p-3 bg-red-900/30 border border-red-800 rounded-lg">
                      <p className="text-red-500 text-xs sm:text-sm">
                        {formErrors.submission}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-all ${
                      isSubmitting
                        ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg hover:shadow-yellow-500/20"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
