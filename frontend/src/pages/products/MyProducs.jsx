// src/pages/products/MyProducts.jsx
import React, { useEffect, useState, useContext } from "react";
import AuctionAPI from "../../api/AuctionAPI";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const MyProducts = () => {
  const { auth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [auctionForm, setAuctionForm] = useState({
    startTime: "",
    endTime: "",
    startBid: "",
    bidIncrement: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyProducts = async () => {
    try {
      // GET /products/user/{ownerId}
      const res = await AuctionAPI.get(`/products/user/${auth.user.id}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await AuctionAPI.delete(`/products/${productId}`);
      fetchMyProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // Auction Modal
  const openAuctionModal = (product) => {
    setSelectedProduct(product);
    setShowAuctionModal(true);
  };

  const closeAuctionModal = () => {
    setShowAuctionModal(false);
    setSelectedProduct(null);
  };

  const handleAuctionFormChange = (e) => {
    const { name, value } = e.target;
    setAuctionForm((prev) => ({ ...prev, [name]: value }));
  };

  const startAuction = async () => {
    if (!selectedProduct) return;
    try {
      await AuctionAPI.post("/auctions/start", null, {
        params: {
          productId: selectedProduct.id,
          startTimeStr: auctionForm.startTime,
          endTimeStr: auctionForm.endTime,
          startBid: auctionForm.startBid,
          bidIncrement: auctionForm.bidIncrement,
        },
      });
      alert("Auction started!");
      closeAuctionModal();
    } catch (err) {
      console.error("Failed to start auction:", err);
      alert("Cannot start auction.");
    }
  };

  const handleCardClick = (productId) => {
    // Navigate to product detail page
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-white">My Products</h2>
      <div className="mb-4">
        <Link
          to="/add-product"
          className="inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => {
            // If p.imageData is a Base64 string, we can build a data URL:
            let imageUrl = "https://via.placeholder.com/150?text=No+Image";
            if (p.imageData) {
              imageUrl = `data:image/*;base64,${p.imageData}`;
              // or if you have different file types, use something like:
              // `data:image/jpeg;base64, ...` or `data:image/*;base64, ...`
            }

            return (
              <div
                key={p.id}
                className="border rounded shadow overflow-hidden cursor-pointer
                           transition-transform transform hover:scale-105
                           bg-white"
                onClick={() => handleCardClick(p.id)}
              >
                <div className="p-4 flex flex-col items-center">
                  <img
                    src={imageUrl}
                    alt={p.title}
                    className="w-32 h-32 object-cover mb-2"
                  />
                  <h3 className="font-bold mb-2 text-center">{p.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 text-center">
                    Est: ${p.estimatedPriceMin} - ${p.estimatedPriceMax}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <Link
                      to={`/add-product/${p.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAuctionModal(p);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Start Auction
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAuctionModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-2">
              Start Auction for {selectedProduct.title}
            </h3>
            <div className="mb-2">
              <label className="block font-medium">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={auctionForm.startTime}
                onChange={handleAuctionFormChange}
                className="border w-full p-1"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={auctionForm.endTime}
                onChange={handleAuctionFormChange}
                className="border w-full p-1"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Start Bid</label>
              <input
                type="number"
                name="startBid"
                value={auctionForm.startBid}
                onChange={handleAuctionFormChange}
                className="border w-full p-1"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Bid Increment</label>
              <input
                type="number"
                name="bidIncrement"
                value={auctionForm.bidIncrement}
                onChange={handleAuctionFormChange}
                className="border w-full p-1"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={startAuction}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Confirm
              </button>
              <button
                onClick={closeAuctionModal}
                className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
