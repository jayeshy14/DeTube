import React, { useState, useEffect, useContext } from 'react';
import { YoutubeContext } from '../context/YoutubeContext';
import VideoCard from './VideoCard';
import { ethers } from 'ethers';

function VideoList({videos}) {
  const { youtubeContract, currentAccount, fetchVideos, fetchMyVideos, fetchPurchasedVideos} = useContext(YoutubeContext);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchMyVideos();
    setLoading(false);
    console.log(videos);
  }, [youtubeContract, currentAccount]);

  useEffect(() => {
    fetchPurchasedVideos();
    setLoading(false);
  }, [youtubeContract, currentAccount]);

  useEffect(() => {
    fetchVideos();
    setLoading(false);
  }, [youtubeContract, currentAccount]);



  if (loading) return <p>Loading videos...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        videos.map((video, index) => (
          <VideoCard key={index} videoId={video.id} video={video} />
        ))
      )}
    </div>
  );
}

export default VideoList;
