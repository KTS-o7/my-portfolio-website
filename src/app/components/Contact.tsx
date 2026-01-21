"use client";
import React, { FC, useId, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import emailjs from "@emailjs/browser";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import contactData from "@/data/contact.json";

interface FormErrors {
  email?: string;
  name?: string;
  subject?: string;
  message?: string;
  submission?: string;
}

const Contact: FC = () => {
  const formId = useId();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.get("email") as string,
      )
    ) {
      errors.email = "Please enter a valid email address";
    }

    if (!/^[a-zA-Z0-9 ]{5,50}$/.test(formData.get("name") as string)) {
      errors.name = "Name should be 5–50 characters (letters, numbers, spaces)";
    }

    if (!/^[a-zA-Z0-9 .,!?-]{5,200}$/.test(formData.get("subject") as string)) {
      errors.subject = "Subject should be 5–200 characters";
    }

    const message = (formData.get("message") as string) || "";
    if (message.length < 5 || message.length > 1000) {
      errors.message = "Message should be 5–1000 characters";
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

    const sanitizedFormData = {
      email: DOMPurify.sanitize(formData.get("email") as string),
      name: DOMPurify.sanitize(formData.get("name") as string),
      subject: DOMPurify.sanitize(formData.get("subject") as string),
      message: DOMPurify.sanitize(formData.get("message") as string),
    };

    emailjs
      .send(
        "service_kts",
        "template_12c4eap",
        sanitizedFormData,
        "x5mPMRuUfMt6x20y0",
      )
      .then(() => {
        setEmailSubmitted(true);
        setFormErrors({});
        setIsSubmitting(false);
      })
      .catch(() => {
        setFormErrors({
          submission: "Failed to send email. Please try again later.",
        });
        setIsSubmitting(false);
      });
  };

  return (
    <section
      id="contact"
      className="py-20 sm:py-28 px-4 sm:px-6 bg-background relative overflow-hidden border-t border-text-tertiary/10 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="pill">Contact</span>
          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text-primary">
            Let’s build something reliable
          </h2>
          <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
            {contactData.description}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 surface-card p-6 sm:p-8"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Direct
            </h3>

            <dl className="mt-5 space-y-4">
              <div className="rounded-[14px] border border-[var(--border)] p-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${contactData.email}`}
                    className="text-text-primary link-underline"
                  >
                    {contactData.email}
                  </a>
                </dd>
              </div>

              <div className="rounded-[14px] border border-[var(--border)] p-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  Phone
                </dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${contactData.phone.link}`}
                    className="text-text-primary link-underline"
                  >
                    {contactData.phone.display}
                  </a>
                </dd>
              </div>

              <div className="rounded-[14px] border border-[var(--border)] p-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  WhatsApp
                </dt>
                <dd className="mt-2">
                  <a
                    href={contactData.whatsapp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary link-underline"
                  >
                    {contactData.whatsapp.display}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 pt-6 border-t border-text-tertiary/15">
              <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Social
              </h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {contactData.socialMedia.map((social) => (
                  <Link
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <span className="sr-only">{social.platform}</span>
                    <FontAwesomeIcon
                      icon={social.icon === "faGithub" ? faGithub : faLinkedin}
                      className="h-5 w-5"
                    />
                    <span className="capitalize">{social.platform}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-7 surface-card p-6 sm:p-8"
          >
            <h3 className="text-xl font-semibold tracking-tight text-text-primary">
              Send a message
            </h3>
            <p className="mt-2 text-text-tertiary text-sm">
              If you prefer email, use the address on the left.
            </p>

            {emailSubmitted ? (
              <div className="mt-8 rounded-[14px] border border-[var(--border)] p-6">
                <div className="text-text-primary font-semibold">
                  Message sent.
                </div>
                <p className="mt-2 text-text-secondary text-sm leading-relaxed">
                  Thanks — I’ll reply as soon as I can.
                </p>
                <button
                  onClick={() => setEmailSubmitted(false)}
                  className="mt-6 btn btn-secondary"
                  type="button"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {formErrors.submission && (
                  <div
                    className="rounded-[14px] border border-red-500/40 bg-red-500/10 p-4 text-sm text-text-secondary"
                    role="alert"
                  >
                    {formErrors.submission}
                  </div>
                )}

                <div>
                  <label
                    htmlFor={`${formId}-name`}
                    className="block text-sm text-text-secondary"
                  >
                    Name
                  </label>
                  <input
                    name="name"
                    id={`${formId}-name`}
                    type="text"
                    required
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={
                      formErrors.name ? `${formId}-name-error` : undefined
                    }
                    className="mt-2 w-full rounded-[14px] border border-text-tertiary/25 bg-[color-mix(in_oklab,var(--color-surface)_82%,transparent)] px-4 py-3 text-text-primary placeholder:text-text-tertiary/70 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="Your name"
                  />
                  {formErrors.name && (
                    <p
                      id={`${formId}-name-error`}
                      className="mt-2 text-xs text-red-400"
                    >
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-email`}
                    className="block text-sm text-text-secondary"
                  >
                    Email
                  </label>
                  <input
                    name="email"
                    id={`${formId}-email`}
                    type="email"
                    required
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={
                      formErrors.email ? `${formId}-email-error` : undefined
                    }
                    className="mt-2 w-full rounded-[14px] border border-text-tertiary/25 bg-[color-mix(in_oklab,var(--color-surface)_82%,transparent)] px-4 py-3 text-text-primary placeholder:text-text-tertiary/70 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="you@domain.com"
                  />
                  {formErrors.email && (
                    <p
                      id={`${formId}-email-error`}
                      className="mt-2 text-xs text-red-400"
                    >
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-subject`}
                    className="block text-sm text-text-secondary"
                  >
                    Subject
                  </label>
                  <input
                    name="subject"
                    id={`${formId}-subject`}
                    type="text"
                    required
                    aria-invalid={Boolean(formErrors.subject)}
                    aria-describedby={
                      formErrors.subject ? `${formId}-subject-error` : undefined
                    }
                    className="mt-2 w-full rounded-[14px] border border-text-tertiary/25 bg-[color-mix(in_oklab,var(--color-surface)_82%,transparent)] px-4 py-3 text-text-primary placeholder:text-text-tertiary/70 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="What would you like to talk about?"
                  />
                  {formErrors.subject && (
                    <p
                      id={`${formId}-subject-error`}
                      className="mt-2 text-xs text-red-400"
                    >
                      {formErrors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-message`}
                    className="block text-sm text-text-secondary"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id={`${formId}-message`}
                    rows={6}
                    required
                    aria-invalid={Boolean(formErrors.message)}
                    aria-describedby={
                      formErrors.message ? `${formId}-message-error` : undefined
                    }
                    className="mt-2 w-full rounded-[14px] border border-text-tertiary/25 bg-[color-mix(in_oklab,var(--color-surface)_82%,transparent)] px-4 py-3 text-text-primary placeholder:text-text-tertiary/70 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="A few details helps me respond faster."
                  />
                  {formErrors.message && (
                    <p
                      id={`${formId}-message-error`}
                      className="mt-2 text-xs text-red-400"
                    >
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending…" : "Send message"}
                  </button>
                  <span className="text-xs text-text-tertiary">
                    No spam — just replies.
                  </span>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
