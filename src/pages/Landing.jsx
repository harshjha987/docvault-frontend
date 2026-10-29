import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import {
  MdCloudUpload, MdSecurity, MdFolder,
  MdSearch, MdDownload, MdPeople,
} from 'react-icons/md';
import {
  BsFileEarmarkPdf, BsFileEarmarkImage,
  BsFileEarmarkWord, BsFileEarmarkZip,
} from 'react-icons/bs';
import { FiArrowRight } from 'react-icons/fi';
import { MdShare, MdDownload as MdDl } from 'react-icons/md';

const features = [
  { icon: <MdCloudUpload className="text-2xl text-primary-500" />,  bg: 'bg-primary-50 dark:bg-primary-500/10', title: 'Cloud Storage',       description: 'Upload and store all your documents securely on AWS S3. Access them from anywhere, anytime.' },
  { icon: <MdSecurity className="text-2xl text-violet-500" />,      bg: 'bg-violet-50 dark:bg-violet-500/10',   title: 'Secure & Private',    description: 'JWT authentication ensures only you can access your files. Every request is verified.' },
  { icon: <MdFolder className="text-2xl text-amber-500" />,         bg: 'bg-amber-50 dark:bg-amber-500/10',     title: 'Folder Organization', description: 'Organize your documents into folders and categories for easy management.' },
  { icon: <MdSearch className="text-2xl text-emerald-500" />,       bg: 'bg-emerald-50 dark:bg-emerald-500/10', title: 'Instant Search',      description: 'Find any document instantly by searching through your file names.' },
  { icon: <MdDownload className="text-2xl text-blue-500" />,        bg: 'bg-blue-50 dark:bg-blue-500/10',       title: 'Easy Download',       description: 'Download your files anytime with a single click directly from the dashboard.' },
  { icon: <MdPeople className="text-2xl text-rose-500" />,          bg: 'bg-rose-50 dark:bg-rose-500/10',       title: 'User Ownership',      description: 'Each user owns their files. Nobody else can view, download or delete your documents.' },
];

const mockFiles = [
  { icon: <BsFileEarmarkPdf className="text-red-500" />,    name: 'Project Report.pdf',  size: '2.4 MB' },
  { icon: <BsFileEarmarkImage className="text-blue-400" />, name: 'Design Assets.png',   size: '4.1 MB' },
  { icon: <BsFileEarmarkWord className="text-blue-600" />,  name: 'Meeting Notes.docx',  size: '340 KB' },
  { icon: <BsFileEarmarkZip className="text-yellow-500" />, name: 'Source Code.zip',     size: '8.2 MB' },
];

function MockDashboard() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute inset-0 bg-primary-500/15 dark:bg-primary-500/20 blur-3xl rounded-3xl" />
      <div className="relative bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800/50">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-gray-400 dark:text-slate-400 font-medium">DocVault — Dashboard</span>
        </div>

        <div className="p-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Files',   value: '24',    color: 'text-primary-500 dark:text-primary-400' },
              { label: 'Storage', value: '1.2 GB', color: 'text-violet-500 dark:text-violet-400'  },
              { label: 'Folders', value: '6',     color: 'text-amber-500 dark:text-amber-400'    },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 dark:bg-slate-800/80 rounded-xl p-3 border border-gray-100 dark:border-slate-700/50">
                <p className={`text-base font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/50 rounded-xl px-3 py-2 mb-4">
            <MdSearch className="text-gray-400 dark:text-slate-500 text-base shrink-0" />
            <span className="text-xs text-gray-400 dark:text-slate-500">Search files...</span>
          </div>

          {/* Files */}
          <div className="space-y-2">
            {mockFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/40 rounded-xl px-3 py-2.5 hover:border-primary-300 dark:hover:border-primary-500/30 transition">
                <div className="text-lg shrink-0">{file.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-slate-200 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{file.size}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700/80 rounded-lg flex items-center justify-center">
                    <MdShare className="text-gray-400 dark:text-slate-400 text-xs" />
                  </div>
                  <div className="w-6 h-6 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <MdDl className="text-primary-500 dark:text-primary-400 text-xs" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 bg-gradient-to-br from-primary-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400/10 dark:bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 dark:block hidden" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 dark:hidden block" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="animate-fadeInUp inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-full text-xs font-semibold mb-6 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                Secure Document Management
              </div>

              <h1 className="animate-fadeInUp text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                Your documents,
                <br />
                <span className="bg-gradient-to-r from-primary-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                  safe &amp; organized.
                </span>
              </h1>

              <p className="animate-fadeInUp text-gray-600 dark:text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
                DocVault is your personal document management system. Upload, organize, search, and download files — protected with JWT authentication and AWS S3 cloud storage.
              </p>

              <div className="animate-fadeInUp flex flex-col sm:flex-row gap-3">
                {token ? (
                  <Link to="/dashboard" className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-7 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-primary-500/25">
                    Go to Dashboard <FiArrowRight />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-7 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-primary-500/25">
                      Get Started Free <FiArrowRight />
                    </Link>
                    <Link to="/login" className="flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white px-7 py-3.5 rounded-xl font-semibold transition bg-white/50 dark:bg-transparent">
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              <div className="animate-fadeInUp flex flex-wrap gap-4 mt-8">
                {['JWT Secured', 'AWS S3', 'Google OAuth', 'Open Source'].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — mock UI */}
            <div className="animate-fadeInUp delay-300 hidden lg:block">
              <MockDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { number: '100%', label: 'Secure Storage' },
            { number: '24/7', label: 'Cloud Access'   },
            { number: 'Fast', label: 'File Retrieval' },
            { number: '⚡',   label: 'Instant Search' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm text-gray-500 dark:text-slate-400 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-xs font-semibold mb-4 uppercase tracking-widest">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need
            </h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
              A complete document management solution for all your personal and professional files.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
                <div className={`w-11 h-11 ${feature.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!token && (
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-violet-600 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 dark:bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 dark:bg-violet-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-primary-100 dark:text-slate-400 text-lg mb-8">
              Join and start managing your documents securely today. Free forever.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-xl font-semibold text-lg transition shadow-xl dark:bg-primary-500 dark:text-white dark:hover:bg-primary-600"
            >
              Create Free Account <FiArrowRight />
            </Link>
          </div>
        </section>
      )}

      <Footer />
      <ScrollToTop />
    </div>
  );
}
