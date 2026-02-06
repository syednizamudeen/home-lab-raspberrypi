import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-32">
            <div className="container mx-auto px-4 text-center">
                <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
                    <span className="block">Infanina: Your Partner in</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                        AI & Custom Software
                    </span>
                </h1>
                <p className="mx-auto max-w-2xl text-xl text-gray-600 mb-10">
                    Empowering Singapore SMEs with intelligent Chatbot automation, custom SaaS solutions, and seamless digital experiences.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="#ai-products"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                    >
                        Get Started / View AI Solutions
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        href="#contact"
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all hover:-translate-y-0.5"
                    >
                        <Calendar className="mr-2 h-5 w-5" />
                        Book a Consultation
                    </Link>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-50/50 blur-3xl filter" />
        </section>
    );
};

export default Hero;
