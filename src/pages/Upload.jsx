import React, { useState, useContext } from 'react';
import { YoutubeContext } from '../context/YoutubeContext';
import axios from 'axios';
import { ethers } from 'ethers';
import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from '../config';

function Upload() {
  const { youtubeContract, currentAccount } = useContext(YoutubeContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !title || !description || !price || !duration) {
      alert('Please fill in all fields and select a video file.');
      return;
    }

    setIsUploading(true);

    try {
      // Upload video to IPFS via Pinata
      const nextVideoId = await youtubeContract.nextVideoId();
      console.log(nextVideoId);
      const formData = new FormData();
      formData.append('file', file);

      const resFile = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxBodyLength: 'Infinity', // For large files
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      });

      const videoCid = resFile.data.IpfsHash;
      console.log(videoCid);

      console.log(ethers.parseEther(price));
      const tx = await youtubeContract.uploadVideo(
        ethers.parseEther(price),
        videoCid,  
        parseInt(duration),
        title,
        description
      );
      console.log(5);
      await tx.wait();
      console.log(6);
      alert('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setDuration('');
      setFile(null);
    } catch (error) {
      console.error('Video upload failed:', error);
      alert('Video upload failed!');
    }

    setIsUploading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Duration in seconds"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </div>
    </div>
  );
}

export default Upload;
