import React from 'react';

const AgreementsPage = () => {
    return (
        <div>
            {/*agreements cards*/}
            <h1 className="text-2xl font-bold mb-4">Agreements</h1>
            <div className="space-y-4">
                <div className="p-4 border rounded-md shadow-md bg-white">
                    <h2 className="text-lg font-semibold">Agreement 1</h2>
                    <p className="text-gray-700">Details about Agreement 1...</p>
                    <input type={"checkbox"} className="mr-2"/>
                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Accept
                    </button>
                </div>
                <div className="p-4 border rounded-md shadow-md bg-white">
                    <h2 className="text-lg font-semibold">Agreement 2</h2>
                    <p className="text-gray-700">Details about Agreement 2...</p>
                    <input type={"checkbox"} className="mr-2"/>
                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Accept
                    </button>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600">Continue
                </button>
            </div>
        </div>
    );
};

export default AgreementsPage;