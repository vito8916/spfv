import React from 'react';

const FooterRegistrationFlow = () => {
    return (
        <footer>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-t border-gray-300">
                <div className="text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                </div>
                <div className="flex space-x-4">
                    <a href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-800">
                        Privacy Policy
                    </a>
                    <a href="/terms-of-service" className="text-sm text-gray-600 hover:text-gray-800">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default FooterRegistrationFlow;