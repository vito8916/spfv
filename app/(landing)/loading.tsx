import Image from "next/image";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="container mx-auto py-10 px-4 flex justify-center items-center h-screen">
            <Image src="/logo-animado-blanco.gif" alt="Loading" width={100} height={100} />
        </div>
    )
}