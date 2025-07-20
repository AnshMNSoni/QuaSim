import { Linkedin, Github, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full py-8 border-t border-gray-200 dark:border-gray-800 mt-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              QuaSim
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              A powerful quantum circuit simulator for building, visualizing, and simulating quantum circuits with an
              interactive interface.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://qiskit.org/documentation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  Qiskit Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://quantum-computing.ibm.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  IBM Quantum
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Quantum_computing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  Learn Quantum Computing
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Connect</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Developed with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-sm text-gray-600 dark:text-gray-400">by</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">Ansh Soni</span>
            </div>
            <div className="flex space-x-2 mt-2">
              <a
                href="https://linkedin.com/in/anshmnsoni/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                aria-label="Ansh Soni's LinkedIn profile"
              >
                <Linkedin className="h-4 w-4 text-white" />
              </a>
              <a
                href="https://github.com/AnshMNSoni/QuaSim.git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-800 hover:bg-gray-900 transition-colors"
                aria-label="QuaSim GitHub repository"
              >
                <Github className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} QuaSim - Quantum Circuit Simulator. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 md:mt-0">
            Built with Next.js, React, and TypeScript
          </p>
        </div>
      </div>
    </footer>
  )
}
