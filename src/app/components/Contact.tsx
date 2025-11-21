"use client";
import React, { useState, FC } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import emailjs from "@emailjs/browser";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import contactData from "@/data/contact.json";
import { TextReveal } from "./ui/TextReveal";

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
      .send(
        "service_kts", // TODO: Replace with your actual EmailJS Service ID
        "template_12c4eap",
        templateParams,
        "x5mPMRuUfMt6x20y0"
      )
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
      className="py-20 sm:py-32 px-4 sm:px-6 bg-background relative overflow-hidden border-t border-text-tertiary/10"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end gap-4 mb-4"
          >
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-text-tertiary/20 uppercase tracking-tighter leading-none">
              Contact
            </h2>
            <div className="h-px flex-grow bg-primary/30 mb-4"></div>
            <span className="font-mono text-primary text-sm mb-4">INIT_COMM</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column: System Status / Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-surface border border-text-tertiary/30 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <h3 className="text-2xl font-bold text-white font-mono uppercase mb-8">
                &gt; System_Channels
              </h3>

              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="bg-primary/10 p-3 border border-primary/20 group-hover:bg-primary group-hover:text-black transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-mono text-text-tertiary uppercase tracking-wider mb-1">Email_Protocol</h4>
                    <a href={`mailto:${contactData.email}`} className="text-lg text-white hover:text-primary font-mono transition-colors">
                      {contactData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-primary/10 p-3 border border-primary/20 group-hover:bg-primary group-hover:text-black transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-mono text-text-tertiary uppercase tracking-wider mb-1">Voice_Link</h4>
                    <a href={`tel:${contactData.phone.link}`} className="text-lg text-white hover:text-primary font-mono transition-colors">
                      {contactData.phone.display}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-primary/10 p-3 border border-primary/20 group-hover:bg-primary group-hover:text-black transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-mono text-text-tertiary uppercase tracking-wider mb-1">Secure_Chat</h4>
                    <a href={contactData.whatsapp.link} target="_blank" rel="noopener noreferrer" className="text-lg text-white hover:text-primary font-mono transition-colors">
                      {contactData.whatsapp.display}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-text-tertiary/20">
                <h4 className="text-sm font-mono text-text-tertiary uppercase tracking-wider mb-4">External_Nodes</h4>
                <div className="flex gap-4">
                  {contactData.socialMedia.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      className="text-text-secondary hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={social.icon === "faGithub" ? faGithub : faLinkedin}
                        className="h-6 w-6"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Terminal Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-black border border-text-tertiary/30 p-1">
              <div className="bg-surface border-b border-text-tertiary/30 px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 font-mono text-xs text-text-tertiary">user@portfolio:~/contact</span>
              </div>

              <div className="p-6 sm:p-8">
                {emailSubmitted ? (
                  <div className="text-center py-12">
                    <div className="text-primary font-mono text-xl mb-4">&gt; Message_Sent_Successfully</div>
                    <p className="text-text-secondary font-mono text-sm mb-8">Thank you for establishing connection.</p>
                    <button
                      onClick={() => setEmailSubmitted(false)}
                      className="text-xs font-mono uppercase tracking-widest border-b border-primary text-primary hover:text-white hover:border-white transition-colors"
                    >
                      [Reset_Terminal]
                    </button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label htmlFor="name" className="block font-mono text-xs text-primary uppercase tracking-wider">&gt; Enter_Name</label>
                      <input
                        name="name"
                        type="text"
                        id="name"
                        required
                        className="w-full bg-surface/50 border-b border-text-tertiary/50 focus:border-primary text-white font-mono py-2 px-3 focus:outline-none transition-colors"
                        placeholder="_"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block font-mono text-xs text-primary uppercase tracking-wider">&gt; Enter_Email</label>
                      <input
                        name="email"
                        type="email"
                        id="email"
                        required
                        className="w-full bg-surface/50 border-b border-text-tertiary/50 focus:border-primary text-white font-mono py-2 px-3 focus:outline-none transition-colors"
                        placeholder="_"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="block font-mono text-xs text-primary uppercase tracking-wider">&gt; Subject_Line</label>
                      <input
                        name="subject"
                        type="text"
                        id="subject"
                        required
                        className="w-full bg-surface/50 border-b border-text-tertiary/50 focus:border-primary text-white font-mono py-2 px-3 focus:outline-none transition-colors"
                        placeholder="_"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block font-mono text-xs text-primary uppercase tracking-wider">&gt; Message_Body</label>
                      <textarea
                        name="message"
                        id="message"
                        required
                        rows={4}
                        className="w-full bg-surface/50 border-b border-text-tertiary/50 focus:border-primary text-white font-mono py-2 px-3 focus:outline-none transition-colors resize-none"
                        placeholder="_"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-black font-mono font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    >
                      {isSubmitting ? "EXECUTING..." : "EXECUTE_SEND"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
