import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Hero = () => {
    const t = useTranslations('HomePage');

    return (
        <section className="relative overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-32 dark:bg-gray-950">
            <div className="container mx-auto px-4 text-center">
                <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
                    <span className="block">{t('title_prefix')}</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                        {t('title_suffix')}
                    </span>
                </h1>
                <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300 mb-10">
                    {t('subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/#ai-products"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                    >
                        {t('cta_primary')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:-translate-y-0.5"
                    >
                        <Calendar className="mr-2 h-5 w-5" />
                        {t('cta_secondary')}
                    </Link>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-50/50 dark:bg-blue-900/20 blur-3xl filter" />
        </section>
    );
};

export default Hero;
