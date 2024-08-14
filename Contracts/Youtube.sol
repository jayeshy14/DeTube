// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Youtube is ReentrancyGuard, Ownable(msg.sender) {
    uint256 public nextVideoId = 0;

    constructor() {}

    struct Comment {
        uint256 videoId;
        uint256 timestamp;
        address commenter; 
        string comment; 
    }

    struct Video {
      uint256 id;
        uint256 price;
        string cid; 
        uint256 timestamp; 
        address owner;
        uint256 duration;
        string title;
        string description;
        uint256 views;
        uint256 likes;
        uint256 earned;
        uint256 commentsCount;
    } 

        struct User {
        address userId;
        uint256 balance; 
        uint256[] myVideos;
        uint256[] purchaseVideos; 
        uint256 [] viewed;
        uint256 [] liked;
        uint256 [] commented;
        uint256 commentsCount;
    } 

    mapping(address => User) public users;
    mapping(uint256 => Video) public videos;
    mapping(uint256 => mapping(uint256 => Comment)) public videoComments; 
    mapping(uint256 => mapping(address => bool)) public isPurchased;
    mapping(uint256 => mapping(address => bool)) public isLiked;

    modifier _exists(uint256 videoId) {
        require(videos[videoId].owner != address(0), "Video does not exist");
        _;
    } 

    function uploadVideo(uint256 _price, string memory cid, uint256 _duration, string memory _title, string memory _description) public {
        require(bytes(cid).length > 0, "Invalid URL");
        uint256 videoId = nextVideoId;
        nextVideoId++;
        videos[videoId] = Video({
            id:videoId,
            cid: cid,
            price: _price,
            timestamp: block.timestamp,
            owner: msg.sender,
            duration: _duration,
            title: _title,
            description: _description,
            views: 0,
            likes: 0,
            earned:0,
            commentsCount: 0 
        });
        users[msg.sender].myVideos.push(videoId);
        isPurchased[videoId][msg.sender] = true;
    }

    function purchaseVideo(uint256 videoId) public payable _exists(videoId) {

        require(videos[videoId].owner != msg.sender, "Cannot purchase your own video"); 
        require(!isPurchased[videoId][msg.sender], "Video already purchased"); 
        require(msg.value >= videos[videoId].price, "Not enough ETH");
 
        isPurchased[videoId][msg.sender] = true; 
        users[msg.sender].purchaseVideos.push(videoId);
        users[videos[videoId].owner].balance += (msg.value * 99) / 100;
        videos[videoId].earned += (msg.value * 99) / 100; 
     } 

    function addComment(uint256 videoId, string memory commentText) public _exists(videoId) {
        require(bytes(commentText).length > 0, "Invalid comment!"); 
        require(isPurchased[videoId][msg.sender], "Purchase video to comment on it!");
        uint256 myCommentCount = videos[videoId].commentsCount++; 
        Comment memory comment = Comment({ 
            videoId: videoId,
            timestamp: block.timestamp,
            commenter: msg.sender,
            comment: commentText
        }); 
        videoComments[videoId][myCommentCount] = comment;
        users[msg.sender].commented.push(videoId); 
        users[msg.sender].commentsCount++; 
        uint256 videoCommentCount = videos[videoId].commentsCount++;
        videoComments[videoId][videoCommentCount] = comment;
     } 

     
     function playVideo(uint256 videoId) public _exists(videoId) {
        require(isPurchased[videoId][msg.sender], "Purchase video to play it!");
        videos[videoId].views += 1; 
        users[msg.sender].viewed.push(videoId); 
     } 

     function likeVideo(uint256 videoId) public _exists(videoId) {
        require(isPurchased[videoId][msg.sender], "Purchase video to like it!");
        videos[videoId].likes += 1; 
        users[msg.sender].liked.push(videoId); 
        isLiked[videoId][msg.sender] = true;
     } 

     function getMyVideos(address user) public view returns(uint256[] memory) {
        return users[user].myVideos; 
     } 

     function getMyPurchasedVideos(address user) public view returns(uint256[] memory) {
        return users[user].purchaseVideos; 
     } 

     function getMyViewedVideos(address user) public view returns(uint256[] memory) {
        return users[user].viewed; 
     } 

     function getMyLikedVideos(address user) public view returns(uint256[] memory) {
        return users[user].liked; 
     } 

     function getMyCommentedVideos(address user) public view returns(uint256[] memory) {
        return users[user].commented; // Return the user's commented list
     } 

     function getVideoComments(uint256 videoId) public view returns(Comment[] memory) {
        require(videos[videoId].commentsCount > 0, "No comments"); 
        Comment[] memory comments = new Comment[](videos[videoId].commentsCount); 
        for (uint i = 0; i < videos[videoId].commentsCount; i++) {
            comments[i] = videoComments[videoId][i]; 
        } 
        return comments; 
     } 

     function getUserComments(uint256 videoId) public view returns(Comment[] memory) {
        require(videos[videoId].commentsCount > users[msg.sender].commentsCount, "No comments");
        Comment[] memory comments = new Comment[](users[msg.sender].commentsCount);
        for (uint i = 0; i < users[msg.sender].commentsCount; i++) {
            uint commentId = users[msg.sender].commented[i];
            comments[i] = videoComments[commentId][i];
         } 
        return comments;
     } 

     function getVideo(uint256 videoId) public view returns(Video memory) {
        return videos[videoId];
     } 

     function getUserInfo(address userAddress) public view returns(User memory) {
        return users[userAddress];
     } 

     function withdraw(uint256 amount) public nonReentrant {
        require(users[msg.sender].balance >= amount, "Insufficient balance!"); 
        users[msg.sender].balance -= amount;
        payable(msg.sender).transfer(amount);
     }

     function rechargeYoutubeWallet() public payable{
        users[msg.sender].balance += msg.value; 
     }

     function ownerWithdraw(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance!"); 
        payable(msg.sender).transfer(amount);
     }

}