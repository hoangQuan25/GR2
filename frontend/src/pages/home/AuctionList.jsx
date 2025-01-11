// src/pages/home/AuctionList.jsx
import React, { useEffect, useState } from "react";
import AuctionAPI from "../../api/AuctionAPI";
import { useNavigate } from "react-router-dom";

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveAuctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchActiveAuctions = async () => {
    try {
      // GET /auctions/active
      const response = await AuctionAPI.get("/auctions/active");
      setAuctions(response.data);
    } catch (error) {
      console.error("Failed to fetch auctions", error);
    }
  };

  // If you want to navigate on click
  const handleCardClick = (auctionId) => {
    navigate(`/item/${auctionId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Active Auctions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {auctions.map((auction) => {
          // If product.imageData is a Base64 string, build a data URL
          let imageUrl = "https://via.placeholder.com/400x300.png?text=No+Image";
          if (auction.product?.imageData) {
            // If you're sure it's PNG; otherwise, "image/jpeg" or "image/*".
            imageUrl = `data:image/*;base64,${auction.product.imageData}`;
          }

          const estPrice = `$${auction.product.estimatedPriceMin} - $${auction.product.estimatedPriceMax}`;
          const currentBid = auction.currentBid ? `$${auction.currentBid}` : "No bids";
          // If you want a real timeLeft, you'd parse auction.endTime and do a countdown
          const timeLeft = "(Compute from real-time endTime...)";
          const bidsCount = 0; // Or get from /{auctionId}/bids if you wish

          return (
            <div
              key={auction.id}
              className="
                bg-white dark:bg-gray-800 shadow-md rounded-lg 
                overflow-hidden transform hover:scale-105 
                transition-transform duration-300 cursor-pointer
              "
              onClick={() => handleCardClick(auction.id)}
            >
              <img
                src={imageUrl}
                alt={auction.product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-green-800 dark:text-white">
                  {auction.product.title}
                </h3>
                <p className="text-gray-600 dark:text-green-300 mt-2 text-sm">
                  {auction.product.description}
                </p>
                <div className="mt-4 text-gray-800 dark:text-gray-300 text-sm">
                  <p>
                    Est: <span className="font-bold">{estPrice}</span>
                  </p>
                  <p>
                    Current Bid: <span className="font-bold">{currentBid}</span>
                  </p>
                  <p>
                    Bids: <span className="font-bold">{bidsCount}</span>
                  </p>
                </div>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-xs">
                  {timeLeft} left
                </p>
                <button
                  type="button"
                  className="
                    mt-4 w-full bg-green-500 hover:bg-green-600 
                    text-white font-bold py-2 px-4 rounded 
                    transition-colors duration-300
                  "
                >
                  Bid Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuctionList;
