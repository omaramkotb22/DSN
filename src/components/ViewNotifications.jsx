import React, { useEffect, useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import FriendRequestABI from '../ABIs/FriendRequestABI';
import { ethers } from 'ethers';

const ViewNotifications = ({ account }) => {
  const friendRequestContractAddress = "0x964268df23aAfbD8256f28a6c26149039Df3073b";
  const [notifications, setNotifications] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const friendRequestContract = new ethers.Contract(friendRequestContractAddress, FriendRequestABI, signer);

  function listenForFriendRequests() {
    friendRequestContract.on('FriendRequestSent', (requestId, requester, requestee) => {
        // Check if the requestee is the current user
        signer.getAddress().then(friendRequestContractAddress => {
            if (requestee === friendRequestContractAddress) { // If the requestee is the current user
                console.log(`You have a new friend request from: ${requester}`);
                console.log(`Request ID: ${requestId}`);

            }
        });
    });
  }
  listenForFriendRequests();


  // Function to handle notification click
  const handleNotificationClick = (notificationId) => {
    // Handle notification click logic here
    console.log("Notification clicked:", notificationId);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-notifications">
        <i className="bi bi-bell"></i>
        <Badge bg="danger">{notifications.length}</Badge>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {notifications.map((notification, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => handleNotificationClick(notification.id)}
          >
            {notification.message}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ViewNotifications;
