import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { YoutubeContext } from '../context/YoutubeContext';
import { ethers } from 'ethers';
import VideoCard from '../components/VideoCard';
function Home() {
  const { videos, fetchVideos } = useContext(YoutubeContext);

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explore Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <VideoCard key={index} videoId={video.id} video={video} />
          ))
        ) : (
          <p className="text-gray-600">No videos available. Please check back later.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
