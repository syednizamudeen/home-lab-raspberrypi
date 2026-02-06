import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
    const t = useTranslations('Footer');

    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold mb-6">{t('privacy_link')}</h1>
            <p className="text-gray-600">
                This is a placeholder for the Privacy Policy. Content coming soon.
            </p>
        </div>
    );
}
