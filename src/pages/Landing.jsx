import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer"
import {
  MdCloudUpload,
  MdSecurity,
  MdFolder,
  MdSearch,
  MdDownload,
  MdPeople,
} from 'react-icons/md';
import { FiArrowRight } from 'react-icons/fi';

const features = [
  {
    icon: <MdCloudUpload className="text-4xl text-primary-500" />,
    title: 'Cloud Storage',
    description:
      'Upload and store all your documents securely on AWS S3. Access them from anywhere, anytime.',
  },
  {
    icon: <MdSecurity className="text-4xl text-purple-500" />,
    title: 'Secure & Private',
    description:
      'JWT authentication ensures only you can access your files. Every request is verified.',
  },
  {
    icon: <MdFolder className="text-4xl text-yellow-500" />,
    title: 'Folder Organization',
    description:
      'Organize your documents into folders and categories for easy management.',
  },
  {
    icon: <MdSearch className="text-4xl text-green-500" />,
    title: 'Instant Search',
    description:
      'Find any document instantly by searching through your file names.',
  },
  {
    icon: <MdDownload className="text-4xl text-blue-500" />,
    title: 'Easy Download',
    description:
      'Download your files anytime with a single click directly from the dashboard.',
  },
  {
    icon: <MdPeople className="text-4xl text-red-500" />,
    title: 'User Ownership',
    description:
      'Each user owns their files. Nobody else can view, download or delete your documents.',
  },
];

export default function Landing() {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className=" animate-fadeInUp inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600
  dark:text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            Secure Document Management
          </div>

          {/* Heading */}
          <h1 className="animate-fadeInUp text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-gray-900 dark:text-white">
              Store your docs
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              safe & simple
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fadeInUp text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            DocVault is your personal document management system. Upload,
            organize, search, and download your files—all protected with secure
            authentication and reliable cloud storage
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
    {token ? (
      <Link
        to="/dashboard"
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-8 py-4
  rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg">
        Go to Dashboard
        <FiArrowRight />
      </Link>
    ) : (
      <>
        <Link
          to="/register"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-8 py-4
  rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg shadow-primary-500/25">
          Get Started Free
          <FiArrowRight />
        </Link>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700
  dark:text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary-500 transition">
          Login
        </Link>
      </>
    )}
  </div>
        </div>

        {/* Hero Image / Stats */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-5 gap-6">
          {[
            { number: '100%', label: 'Secure' },
            { number: '24/7', label: 'Cloud Access' },
            { number: 'Fast', label: 'File Retrieval' },
            { number: 'Cloud', label: 'Anywhere Access' },
            { number: 'Instant', label: 'Search' }
          ].map((stat, i) => (
            <div
              key={i}
              className={`animate-fadeInUp delay-${
                (i + 4) * 100
              } text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800`}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
            A complete document management solution for all your personal and professional files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg
  hover:border-primary-200 dark:hover:border-primary-800 transition duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
            Join and start managing your documents securely today.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-8 py-4
  rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg"
          >
            Create Free Account
            <FiArrowRight />
          </Link>
        </div>
      </section>
              <Footer />
      <ScrollToTop />
    </div>
  );
}
