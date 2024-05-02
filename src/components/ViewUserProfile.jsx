import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { Button } from 'react-bootstrap';
import FriendRequestABI from '../ABIs/FriendRequestABI';
import { sendFriendRequest } from '../services/FriendRequestService';
import '../styles/ViewUserProfile.css';

function ViewUserProfile({ currentUser }) {
  const { state } = useLocation();
  const { user } = state;
  const [status, setStatus] = useState('');

  const handleSendFriendRequest = async () => {
    try {
      const friendRequestContractAddress = process.env.REACT_APP_FRIENDSHIP_CONTRACT_ADDRESS;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(); 
      const friendRequestContract = new ethers.Contract(friendRequestContractAddress, FriendRequestABI, signer);

      const tx = await friendRequestContract.sendFriendRequest(user.userAddress);
      const receipt = await tx.wait();
      const proof = receipt.events[0].args.proof;

      await sendFriendRequest(currentUser, user.userAddress, proof);
      setStatus('Request sent with proof: ' + proof);
    } catch (error) {
      setStatus('Error sending friend request: ' + error.message);
    }
  };

  return (
    <div className='view-user-container'>
      <h2 className='view-user-h2'>{user.username}</h2>
      <p className='view-user-p'>{user.bio}</p>
      <p>{user.userAddress}</p>
      <Button onClick={handleSendFriendRequest} variant="light" className='view-user-button'>Request</Button>
      <p className="status-message">{status}</p>
    </div>
  );
}

export default ViewUserProfile;