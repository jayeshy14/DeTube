import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { YoutubeContext } from '../context/YoutubeContext';
import { ethers } from 'ethers';

function Video() {
  const { id } = useParams();
  const { youtubeContract, currentAccount } = useContext(YoutubeContext);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const videoData = await youtubeContract.getVideo(id);
        setVideo({
          title: videoData.title,
          url: `https://gateway.pinata.cloud/ipfs/${videoData.cid}`,
          description: videoData.description,
          price: ethers.formatEther(videoData.price),
          duration: parseInt(videoData.duration),
          owner: videoData.owner,
        });
        const commentsCount = videoData.commentsCount;
        if(commentsCount>0){
          const commentsData = await youtubeContract.getVideoComments(id);
          setComments(commentsData.map(comment => ({
            commenter: comment.commenter,
            comment: comment.comment,
            timestamp: Number(comment.timestamp)
          })));
        }


        // Check if the current user has liked the video
        const userLiked = await youtubeContract.isLiked(id, currentAccount);
        setIsLiked(userLiked);

        // Check if the current user has purchased the video
        const userPurchased = await youtubeContract.isPurchased(id, currentAccount);
        setIsPurchased(userPurchased);
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    fetchVideoDetails();
  }, [id, youtubeContract, currentAccount]);

  const handleLike = async () => {
    try {
      const tx = await youtubeContract.likeVideo(id);
      await tx.wait();
      setIsLiked(true);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment) return;

    try {
      const tx = await youtubeContract.addComment(id, newComment);
      await tx.wait();
      setComments([...comments, { commenter: currentAccount, comment: newComment, timestamp: Date.now() }]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handlePurchase = async () => {
    try {
      const price = ethers.parseUnits(video.price);
      console.log(price);
      const tx = await (await youtubeContract.purchaseVideo(id, {
        value: price, // Ensure correct value is sent
      }))
      await tx.wait();
      setIsPurchased(true);
    } catch (error) {
      console.error('Error purchasing video:', error);
    }
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
        <video
          controls
          className="w-full mb-4"
          src={video.url}
        />
        <p className="text-gray-600 mb-4">{video.description}</p>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleLike}
            disabled={isLiked}
            className={`px-4 py-2 rounded-md ${isLiked ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isLiked ? 'Liked' : 'Like'}
          </button>
          {!isPurchased && (
            <button
              onClick={handlePurchase}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Purchase for {video.price} ETH
            </button>
          )}
          {isPurchased && (
            <span className="text-green-600 font-semibold">Purchased</span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <button
              onClick={handleComment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Post Comment
            </button>
          </div>
          <div>
            {comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-300 py-2">
                <p className="font-semibold">{comment.commenter}</p>
                <p>{comment.comment}</p>
                <span className="text-gray-500 text-sm">{new Date(comment.timestamp * 1000).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
