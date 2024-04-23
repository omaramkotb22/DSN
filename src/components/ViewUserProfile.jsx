import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { Button } from 'react-bootstrap';
// import '../styles/ViewUserProfile.css';
import FriendRequestABI from '../ABIs/FriendRequestABI';


function ViewUserProfile() {
  // !If the current user searches for themselves, they should see their own profile route
  const { state } = useLocation();
  const { user } = state;
  const [status, setStatus] = useState('');
  const [contract, setContract] = useState(null);

  const sendFriendRequest = async () => {
    try {
      const friendRequestContractAddress = "0x964268df23aAfbD8256f28a6c26149039Df3073b";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(); 
      const friendRequestContract = new ethers.Contract(friendRequestContractAddress, FriendRequestABI, signer);
      const tx = await friendRequestContract.sendFriendRequest(user.userAddress);
      await tx.wait();
      setStatus('pending');
    } catch (error) {
      setStatus('Error sending friend request');
    }
  }

  
  return (
    <div className='container'>
      <h2>{user.usename}</h2>
      <p>{user.bio}</p>
      <p>{user.userAddress}</p>
      <Button onClick={sendFriendRequest} variant="light" >Request</Button>
      <p className="status-message">{status}</p>
    </div>
  );
}

export default ViewUserProfile;
