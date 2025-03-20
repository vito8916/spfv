import React from 'react';
import Link from "next/link";

const ErrorPage = () => {
    return (
        <div>
            Something went wrong. Please try again later or return to the
            <Link href="/">home page</Link>.
        </div>
    );
};

export default ErrorPage;