import { useTranslations } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations('Footer');

    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold mb-6">{t('terms_link')}</h1>
            <p className="text-gray-600">
                This is a placeholder for the Terms of Conditions. Content coming soon.
            </p>
        </div>
    );
}
