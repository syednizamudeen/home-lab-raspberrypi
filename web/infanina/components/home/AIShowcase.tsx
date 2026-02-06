import { MessageSquare, Zap, Users } from 'lucide-react';

const AIShowcase = () => {
    return (
        <section id="ai-products" className="py-20 bg-gray-50 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Content Left */}
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                            Intelligent Automation for Growth
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Transform your customer engagement with our AI-powered chatbots. Designed for seamless lead generation, 24/7 support, and instant CRM synchronization.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3 text-blue-600">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Instant Lead Generation</h3>
                                    <p className="text-gray-600">Capture and qualify leads automatically, even when you sleep.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3 text-blue-600">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">24/7 Customer Support</h3>
                                    <p className="text-gray-600">Resolve common queries instantly with AI that understands context.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3 text-blue-600">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Seamless CRM Sync</h3>
                                    <p className="text-gray-600">Automatically push qualified leads to your favorite CRM tools.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chatbot Interface Mockup Right */}
                    <div className="lg:w-1/2 w-full">
                        <div className="relative mx-auto rounded-3xl border border-gray-200 bg-white/40 shadow-2xl backdrop-blur-xl p-4 lg:p-6 glass-card">
                            {/* Chat Header */}
                            <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Infanina Assistant</h4>
                                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                                            <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                                            Online
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="space-y-4 py-6">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">AI</div>
                                    <div className="rounded-2xl rounded-tl-none bg-blue-50 px-4 py-2 text-sm text-gray-800">
                                        Hello! How can I help you automate your business today?
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 flex-row-reverse">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                                    <div className="rounded-2xl rounded-tr-none bg-blue-600 px-4 py-2 text-sm text-white">
                                        I'm looking for a chatbot for my e-commerce store.
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">AI</div>
                                    <div className="rounded-2xl rounded-tl-none bg-blue-50 px-4 py-2 text-sm text-gray-800">
                                        Excellent choice! Our AI chatbots can handle product inquiries, order tracking, and even checkout. would you like to see a demo?
                                    </div>
                                </div>

                                {/* Typing indicator */}
                                <div className="flex items-start gap-3 opacity-50">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">AI</div>
                                    <div className="rounded-2xl rounded-tl-none bg-blue-50 px-4 py-2 text-sm text-gray-800 flex gap-1 items-center">
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
                                        placeholder="Type a message..."
                                        className="w-full rounded-full border border-gray-200 bg-white/50 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
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
import { ArrowRight } from 'lucide-react';
export default AIShowcase;
