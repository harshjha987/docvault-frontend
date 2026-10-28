import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import {
  MdCloudUpload, MdSecurity, MdFolder,
  MdSearch, MdDownload, MdPeople,
} from 'react-icons/md';
import { FiArrowRight } from 'react-icons/fi';

const features = [
  { icon: <MdCloudUpload className="text-3xl text-primary-500" />,  title: 'Cloud Storage',      description: 'Upload and store all your documents securely on AWS S3. Access them from anywhere, anytime.' },
  { icon: <MdSecurity className="text-3xl text-violet-500" />,      title: 'Secure & Private',   description: 'JWT authentication ensures only you can access your files. Every request is verified.' },
  { icon: <MdFolder className="text-3xl text-amber-500" />,         title: 'Folder Organization',description: 'Organize your documents into folders and categories for easy management.' },
  { icon: <MdSearch className="text-3xl text-emerald-500" />,       title: 'Instant Search',     description: 'Find any document instantly by searching through your file names.' },
  { icon: <MdDownload className="text-3xl text-blue-500" />,        title: 'Easy Download',      description: 'Download your files anytime with a single click directly from the dashboard.' },
  { icon: <MdPeople className="text-3xl text-rose-500" />,          title: 'User Ownership',     description: 'Each user owns their files. Nobody else can view, download or delete your documents.' },
];

export default function Landing() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fadeInUp inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            Secure Document Management
          </div>

          <h1 className="animate-fadeInUp text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            <span className="text-gray-900 dark:text-white">Store your docs</span>
            <br />
            <span className="bg-gradient-to-r from-primary-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              safe &amp; simple
            </span>
          </h1>

          <p className="animate-fadeInUp text-lg sm:text-xl text-gray-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            DocVault is your personal document management system. Upload, organize, search, and download your files — all protected with secure authentication and reliable cloud storage.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {token ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-xl shadow-primary-500/25"
              >
                Go to Dashboard
                <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-xl shadow-primary-500/25"
                >
                  Get Started Free
                  <FiArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary-400 dark:hover:border-primary-500 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { number: '100%', label: 'Secure'         },
            { number: '24/7', label: 'Cloud Access'   },
            { number: 'Fast', label: 'File Retrieval' },
            { number: 'S3',   label: 'Cloud Storage'  },
            { number: '⚡',   label: 'Instant Search' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`animate-fadeInUp delay-${(i + 1) * 100} text-center p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800`}
            >
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-500 dark:text-slate-400 text-xs mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              A complete document management solution for all your personal and professional files.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!token && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg mb-8">
              Join and start managing your documents securely today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-xl shadow-primary-500/25"
            >
              Create Free Account
              <FiArrowRight />
            </Link>
          </div>
        </section>
      )}

      <Footer />
      <ScrollToTop />
    </div>
  );
}
