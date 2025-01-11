import React, { useEffect, useState } from "react";

const AuctionItemDetail = () => {
  // Initialize countdown time in seconds (3 hours = 10800 seconds)
  const [timeLeft, setTimeLeft] = useState(10800);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  // Convert timeLeft into hours, minutes, and seconds
  const formatTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Side: Image and Item Details */}
      <div className="col-span-2">
        <h2 className="text-2xl font-bold text-white mb-4">
          Lot 1: Vintage Ornate Regal Green Stone Cluster Yellow White Ring
        </h2>
        <img
          src="https://via.placeholder.com/600x400.png?text=Item+Image"
          alt="Item"
          className="w-full rounded-lg shadow-lg"
        />
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">Item Overview</h3>
          <p className="text-gray-600">
            Size: 8 <br />
            Signed: Thailand <br />
            Condition: Super Condition <br />
            Notes: A stunning vintage ring featuring a regal green stone with
            yellow and white cluster design.
          </p>
        </div>
      </div>

      {/* Right Side: Bidding Info */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg self-start max-w-sm mx-auto">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Bidding closes in:
        </h3>
        <div className="text-xl font-bold text-red-600 mb-4">{formatTime()}</div>
        <p className="text-green-700 mb-4">
          <strong>Est:</strong> $100 - $200
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Current Bid:</strong> $33 (4 bids)
        </p>
        <label htmlFor="maxBid" className="block font-semibold text-green-700 mb-2">
          Set Max Bid:
        </label>
        <input
          type="number"
          id="maxBid"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          placeholder="Enter your max bid"
        />
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Place Bid
        </button>
        <p className="mt-4 text-sm text-gray-500">
          <strong>Note:</strong> Purchase protection is available.
        </p>
      </div>

      {/* Seller Info */}
      <div className="mt-8 md:col-span-2">
        <h3 className="text-xl font-semibold text-white mb-2">Seller Information</h3>
        <p className="text-gray-600">
          <strong>Seller:</strong> Figlio Designs LLC <br />
          <strong>Location:</strong> Whitestone, NY, US <br />
          <strong>Categories:</strong> Stamps, Coins, Jewelry, Antiques,
          Collectibles
        </p>
        <div className="mt-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
            Contact Seller
          </button>
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            Follow Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionItemDetail;
