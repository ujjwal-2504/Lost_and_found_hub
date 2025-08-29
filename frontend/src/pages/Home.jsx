import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ItemModal from "../components/ItemModal";
import LostItemForm from "../components/LostItemForm";
import { getItems } from "../services/itemService";
import useToast from "../hooks/useToast";

const Home = () => {
  const { toast } = useToast();

  // Tab state
  const [activeTab, setActiveTab] = useState("browse");

  // Modal state
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Items state
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent found items on component mount
  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const items = await getItems();
        // Get only the 6 most recent found items for the home page
        const foundItems = items
          .filter(
            (item) => item.status === "approved" || item.status === "found"
          )
          .slice(0, 6);
        setRecentItems(foundItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "browse") {
      fetchRecentItems();
    }
  }, [activeTab]);

  // Handle new lost item submission
  const handleNewLostItem = (formData) => {
    // Create new item object with temporary ID
    const newItem = {
      _id: Date.now().toString(), // Temporary ID
      title: formData.name,
      description: formData.description,
      location: formData.location,
      date: formData.dateLost,
      category: "Lost Item",
      status: "submitted",
      priority: false,
      image: formData.image ? URL.createObjectURL(formData.image) : null,
      type: "lost",
    };

    // Add to items list (at beginning)
    setRecentItems((prevItems) => [newItem, ...prevItems]);

    // Switch back to browse tab
    setActiveTab("browse");

    // Show success toast
    toast({
      type: "SUCCESS",
      message: "Lost item posted successfully!",
    });
  };

  // Handle item card click - open modal
  const handleItemClick = (item) => {
    setSelectedItem({ ...item, type: "found" }); // Add type for modal logic
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Handle claim request
  const handleClaimRequest = (item) => {
    alert(`Claim request submitted for ${item.title || item.name}`);
    handleModalClose();
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Lost & Found Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Reuniting lost items with their owners in our college community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/found"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                Browse Found Items
              </Link>
              <Link
                to="/submit-found"
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
              >
                Report Found Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "browse"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => setActiveTab("post")}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "post"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Post Lost Item
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "browse" ? (
          // Browse Items Tab
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Recent Items
              </h2>
              <p className="text-gray-600 text-lg">
                Check out the latest items and lost item reports
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading recent items...</p>
              </div>
            ) : recentItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {recentItems.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
                  >
                    {/* Item Image */}
                    {item.image ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-4xl">📦</div>
                      </div>
                    )}

                    {/* Item Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.priority && (
                          <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            PRIORITY
                          </span>
                        )}
                        {item.type === "lost" && (
                          <span className="ml-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                            LOST
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        <span>{formatDate(item.date)}</span>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                        {item.description}
                      </p>

                      {item.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Recent Items
                </h3>
                <p className="text-gray-600 mb-6">
                  Be the first to help by reporting a found item!
                </p>
                <Link
                  to="/submit-found"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Report Found Item
                </Link>
              </div>
            )}

            {/* View More Button */}
            {recentItems.length > 0 && (
              <div className="text-center">
                <Link
                  to="/found"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  View All Found Items
                </Link>
              </div>
            )}
          </div>
        ) : (
          // Post Lost Item Tab
          <div>
            <LostItemForm onSubmit={handleNewLostItem} />
          </div>
        )}
      </div>

      {/* How It Works Section - Always visible */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Simple steps to reunite lost items with their owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find or Report</h3>
              <p className="text-gray-600">
                Found something? Report it. Lost something? Browse our listings.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✋</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Claim Item</h3>
              <p className="text-gray-600">
                Provide proof of ownership to claim your lost item safely.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Reunited</h3>
              <p className="text-gray-600">
                Admin verification ensures safe return of items to rightful
                owners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Item Modal */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        item={selectedItem}
        onClaim={handleClaimRequest}
      />
    </div>
  );
};

export default Home;
