import { Smartphone, ShoppingBag, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';

const TechGrid = () => {
    const t = useTranslations('TechGrid');

    const services = [
        {
            title: t('service_1_title'),
            description: t('service_1_desc'),
            icon: Smartphone,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/40',
        },
        {
            title: t('service_2_title'),
            description: t('service_2_desc'),
            icon: Store,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/40',
        },
        {
            title: t('service_3_title'),
            description: t('service_3_desc'),
            icon: ShoppingBag,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/40',
        },
    ];

    return (
        <section id="services" className="py-20 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="group relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`inline-flex rounded-xl ${service.bgColor} p-3 mb-6`}>
                                <service.icon className={`h-6 w-6 ${service.color}`} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechGrid;
