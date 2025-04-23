import Link from 'next/link';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="container mx-auto px-4 text-center ">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-6">Page not found</h2>
                <p className="text-muted-foreground mb-8">
                    The page you are looking for doesn&#39;t exist or has been moved.
                </p>
                <Link href="/dashboard" className="text-primary">
                    Go back to the dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;