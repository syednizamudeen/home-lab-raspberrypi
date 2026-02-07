'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useState, useRef, useEffect, useTransition } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', name: 'English', label: 'EN' },
        { code: 'ms', name: 'Bahasa Melayu', label: 'MS' },
        { code: 'zh', name: '简体中文', label: 'ZH' },
        { code: 'ta', name: 'தமிழ்', label: 'TA' },
        { code: 'ar', name: 'العربية', label: 'AR' }
    ];

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    const onSelectChange = (nextLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
            setIsOpen(false);
        });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300 group"
            >
                <div className="p-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{currentLanguage.name}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 sm:hidden">{currentLanguage.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`
            absolute end-0 mt-2 w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transform transition-all duration-300 ltr:origin-top-right rtl:origin-top-left z-50
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
        `}>
                <div className="p-1.5">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onSelectChange(lang.code)}
                            disabled={isPending}
                            className={`
                            w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                            ${locale === lang.code
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
                        `}
                        >
                            <span className="flex items-center gap-3">
                                {lang.name}
                            </span>
                            {locale === lang.code && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
