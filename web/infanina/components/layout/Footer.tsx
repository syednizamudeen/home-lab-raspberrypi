import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const Footer = () => {
    const t = useTranslations('Footer');
    const tNav = useTranslations('Navigation');

    return (
        <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Infanina Pte Ltd</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {t('company_desc')}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white uppercase tracking-wider">{t('contact_title')}</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>Email: <a href="mailto:hello@infanina.com" className="hover:text-blue-600 dark:hover:text-blue-400">hello@infanina.com</a></li>
                            <li>Phone: +65 0000 0000</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white uppercase tracking-wider">{t('links_title')}</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link href="/#services" className="hover:text-blue-600 dark:hover:text-blue-400">{tNav('services')}</Link></li>
                            <li><Link href="/#ai-products" className="hover:text-blue-600 dark:hover:text-blue-400">{tNav('products')}</Link></li>
                            <li><Link href="/#about" className="hover:text-blue-600 dark:hover:text-blue-400">{tNav('about')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 order-2 md:order-1 text-center md:text-left">
                        <p>
                            {t('reg_no')}
                        </p>
                        <span className="hidden md:inline text-gray-300 dark:text-gray-700">|</span>
                        <p>
                            {t('copyright', {
                                year: new Date().getFullYear().toString()
                            })}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 order-1 md:order-2">
                        <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {t('privacy_link')}
                        </Link>
                        <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {t('terms_link')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
