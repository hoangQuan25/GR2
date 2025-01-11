import React from 'react';
import AuctionItem from './AuctionItem';

const AuctionList = () => {
  const auctions = [
    { id: 1, title: 'Vintage Clock', description: 'A beautiful vintage clock from the 19th century.', image: 'https://via.placeholder.com/400x300.png?text=Vintage+Clock', estPrice: '$200 - $400', currentBid: '$120', timeLeft: '7h 31m 13s', bids: 5 },
    { id: 2, title: 'Antique Vase', description: 'An exquisite antique vase with intricate designs.', image: 'https://via.placeholder.com/400x300.png?text=Antique+Vase', estPrice: '$100 - $300', currentBid: '$150', timeLeft: '6h 25m 10s', bids: 3 },
    { id: 3, title: 'Classic Painting', description: 'A classic painting by a renowned artist.', image: 'https://via.placeholder.com/400x300.png?text=Classic+Painting', estPrice: '$500 - $1000', currentBid: '$650', timeLeft: '5h 50m 45s', bids: 8 },
    { id: 4, title: 'Rare Book', description: 'A rare first edition book collection.', image: 'https://via.placeholder.com/400x300.png?text=Rare+Book', estPrice: '$150 - $300', currentBid: '$200', timeLeft: '8h 14m 12s', bids: 6 },
    { id: 5, title: 'Luxury Watch', description: 'A luxury watch with diamond embellishments.', image: 'https://via.placeholder.com/400x300.png?text=Luxury+Watch', estPrice: '$1000 - $2000', currentBid: '$1250', timeLeft: '4h 18m 7s', bids: 10 },
    { id: 6, title: 'Collectible Coin', description: 'A unique collectible coin from ancient times.', image: 'https://via.placeholder.com/400x300.png?text=Collectible+Coin', estPrice: '$50 - $150', currentBid: '$75', timeLeft: '9h 5m 40s', bids: 2 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Active Auctions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {auctions.map((item) => (
          <AuctionItem
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            estPrice={item.estPrice}
            currentBid={item.currentBid}
            timeLeft={item.timeLeft}
            bids={item.bids}
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionList;
