import React, { createContext, useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { CONTRACT_ADDRESS } from '../config';
import { abi } from '../abi/abi';

export const YoutubeContext = createContext();

export const YoutubeProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [youtubeContract, setYoutubeContract] = useState(null);
  const [videos, setVideos] = useState([]);
  const [myVideos, setMyVideos] = useState([]);
  const [purchasedVideos, setPurchasedVideos] = useState([]);
  const [myLikedVideos, setMyLikedVideos] = useState([]);
  const [myCommentedVideos, setMyCommentedVideos] = useState([]);
  const [userInfo, setUserInfo] = useState({});


  useEffect(() => {
    const connectAndLoadContract = async () => {
      await connectWallet();
    };

    connectAndLoadContract();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts found:', accounts);
      setCurrentAccount(accounts[0]);  // Set the first account as the current account
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }

    window.ethereum.on("chainChanged", () => {
      window.location.reload()
    });

    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    if (currentAccount) {
      loadContract();
    }
  }, [currentAccount]);

  const loadContract = async () => {
    if (currentAccount) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
        console.log('Contract loaded with address:', await contract.getAddress());
        setYoutubeContract(contract);
      } catch (error) {
        console.error('Failed to load contract:', error);
      }
    } else {
      console.log('currentAccount is still null when trying to load contract');
    }
  };

  useEffect(()=>{
    fetchVideos();
  },[])

  const fetchVideos = async () => {
    if (youtubeContract) {
      try {
        const videoCount = await youtubeContract.nextVideoId();
        const videosArray = [];
        for (let i = 0; i < videoCount; i++) {
          const video = await youtubeContract.getVideo(i);
          videosArray.push(video);
        }
        setVideos(videosArray);
        console.log(videos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
  };

  useEffect(()=>{
    fetchMyVideos();
    console.log(myVideos);
  },[])


  const fetchMyVideos = async() => {
    if(youtubeContract){
      try{
        const myVideos = await youtubeContract.getMyVideos(currentAccount);
        const videoCount = myVideos.length;
        const myVideosArray = [];
        for(let i=0; i<videoCount; i++){
          const video = await youtubeContract.getVideo(myVideos[i]);
          myVideosArray.push(video);
          console.log(video.likes)
        }
        setMyVideos(myVideosArray);
        console.log(myVideosArray);
      }catch(error){

      }
    }
  }

  useEffect(()=>{
    fetchPurchasedVideos();
  },[])


  const fetchPurchasedVideos = async() => {
    if(youtubeContract){
      try{
        const purchasedVideos = await youtubeContract.getMyPurchasedVideos(currentAccount);
        const videoCount = purchasedVideos.length;
        let purchasedVideosArray = []; 
        for(let i=0; i<videoCount; i++){
          const video = await youtubeContract.getVideo(purchasedVideos[i]);
          purchasedVideosArray.push(video);
        }
        setPurchasedVideos(purchasedVideosArray);
      }catch(error){

      }
    }
  }

  useEffect(() => {
    fetchMyLikedVideos();
    fetchMyCommentedVideos();
  }, [])

  const fetchMyLikedVideos = async() => {
    if(youtubeContract) {
      try{
        const likedVideos = await youtubeContract.getMyLikedVideos(currentAccount);
        console.log(likedVideos);
        const videoCount = likedVideos.length;
        let likedVideosArray = [];
        for(let i=0; i<videoCount; i++){
          const video = await youtubeContract.getVideo(likedVideos[i]);
          likedVideosArray.push(video);
        }
        setMyLikedVideos(likedVideosArray);
      }catch(error){

      }
    }
  }

  const fetchMyCommentedVideos = async() => {
    if(youtubeContract) {
      try{
        const commentedVideos = await youtubeContract.getMyCommentedVideos(currentAccount);
        const videoCount = commentedVideos.length;
        let commentedVideosArray = [];
        for(let i=0; i<videoCount; i++){
          const video = await youtubeContract.getVideo(commentedVideos[i]);
          commentedVideosArray.push(video);
        }
        setMyCommentedVideos(commentedVideosArray);
      }catch(error){

      }
    }
  }

  useEffect(()=>{
    fetchUserInfo();
  },[])

  const fetchUserInfo = async() => {
    if(youtubeContract){
      try{
        const userInfo = await youtubeContract.getUserInfo(currentAccount);
        setUserInfo(userInfo);

      }catch(error){

      }
    }
  }


  return (
    <YoutubeContext.Provider
      value={{
        currentAccount,
        connectWallet,
        fetchVideos,
        fetchMyVideos,
        fetchPurchasedVideos,
        fetchMyCommentedVideos,
        fetchMyLikedVideos,
        youtubeContract,
        videos,
        myVideos,
        purchasedVideos,
        myLikedVideos,
        myCommentedVideos,
        userInfo
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};
