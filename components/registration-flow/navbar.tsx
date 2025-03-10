import Logo from "@/components/logo";
import Link from "next/link";

const NavbarRegistrationFlow = () => {
    return (
        <nav className="flex items-center justify-between py-6 px-6 bg-white shadow-md">
            <div className="flex items-center">
                <Logo/>
            </div>
            <ul className="flex space-x-4">
                <li><Link href="/account-confirmation">Account Confirmation</Link></li>
                <li><Link href="/additional-data">Additional Data</Link></li>
                <li><Link href="/agreements">Agreements</Link></li>
            </ul>
            <div className="flex items-center">
                <a href="/logout" className="text-blue-500 hover:underline">Logout</a>
            </div>
        </nav>
    );
};

export default NavbarRegistrationFlow;