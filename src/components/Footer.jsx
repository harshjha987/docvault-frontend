import { useState } from "react";
import { Link } from "react-router-dom";
import { MdCloudUpload } from "react-icons/md";
import { FiChevronDown, FiChevronUp, FiGithub, FiLinkedin } from "react-icons/fi";

const faqs = [
  {
    question: "Is DocVault free to use?",
    answer:
      "Yes, DocVault is completely free. Your files are stored securely on AWS S3 and metadata is saved in our database.",
  },
  {
    question: "How secure are my files?",
    answer:
      "All files are stored on AWS S3 with private access. Every request is authenticated using JWT tokens. Only you can access your files.",
  },
  {
    question: "What file types are supported?",
    answer:
      "DocVault supports all file types including PDFs, images, Word documents, Excel sheets, ZIP files and more.",
  },
  {
    question: "Can I organize files into folders?",
    answer:
      "Yes, you can create folders and upload files directly into them. Click on any folder to view its contents.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "Currently the maximum file size is 10MB per file. This limit may be increased in future updates.",
  },
  {
    question: "Can other users see my files?",
    answer:
      "No. Every file is linked to your account. Other users cannot view, download or delete your files.",
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50
dark:hover:bg-gray-800 transition">
        <span className="font-medium text-gray-900 dark:text-white">
          {question}
        </span>
        {open ? (
          <FiChevronUp className="text-primary-500 text-xl flex-shrink-0 ml-4" />
        ) : (
          <FiChevronDown className="text-gray-400 text-xl flex-shrink-0 ml-4" />
        )}
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <>
      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Everything you need to know about DocVault
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

            {/* Brand */}
            <div>
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <MdCloudUpload className="text-primary-500 text-3xl" />
                <span className="font-bold text-xl bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                  DocVault
                </span>
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              A complete document management solution for all your personal and professional files.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h3>
              <div className="flex flex-col gap-2">
                <Link to="/"
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition text-sm">
                  Home
                </Link>
                <a href="#features"
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition text-sm">
                  Features
                </a>
                <Link to="/register"
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition text-sm">
                  Get Started
                </Link>
                <Link to="/login"
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition text-sm">
                  Login
                </Link>
              </div>
            </div>

            {/* Built by */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Built By
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Designed and developed by{" "}
                <span className="font-semibold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                  Harsh
                </span>
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/harshjha987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-500
hover:bg-primary-50 dark:hover:bg-primary-900/20 transition">
                  <FiGithub className="text-xl" />
                </a>
                <a
                  href="https://linkedin.com/in/hrjha987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-500
hover:bg-primary-50 dark:hover:bg-primary-900/20 transition">
                  <FiLinkedin className="text-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between
 gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 DocVault. Built with ❤️ by Harsh
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>All rights reserved.</span>
              {/* <span className="font-medium text-primary-500">Spring Boot</span>
              <span>+</span>
              <span className="font-medium text-purple-500">React</span>
              <span>+</span>
              <span className="font-medium text-yellow-500">AWS S3</span> */}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
