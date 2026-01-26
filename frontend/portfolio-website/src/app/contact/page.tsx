"use client";

import { useState } from "react";

// ============================================
// INPUT BOX COLOR CONFIGURATION
// ============================================
// Change these values to customize all input box colors
const INPUT_BACKGROUND_COLOR = "#BFBFBF"; // bg-gray-800 equivalent
const INPUT_BORDER_COLOR = "#000000"; // border-gray-600 equivalent
const INPUT_TEXT_COLOR = "#000000"; // text color
const INPUT_FOCUS_RING_COLOR = "#000000"; // focus ring color
// ============================================

// ============================================
// SOCIAL LINKS CONFIGURATION
// ============================================
// Update these links to change where the icons redirect
const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/in/yourprofile",
  github: "https://github.com/yourname",
  whatsapp: "https://wa.me/+919829666198", // Format: https://wa.me/1234567890 (include country code)
  phone: "tel:+919829666198", // Format: tel:+1234567890 (include country code with +)
  email: "mailto:devswami157@gmail.com",
};
// ============================================

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [fieldTouched, setFieldTouched] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate all fields
  const validateAllFields = (): boolean => {
    const errors = {
      name: "",
      email: "",
      message: "",
    };
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate message
    if (!formData.message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    }

    setFieldErrors(errors);
    setFieldTouched({
      name: true,
      email: true,
      message: true,
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${baseURL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message. Please try again later.');
      }

      // Success
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setFieldErrors({ name: "", email: "", message: "" });
      setFieldTouched({ name: false, email: false, message: false });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to send message. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name as keyof typeof formData;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing (only if field was touched)
    if (fieldTouched[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
      e.target.style.borderColor = INPUT_BORDER_COLOR;
    }

    // Real-time email validation (only show errors if field has been touched)
    if (name === "email" && fieldTouched.email) {
      if (value === "") {
        setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
        e.target.style.borderColor = "#EF4444";
      } else if (!validateEmail(value)) {
        setFieldErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
        e.target.style.borderColor = "#EF4444";
      } else {
        setFieldErrors((prev) => ({ ...prev, email: "" }));
        e.target.style.borderColor = INPUT_BORDER_COLOR;
      }
    }
  };

  const handleFieldBlur = (
    fieldName: "name" | "email" | "message",
    e?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFieldTouched((prev) => ({ ...prev, [fieldName]: true }));
    
    const value = e?.target.value || formData[fieldName];
    let error = "";
    
    if (fieldName === "name") {
      if (!value.trim()) {
        error = "Name is required";
      }
    } else if (fieldName === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!validateEmail(value)) {
        error = "Please enter a valid email address";
      }
    } else if (fieldName === "message") {
      if (!value.trim()) {
        error = "Message is required";
      }
    }
    
    setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
    
    // Update border color based on validation
    if (e?.target) {
      e.target.style.borderColor = error ? "#EF4444" : INPUT_BORDER_COLOR;
      e.target.style.boxShadow = "none";
    }
  };

  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <section className="mb-12 md:mb-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#F0F0F0]">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-[#F0F0F0] mb-8">
              &lt;&gt; Let's Connect &lt;/&gt;
            </p>
          </section>

          {/* Contact Form Section */}
          <section className="max-w-2xl mx-auto mb-12">
            <div className="border border-gray-200 p-6 md:p-8 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#F0F0F0] mb-2"
                  >
                    Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{
                      backgroundColor: INPUT_BACKGROUND_COLOR,
                      borderColor: fieldErrors.name ? "#EF4444" : INPUT_BORDER_COLOR,
                      color: INPUT_TEXT_COLOR,
                      borderWidth: "1px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = fieldErrors.name ? "#EF4444" : INPUT_FOCUS_RING_COLOR;
                      e.target.style.boxShadow = fieldErrors.name 
                        ? `0 0 0 2px #EF444440` 
                        : `0 0 0 2px ${INPUT_FOCUS_RING_COLOR}40`;
                    }}
                    onBlur={(e) => {
                      handleFieldBlur("name", e);
                    }}
                    placeholder="Your name"
                  />
                  {fieldErrors.name && (
                    <p className="mt-2 text-sm text-red-500">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#F0F0F0] mb-2"
                  >
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{
                      backgroundColor: INPUT_BACKGROUND_COLOR,
                      borderColor: fieldErrors.email ? "#EF4444" : INPUT_BORDER_COLOR,
                      color: INPUT_TEXT_COLOR,
                      borderWidth: "1px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = fieldErrors.email ? "#EF4444" : INPUT_FOCUS_RING_COLOR;
                      e.target.style.boxShadow = fieldErrors.email 
                        ? `0 0 0 2px #EF444440` 
                        : `0 0 0 2px ${INPUT_FOCUS_RING_COLOR}40`;
                    }}
                    onBlur={(e) => {
                      handleFieldBlur("email", e);
                    }}
                    placeholder="your.email@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="mt-2 text-sm text-red-500">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#F0F0F0] mb-2"
                  >
                    Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                    style={{
                      backgroundColor: INPUT_BACKGROUND_COLOR,
                      borderColor: fieldErrors.message ? "#EF4444" : INPUT_BORDER_COLOR,
                      color: INPUT_TEXT_COLOR,
                      borderWidth: "1px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = fieldErrors.message ? "#EF4444" : INPUT_FOCUS_RING_COLOR;
                      e.target.style.boxShadow = fieldErrors.message 
                        ? `0 0 0 2px #EF444440` 
                        : `0 0 0 2px ${INPUT_FOCUS_RING_COLOR}40`;
                    }}
                    onBlur={(e) => {
                      handleFieldBlur("message", e);
                    }}
                    placeholder="Your message here..."
                  />
                  {fieldErrors.message && (
                    <p className="mt-2 text-sm text-red-500">{fieldErrors.message}</p>
                  )}
                </div>

                {submitSuccess && (
                  <div className="p-4 rounded-md bg-green-500/20 border border-green-500 text-green-400">
                    <p className="font-medium">Thank you for your message! I'll get back to you soon.</p>
                  </div>
                )}
                
                {submitError && (
                  <div className="p-4 rounded-md bg-red-500/20 border border-red-500 text-red-400">
                    <p className="font-medium">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-md transition-all duration-200 ease-in-out text-center font-bold text-[#000000] bg-[#B0A6A4] hover:bg-[#BFBFBF] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? "Sending..." : "Send Message 📧"}
                </button>
              </form>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6 text-[#F0F0F0]">
              Other Ways to Reach Me
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {/* LinkedIn */}
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#B0A6A4] hover:bg-[#BFBFBF] transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-[#000000]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#B0A6A4] hover:bg-[#BFBFBF] transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-[#000000]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#B0A6A4] hover:bg-[#BFBFBF] transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-[#000000]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>

              {/* Phone */}
              <a
                href={SOCIAL_LINKS.phone}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#B0A6A4] hover:bg-[#BFBFBF] transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Phone"
                title="Phone"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-[#000000]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </a>

              {/* Email */}
              <a
                href={SOCIAL_LINKS.email}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#B0A6A4] hover:bg-[#BFBFBF] transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Email"
                title="Email"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-[#000000]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}