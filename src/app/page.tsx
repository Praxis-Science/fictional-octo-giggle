import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Research Collaboration Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
            A minimal platform for research authors to create and manage calls for co-authors.
            Connect, collaborate, and publish together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              href="/login"
              className="px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Sign in with Discord
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 py-16">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="h-14 w-14 mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Research Calls</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate research collaboration calls with detailed information about your project.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="h-14 w-14 mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" x2="22" y1="12" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Share on Discord</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatically post your calls to Discord channels and reach potential collaborators.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="h-14 w-14 mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Manage Co-authors</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Review and manage co-author applications with an intuitive dashboard.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 w-12 h-12 flex items-center justify-center mb-4">
                <span className="font-bold">1</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Sign in with Discord</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 w-12 h-12 flex items-center justify-center mb-4">
                <span className="font-bold">2</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Create a research call</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 w-12 h-12 flex items-center justify-center mb-4">
                <span className="font-bold">3</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Share unique URL</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 w-12 h-12 flex items-center justify-center mb-4">
                <span className="font-bold">4</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Review co-author applications</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 py-8 mt-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Research Collaboration Platform
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Privacy
              </Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
