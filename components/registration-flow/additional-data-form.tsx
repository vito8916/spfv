import React from 'react';

const AdditionalDataForm = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Additional Data</h1>
            <form className="space-y-4">
                {/*town/city*/}
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input type="text" id="city" name="city" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"/>
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" id="address" name="address" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" id="phone" name="phone" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"/>
                </div>
                {/*postcode*/}
                <div>
                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">Postcode</label>
                    <input type="text" id="postcode" name="postcode" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"/>
                </div>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">Submit</button>
            </form>
        </div>
    );
};

export default AdditionalDataForm;