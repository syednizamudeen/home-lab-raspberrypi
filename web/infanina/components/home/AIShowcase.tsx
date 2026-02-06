import { MessageSquare, Zap, Users, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const AIShowcase = () => {
    const t = useTranslations('AIShowcase');

    return (
        <section id="ai-products" className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Content Left */}
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
                            {t('title')}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            {t('subtitle')}
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/40 p-3 text-blue-600 dark:text-blue-400">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div className="ml-4 rtl:mr-4 rtl:ml-0">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('feature_1_title')}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{t('feature_1_desc')}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/40 p-3 text-blue-600 dark:text-blue-400">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div className="ml-4 rtl:mr-4 rtl:ml-0">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('feature_2_title')}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{t('feature_2_desc')}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/40 p-3 text-blue-600 dark:text-blue-400">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="ml-4 rtl:mr-4 rtl:ml-0">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('feature_3_title')}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{t('feature_3_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chatbot Interface Mockup Right */}
                    <div className="lg:w-1/2 w-full">
                        <div className="relative mx-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 shadow-2xl backdrop-blur-xl p-4 lg:p-6 glass-card" dir="ltr">
                            {/* Chat Header */}
                            <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('chatbot_name')}</h4>
                                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                                            <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                                            {t('status')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="space-y-4 py-6">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">AI</div>
                                    <div className="rounded-2xl rounded-tl-none bg-blue-50 dark:bg-gray-700/50 px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                                        {t('msg_hello')}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 flex-row-reverse">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0"></div>
                                    <div className="rounded-2xl rounded-tr-none bg-blue-600 px-4 py-2 text-sm text-white">
                                        {t('msg_user')}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">AI</div>
                                    <div className="rounded-2xl rounded-tl-none bg-blue-50 dark:bg-gray-700/50 px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                                        {t('msg_response')}
                                    </div>
                                </div>

                                {/* Typing indicator */}
                                <div className="flex items-start gap-3 opacity-50">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">AI</div>
                                    <div className="rounded-2xl rounded-tl-none bg-blue-50 dark:bg-gray-700/50 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input */}
                            <div className="mt-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('input_placeholder')}
                                        className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:text-white"
                                        disabled
                                    />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Glass reflection effect */}
                            <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
                            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-blue-400/10 blur-xl"></div>
                        </div>

                        {/* Background elements for depth */}
                        <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-200/30 blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIShowcase;
