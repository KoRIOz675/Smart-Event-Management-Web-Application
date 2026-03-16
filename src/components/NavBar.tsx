import React, { useState } from 'react';
import Link from 'next/link';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Parcourir', href: '/explore' },
    { name: 'Organisateurs', href: '/organizers' },
    { name: 'Tarifs', href: '/pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
 
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-105 transition">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">SmartEvent</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
              Connexion
            </Link>
            <Link 
              href="/register" 
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
            >
              S'inscrire
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-gray-50">
              <Link 
                href="/login" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg text-center"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                className="block w-full bg-indigo-600 text-white px-3 py-3 rounded-xl text-base font-bold text-center shadow-lg"
                onClick={() => setIsOpen(false)}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;