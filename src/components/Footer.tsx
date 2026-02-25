// src/components/Footer.tsx
import { useState } from 'react';
import { Heart, X } from 'lucide-react';

interface PopupContent {
  title: string;
  description: string;
}

export function Footer() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<PopupContent>({ title: '', description: '' });

  const handleLinkClick = (e: React.MouseEvent, title: string, description: string) => {
    e.preventDefault();
    setPopupContent({ title, description });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const links = [
    { label: 'Terms', title: 'Terms of Service', desc: 'Our terms of service outline the rules and guidelines for using our platform. By using Relay Panel, you agree to comply with these terms.' },
    { label: 'Privacy', title: 'Privacy Policy', desc: 'We take your privacy seriously. Learn about how we collect, use, and protect your personal information when you use our services.' },
    { label: 'Security', title: 'Security', desc: 'We implement industry-standard security measures to protect your data. Learn about our security practices and how we keep your information safe.' },
    { label: 'Status', title: 'System Status', desc: 'Check the current status of our services. We provide real-time updates on any incidents or maintenance that may affect your experience.' },
    { label: 'Docs', title: 'Documentation', desc: 'Comprehensive guides and API documentation to help you integrate and use Relay Panel effectively in your projects.' },
    { label: 'Community', title: 'Community', desc: 'Join our community of developers and users. Get help, share ideas, and collaborate on projects using Relay Panel.' },
    { label: 'Contact', title: 'Contact Us', desc: 'Have questions or need support? Reach out to our team and we\'ll get back to you as soon as possible.' },
    { label: 'Manage cookies', title: 'Cookie Settings', desc: 'Customize your cookie preferences. Learn about the cookies we use and how they enhance your browsing experience.' },
    { label: 'Do not share my personal information', title: 'Privacy Preferences', desc: 'Control how your personal information is shared. You can opt out of data sharing for certain purposes.' },
  ];

  return (
    <>
      <footer className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            {/* Copyright */}
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} Relay Panel.</span>
              <span className="hidden sm:inline">Dibuat dengan</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">oleh Sadri.</span>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href="#"
                  onClick={(e) => handleLinkClick(e, link.title, link.desc)}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePopup}
          />
          
          {/* Modal Content */}
          <div className="relative bg-slate-800 rounded-lg border border-slate-700 max-w-md w-full p-6 shadow-xl">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-3">
              {popupContent.title}
            </h3>
            
            <p className="text-gray-300 mb-6">
              {popupContent.description}
            </p>
            
            <button
              onClick={closePopup}
              className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}