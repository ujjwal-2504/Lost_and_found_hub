import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 text-center mb-8">
          About Lost & Found Hub
        </h1>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            This platform helps students report lost items, claim found items,
            and earn Good Samaritan Points for helping others. Our goal is to
            make the campus a more connected and caring community.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Report Lost or Found Items
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Easily submit detailed reports of items you've lost or found on
                campus with descriptions and locations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Verify Ownership with Identifiers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Use unique identifiers, serial numbers, or personal details to
                verify true ownership of claimed items.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Earn Points and Badges for Successful Returns
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get rewarded with Good Samaritan Points and special badges when
                you help reunite items with their owners.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center mt-12">
          <p className="text-gray-600 italic max-w-2xl mx-auto">
            "Building a stronger campus community, one returned item at a time."
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
