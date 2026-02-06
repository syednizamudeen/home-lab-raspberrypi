import { Smartphone, ShoppingBag, Store } from 'lucide-react';

const services = [
    {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile apps that engage your customers on the go.',
        icon: Smartphone,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        title: 'Modern POS Systems',
        description: 'Streamline your retail operations with our cloud-based Point of Sale solutions.',
        icon: Store,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
    },
    {
        title: 'E-Commerce Solutions',
        description: 'Scalable online stores integrated with local payment gateways and logistics.',
        icon: ShoppingBag,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
];

const TechGrid = () => {
    return (
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                        Comprehensive Digital Solutions
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Beyond AI, we build the fundamental digital infrastructure your business needs to thrive.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`inline-flex rounded-xl ${service.bgColor} p-3 mb-6`}>
                                <service.icon className={`h-6 w-6 ${service.color}`} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
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
