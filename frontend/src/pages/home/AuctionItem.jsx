import React from "react";
import { Link } from "react-router-dom";

const AuctionItem = ({
  id,
  title,
  description,
  image,
  estPrice,
  currentBid,
  timeLeft,
  bids,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <Link to={`/item/${id}`}>
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-green-800 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-green-300 mt-2 text-sm">
            {description}
          </p>
          <div className="mt-4 text-gray-800 dark:text-gray-300 text-sm">
            <p>
              Est: <span className="font-bold">{estPrice}</span>
            </p>
            <p>
              Current Bid: <span className="font-bold">{currentBid}</span>
            </p>
            <p>
              Bids: <span className="font-bold">{bids}</span>
            </p>
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-xs">
            {timeLeft} left
          </p>
          <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
            Bid Now
          </button>
        </div>
      </Link>
    </div>
  );
};

export default AuctionItem;
