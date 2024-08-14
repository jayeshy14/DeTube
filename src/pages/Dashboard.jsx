import React, { useState, useEffect, useContext } from 'react';
import { YoutubeContext } from '../context/YoutubeContext';
import VideoList from '../components/VideoList';

function Dashboard() {
  const { myVideos, purchasedVideos, myLikedVideos, myCommentedVideos, fetchMyVideos, fetchPurchasedVideos, fetchMyLikedVideos, fetchMyCommentedVideos, withdraw, currentAccount } = useContext(YoutubeContext);
  const [selectedFunction, setSelectedFunction] = useState('myVideos');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchMyVideos();
    fetchPurchasedVideos();
    fetchMyCommentedVideos();
    fetchMyLikedVideos();
  }, []);

  const handleWithdraw = async () => {
    try {
      await withdraw(balance);
      setBalance(0);
    } catch (error) {
      console.error('Error withdrawing funds:', error);
    }
  };

  const renderContent = () => {
    switch (selectedFunction) {
      case 'myVideos':
        return <VideoList videos={myVideos} />;
      case 'purchasedVideos':
        return <VideoList videos={purchasedVideos} />;
      case 'likedVideos':
        return <VideoList videos={myLikedVideos} />;
      case 'commentedVideos':
        return <VideoList videos={myCommentedVideos} />;
      case 'withdrawFunds':
        return (
          <div>
            <h2 className="text-xl font-semibold">Balance: {balance} ETH</h2>
            <button
              onClick={handleWithdraw}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-4"
              disabled={balance <= 0}
            >
              Claim Rewards
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="w-1/4 border-r">
        <ul>
          <li onClick={() => setSelectedFunction('myVideos')} className="cursor-pointer p-2 hover:bg-gray-200">My Videos</li>
          <li onClick={() => setSelectedFunction('purchasedVideos')} className="cursor-pointer p-2 hover:bg-gray-200">My Purchased Videos</li>
          <li onClick={() => setSelectedFunction('likedVideos')} className="cursor-pointer p-2 hover:bg-gray-200">My Liked Videos</li>
          <li onClick={() => setSelectedFunction('commentedVideos')} className="cursor-pointer p-2 hover:bg-gray-200">My Commented Videos</li>
          <li onClick={() => setSelectedFunction('withdrawFunds')} className="cursor-pointer p-2 hover:bg-gray-200">Withdraw Funds</li>
        </ul>
      </div>
      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;
