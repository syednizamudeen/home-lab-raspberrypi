"use client";

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslations } from 'next-intl';

import ThemeToggle from '../ThemeToggle';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = useTranslations('Navigation');

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        Infanina
                    </span>
                </Link>
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/#services" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {t('services')}
                    </Link>
                    <Link href="/#ai-products" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {t('products')}
                    </Link>
                    <Link href="/#about" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {t('about')}
                    </Link>
                    <Link href="/#contact" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {t('contact')}
                    </Link>
                    <div className="flex items-center gap-2 border-s border-gray-200 dark:border-gray-800 ps-4">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                </nav>
                <div className="flex md:hidden items-center gap-3">

                    <LanguageSwitcher />
                    <button
                        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg py-4 px-4 flex flex-col gap-4">
                    <Link
                        href="/#services"
                        className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-100 dark:border-gray-800"
                        onClick={closeMenu}
                    >
                        {t('services')}
                    </Link>
                    <Link
                        href="/#ai-products"
                        className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-100 dark:border-gray-800"
                        onClick={closeMenu}
                    >
                        {t('products')}
                    </Link>
                    <Link
                        href="/#about"
                        className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-100 dark:border-gray-800"
                        onClick={closeMenu}
                    >
                        {t('about')}
                    </Link>
                    <Link
                        href="/#contact"
                        className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2"
                        onClick={closeMenu}
                    >
                        {t('contact')}
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
