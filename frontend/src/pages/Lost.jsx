import React, { useState } from "react";

const Lost = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    contactInfo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Lost Item Report:", formData);

    // Reset form after submission
    setFormData({
      itemName: "",
      description: "",
      contactInfo: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Report Lost Item
        </h1>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Name Field */}
            <div>
              <label
                htmlFor="itemName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Item Name *
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
                placeholder="e.g., iPhone 13, Backpack, Wallet"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Please provide details like color, brand, where you lost it, when you lost it, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
              />
            </div>

            {/* Contact Info Field */}
            <div>
              <label
                htmlFor="contactInfo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contact Information *
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                placeholder="Email or phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 px-6 rounded-md font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 transform hover:scale-105"
              >
                Submit Lost Item Report
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Tip:</span> The more details you
              provide, the better chance someone can identify and return your
              item!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lost;
