import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { YoutubeContext } from '../context/YoutubeContext';

function VideoCard({ video }) {
  const navigate = useNavigate();
  const {youtubeContract, currentAccount} = useContext(YoutubeContext);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(()=>{
    const fetchPurchasedStatus = async() =>{
      const isPurchased = await youtubeContract.isPurchased(video.id, currentAccount);
      setIsPurchased(isPurchased);
    }
    fetchPurchasedStatus();
  },[])

  const handlePlay = () => {
    navigate(`/video/${video.id}`);
  };

  const price = Number(video.price);
  const priceInEther = ethers.formatEther(price);

  const timestampInMs = video?.timestamp
    ? Number(video.timestamp) * 1000
    : null;

  const formattedDate = timestampInMs
    ? new Date(timestampInMs).toLocaleDateString()
    : 'Date not available';

    const handlePurchase = async() => {
      try{
        await youtubeContract.purchaseVideo(video.id, {value:video.price});
      }catch(error){
        console.log(error);
      }
    }

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
    >

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
        <p className="text-gray-600 text-sm mb-4">{video.description}</p>
        <div className="text-gray-800">
        <span className='text-gray-600'>
          Likes: {Number(video.likes)}  
        </span>
        <span className='text-gray-600 float-end'>
          Comments: {Number(video.commentsCount)}
        </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-bold">
            {priceInEther} ETH
          </span>
          <span className="text-gray-500 text-sm">
            {formattedDate}
          </span>
        </div>
        <div>
        {!isPurchased? <button className='p-2 bg-green-600 rounded-lg' onClick={handlePurchase}>Purchase Video</button>
        :<button onClick={handlePlay} className='p-2 bg-green-600 rounded-lg'>Play Video</button>}
        </div>


      </div>
    </div>
  );
}

export default VideoCard;
