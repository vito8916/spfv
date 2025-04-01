import React from 'react';

const NotFound = () => {
    return (
        <div>
            <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-6">Page not found</h2>
                <p className="text-muted-foreground mb-8">
                    The page you are looking for doesn&#39;t exist or has been moved.
                </p>
            </div>
        </div>
    );
};

export default NotFound;