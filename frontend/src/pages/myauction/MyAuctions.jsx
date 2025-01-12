// src/pages/auctions/MyAuctions.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuctionAPI from "../../api/AuctionAPI";
import UserAPI from "../../api/UserAPI";
import { AuthContext } from "../../context/AuthContext";
import getStatusColor from "../../utils/StatusColor";

const MyAuctions = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myAuctions, setMyAuctions] = useState([]);
  const [winnerMap, setWinnerMap] = useState({});

  // For "Restart Auction" modal
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [restartForm, setRestartForm] = useState({
    startTime: "",
    endTime: "",
    startBid: "",
    bidIncrement: "",
  });

  useEffect(() => {
    fetchMyAuctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyAuctions = async () => {
    try {
      const res = await AuctionAPI.get(`/auctions/my?ownerId=${auth.user.id}`);
      setMyAuctions(res.data);
      loadWinnerNames(res.data);
    } catch (err) {
      console.error("Error fetching my auctions:", err);
    }
  };

  const loadWinnerNames = async (auctions) => {
    const uniqueUserIds = new Set();
    auctions.forEach((a) => {
      if (a.highestBidderId) {
        uniqueUserIds.add(a.highestBidderId);
      }
    });

    const map = {};
    // For each user ID, do /api/user/{id}
    for (const userId of uniqueUserIds) {
      try {
        const resp = await UserAPI.get(`/user/${userId}`);
        const user = resp.data;
        map[userId] = user.firstName + " " + user.lastName;
      } catch (error) {
        console.error("Cannot fetch user:", userId);
      }
    }

    setWinnerMap(map);
  };

  const handleCancel = async (auctionId) => {
    if (!window.confirm("Are you sure you want to cancel this auction?"))
      return;
    try {
      await AuctionAPI.post(`/auctions/${auctionId}/cancel`);
      fetchMyAuctions();
    } catch (err) {
      console.error("Failed to cancel auction:", err);
    }
  };

  const handleEnd = async (auctionId) => {
    if (!window.confirm("Are you sure you want to end this auction?")) return;
    try {
      await AuctionAPI.post(`/auctions/${auctionId}/end`);
      fetchMyAuctions();
    } catch (err) {
      console.error("Failed to end auction:", err);
    }
  };

  // Open the Restart Modal for an ended/canceled auction
  const openRestartAuctionModal = (auction) => {
    setSelectedAuction(auction);
    setRestartForm({
      startTime: "",
      endTime: "",
      startBid: "",
      bidIncrement: "",
    });
    setShowRestartModal(true);
  };

  const closeRestartModal = () => {
    setShowRestartModal(false);
    setSelectedAuction(null);
  };

  const handleRestartFormChange = (e) => {
    const { name, value } = e.target;
    setRestartForm((prev) => ({ ...prev, [name]: value }));
  };

  // Actually restart the auction (create a new Auction record for the same product)
  const restartAuction = async () => {
    if (!selectedAuction) return;
    try {
      await AuctionAPI.post("/auctions/start", null, {
        params: {
          productId: selectedAuction.product.id, // The same product
          startTimeStr: restartForm.startTime,
          endTimeStr: restartForm.endTime,
          startBid: restartForm.startBid,
          bidIncrement: restartForm.bidIncrement,
        },
      });
      alert("Auction restarted!");
      closeRestartModal();
      fetchMyAuctions(); // Refresh to see the new auction
    } catch (err) {
      console.error("Failed to restart auction:", err);
      alert("Cannot restart auction.");
    }
  };

  const handleCardClick = (auctionId) => {
    navigate(`/item/${auctionId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">My Auctions</h2>
      {myAuctions.length === 0 ? (
        <p>No auctions yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myAuctions.map((auction) => {
            // Build image URL from base64 if available
            let imageUrl =
              "https://via.placeholder.com/400x300.png?text=No+Image";
            if (auction.product?.imageData) {
              imageUrl = `data:image/png;base64,${auction.product.imageData}`;
            }

            const currentBid = auction.currentBid || 0;
            const winnerName =
              winnerMap[auction.highestBidderId] ||
              `User ${auction.highestBidderId}`;

            const userHasWon =
              auction.status === "ENDED" &&
              auction.highestBidderId &&
              auction.currentBid > 0;

            return (
              <div
                key={auction.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg 
                           overflow-hidden transform hover:scale-105 
                           transition-transform duration-300 relative"
                onClick={() => handleCardClick(auction.id)}
              >
                <img
                  src={imageUrl}
                  alt={auction.product?.title || "Auction Item"}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col justify-between h-auto">
                  <h3 className="text-xl font-semibold dark:text-white mb-2">
                    {auction.product?.title}
                  </h3>
                  <p
                    className={`${getStatusColor(
                      auction.status
                    )} text-sm mb-2 font-bold`}
                  >
                    Status: {auction.status}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Current Bid:</strong> ${currentBid}
                  </p>

                  {/* If auction is active, show Cancel/End buttons */}
                  {auction.status === "ACTIVE" && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleCancel(auction.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Cancel Auction
                      </button>
                      <button
                        onClick={() => handleEnd(auction.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        End Auction
                      </button>
                    </div>
                  )}

                  {/* If ended with a winner, show "User X won this auction" */}
                  {auction.status === "ENDED" && userHasWon && (
                    <p className="text-sm font-bold text-green-600 mt-4">
                      {winnerName} won this auction!
                    </p>
                  )}

                  {/* If ended with no winner (currentBid == 0) or canceled, show a "Restart" button */}
                  {((auction.status === "ENDED" && currentBid === 0) ||
                    auction.status === "CANCELED") && (
                    <div className="text-right mt-4">
                      <button
                        onClick={() => openRestartAuctionModal(auction)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        Restart Auction
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Restart Auction Modal */}
      {showRestartModal && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-2">
              Restart Auction for {selectedAuction.product?.title}
            </h3>
            <div className="mb-2">
              <label className="block font-medium">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={restartForm.startTime}
                onChange={handleRestartFormChange}
                className="border w-full p-1"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={restartForm.endTime}
                onChange={handleRestartFormChange}
                className="border w-full p-1"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Start Bid</label>
              <input
                type="number"
                name="startBid"
                value={restartForm.startBid}
                onChange={handleRestartFormChange}
                className="border w-full p-1"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Bid Increment</label>
              <input
                type="number"
                name="bidIncrement"
                value={restartForm.bidIncrement}
                onChange={handleRestartFormChange}
                className="border w-full p-1"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={restartAuction}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Confirm
              </button>
              <button
                onClick={closeRestartModal}
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

export default MyAuctions;
