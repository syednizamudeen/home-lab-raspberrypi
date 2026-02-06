const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-200 bg-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Infanina Pte Ltd</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            Empowering Singapore SMEs with intelligent digital solutions.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-gray-900 uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>UEN: 202XXXXXX-X</li>
                            <li>Email: <a href="mailto:hello@infanina.com" className="hover:text-blue-600">hello@infanina.com</a></li>
                            <li>Phone: +65 0000 0000</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-gray-900 uppercase tracking-wider">Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#services" className="hover:text-blue-600">Services</a></li>
                            <li><a href="#ai-products" className="hover:text-blue-600">AI Products</a></li>
                            <li><a href="#about" className="hover:text-blue-600">About</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} Infanina Pte Ltd. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
