import React from 'react';
import NavbarRegistrationFlow from "@/components/registration-flow/navbar";
import FooterRegistrationFlow from "@/components/registration-flow/footer";

const LayoutRegistrationFlow = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <header className="container mx-auto px-4">
                <NavbarRegistrationFlow />
            </header>
            <main className="flex flex-col items-center justify-center min-h-screen bg-background-secondary">
                <div className="container mx-auto p-4">
                    {children}
                </div>
            </main>
            <FooterRegistrationFlow />
        </>
    );
};

export default LayoutRegistrationFlow;