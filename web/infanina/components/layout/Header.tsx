"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        Infanina
                    </span>
                </Link>
                <nav className="hidden md:flex gap-8">
                    <Link href="#services" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        Services
                    </Link>
                    <Link href="#ai-products" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        AI Products
                    </Link>
                    <Link href="#about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        About
                    </Link>
                    <Link href="#contact" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        Contact
                    </Link>
                </nav>
                <button
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col gap-4">
                    <Link
                        href="#services"
                        className="text-base font-medium text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
                        onClick={closeMenu}
                    >
                        Services
                    </Link>
                    <Link
                        href="#ai-products"
                        className="text-base font-medium text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
                        onClick={closeMenu}
                    >
                        AI Products
                    </Link>
                    <Link
                        href="#about"
                        className="text-base font-medium text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
                        onClick={closeMenu}
                    >
                        About
                    </Link>
                    <Link
                        href="#contact"
                        className="text-base font-medium text-gray-700 hover:text-blue-600 py-2"
                        onClick={closeMenu}
                    >
                        Contact
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
