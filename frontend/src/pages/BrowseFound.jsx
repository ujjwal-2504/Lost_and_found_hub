import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getItems } from "../services/itemService";
import ItemCard from "../components/ItemCard";

const BrowseFound = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All",
    "Electronics",
    "Documents",
    "Books",
    "Clothes",
    "Accessories",
    "Other",
  ];

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Apply filters when items or filters change
  useEffect(() => {
    applyFilters();
  }, [items, selectedCategory, priorityOnly, searchTerm]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getItems();

      // Filter to show only approved/found items (not submitted)
      const publicItems = data.filter(
        (item) =>
          item.status && !["submitted"].includes(item.status.toLowerCase())
      );

      setItems(publicItems);
    } catch (err) {
      setError(err.message || "Failed to fetch items");
      console.error("Fetch items error:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Priority filter
    if (priorityOnly) {
      filtered = filtered.filter((item) => item.priority === true);
    }

    // Search filter (title and location)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          (item.location && item.location.toLowerCase().includes(searchLower))
      );
    }

    setFilteredItems(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading found items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchItems}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Browse Found Items
          </h1>
          <p className="text-gray-600">
            Find your lost belongings from items reported by helpful community
            members
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Items
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={priorityOnly}
                  onChange={(e) => setPriorityOnly(e.target.checked)}
                  className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Show priority items only
                </span>
              </label>
            </div>

            {/* Search Filter */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "All" || priorityOnly
                ? "Try adjusting your filters to see more results."
                : "No found items have been reported yet."}
            </p>
            <Link
              to="/submit-found"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Report Found Item
            </Link>
          </div>
        )}

        {/* Results Count */}
        {filteredItems.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredItems.length} of {items.length} found items
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseFound;
