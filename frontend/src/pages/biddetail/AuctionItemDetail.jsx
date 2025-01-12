import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuctionAPI from "../../api/AuctionAPI";
import UserAPI from "../../api/UserAPI";
import { AuthContext } from "../../context/AuthContext";
import getStatusColor from "../../utils/StatusColor";

const AuctionItemDetail = () => {
  const { id } = useParams(); // auctionId
  const { auth } = useContext(AuthContext);
  const [auction, setAuction] = useState(null);
  const [winnerName, setWinnerName] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    fetchAuction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch the auction data from the server
  const fetchAuction = async () => {
    try {
      const response = await AuctionAPI.get(`/auctions/${id}`);
      setAuction(response.data);
  
      // Once we know the auction data:
      if (response.data.highestBidderId) {
        fetchWinner(response.data.highestBidderId);
      }
  
      initializeCountdown(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWinner = async (userId) => {
    try {
      const resp = await UserAPI.get(`/user/${userId}`);
      const user = resp.data;
      setWinnerName(user.firstName + " " + user.lastName);
    } catch (err) {
      console.error("Cannot fetch user:", err);
    }
  };

  // Initialize countdown
  const initializeCountdown = (auctionData) => {
    if (!auctionData.endTime) return;
    const endTime = new Date(auctionData.endTime).getTime();
    const now = Date.now();
    let diff = Math.floor((endTime - now) / 1000);
    if (diff < 0) diff = 0;
    setTimeLeft(diff);
  };

  // Countdown logic (runs every second)
  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Once timeLeft hits 0, we can auto-end the auction if it's still active
  useEffect(() => {
    if (auction && timeLeft === 0 && auction.status === "ACTIVE") {
      endAuctionIfNoTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, auction]);

  const endAuctionIfNoTime = async () => {
    try {
      // We can call the endpoint /auctions/{id}/end
      const res = await AuctionAPI.post(`/auctions/${auction.id}/end`);
      setAuction(res.data); // updated status = ENDED
    } catch (err) {
      console.error("Error auto-ending auction:", err);
    }
  };

  // Format timeLeft into HH:MM:SS
  const formatTimeLeft = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleBid = async () => {
    if (!auction) return;
    try {
      await AuctionAPI.post(`/auctions/${auction.id}/bid`, null, {
        params: {
          userId: auth.user.id,
          amount: bidAmount,
        },
      });
      alert("Bid placed successfully!");
      fetchAuction(); // refresh to see updated currentBid
    } catch (err) {
      alert(err.response?.data?.message || "Error placing bid");
    }
  };

  if (!auction) return <div>Loading...</div>;

  // If the user is the highestBidderId, we say "You are the winner"
  // (only makes sense if auction.status is ENDED)
  const isWinner =
    auction.status === "ENDED" && auction.highestBidderId === auth.user.id;

  const timeDisplay =
    auction.status === "ACTIVE" ? formatTimeLeft(timeLeft) : "00h 00m 00s";

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Side: Image & Item Details */}
      <div className="col-span-2">
        <h2 className="text-2xl font-bold text-white mb-4">
          {auction.product.title}
        </h2>
        {/* If using base64 images */}
        {auction.product.imageData ? (
          <img
            src={`data:image/png;base64,${auction.product.imageData}`}
            alt="Item"
            className="w-full rounded-lg shadow-lg"
          />
        ) : (
          <img
            src="https://via.placeholder.com/600x400.png?text=Item+Image"
            alt="Item"
            className="w-full rounded-lg shadow-lg"
          />
        )}

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Item Overview
          </h3>
          <p className="text-gray-600">{auction.product.description}</p>
        </div>
      </div>

      {/* Right Side: Bidding Info */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg self-start max-w-sm mx-auto">
        {/* Color-coded status */}
        <p
          className={`${getStatusColor(auction.status)} text-xl mb-4 font-bold`}
        >
          {auction.status}
        </p>

        {/* If we want a real-time countdown */}
        {auction.status === "ACTIVE" ? (
          <>
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Bidding closes in:
            </h3>
            <div className="text-xl font-bold text-red-600 mb-4">
              {timeDisplay}
            </div>
            <p className="text-green-700 mb-4">
              <strong>Est:</strong> ${auction.product.estimatedPriceMin} - $
              {auction.product.estimatedPriceMax}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Current Bid:</strong> ${auction.currentBid}
              {auction.highestBidderId
                ? ` (Highest bidder: User ${auction.highestBidderId})`
                : ""}
            </p>

            <label className="block font-semibold text-green-700 mb-2">
              Set Max Bid:
            </label>
            <input
              type="number"
              onChange={(e) => setBidAmount(e.target.value)}
              value={bidAmount}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              placeholder="Enter your max bid"
            />
            <button
              onClick={handleBid}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Place Bid
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-4">
              <strong>Est:</strong> ${auction.product.estimatedPriceMin} - $
              {auction.product.estimatedPriceMax}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Final Bid:</strong> ${auction.currentBid}
            </p>

            {winnerName
                ? <p className="text-green-700 mb-4"> <strong>Winner:</strong> {winnerName} </p>
                : `User ${auction.highestBidderId || "---"}`}

            {isWinner && (
              <p className="text-green-700 font-bold">
                You are the winner of this auction!
              </p>
            )}
          </>
        )}
      </div>

      {/* Seller Info */}
      <div className="mt-8 md:col-span-2">
        <h3 className="text-xl font-semibold text-white mb-2">
          Seller Information
        </h3>
        <p className="text-gray-600">
          <strong>Seller:</strong> {auction.product.ownerName || "Unknown"}{" "}
          <br />
          {/* Or any other relevant fields about the seller */}
        </p>
      </div>
    </div>
  );
};

export default AuctionItemDetail;
