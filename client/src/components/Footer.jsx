import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-dark-950/50" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Code2 size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">CodeInsight AI</span>
            </Link>
            <p className="text-dark-300 text-sm leading-relaxed">
              Analyze your code, master every interview. AI-powered complexity analysis and interview prep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-dark-300 text-sm hover:text-white transition-colors">Home</Link>
              <Link to="/register" className="text-dark-300 text-sm hover:text-white transition-colors">Get Started</Link>
              <Link to="/login" className="text-dark-300 text-sm hover:text-white transition-colors">Login</Link>
            </nav>
          </div>

          {/* Built With */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Powered By</h4>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <Sparkles size={14} className="text-accent-purple" />
              <span className="text-sm text-dark-200">Built with Gemini AI</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-dark-400 text-xs">
            © {new Date().getFullYear()} CodeInsight AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
