import React, { useEffect, useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import FriendRequestABI from '../ABIs/FriendRequestABI';
import { ethers } from 'ethers';
import ViewRequest from './ViewRequest';

const ViewNotifications = ({ account }) => {
  const friendRequestContractAddress = process.env.REACT_APP_FRIENDSHIP_CONTRACT_ADDRESS;
  const [notifications, setNotifications] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const friendRequestContract = new ethers.Contract(friendRequestContractAddress, FriendRequestABI, signer);

  useEffect(() => {
    const updateNotifications = (requestId, requester, requestee, proof) => {
      signer.getAddress().then(currentAddress => {
        if (requestee.toLowerCase() === currentAddress.toLowerCase()) {
          // Update notifications state
          setNotifications(prevNotifications => [
            ...prevNotifications,
            {
              id: requestId.toString(),
              requester,
              requestee,
              proof
            }
          ]);
          console.log(`You have a new friend request from: ${requester} with Request ID: ${requestId}`);
        }
      });
    };

    friendRequestContract.on('FriendRequestSent', updateNotifications);

    return () => {
      // Clean up the listener
      friendRequestContract.off('FriendRequestSent', updateNotifications);
    };
  }, [account]); // Reinitialize when account changes

  const handleAccept = (notificationId) => {
    console.log('Accepting request:', notificationId);
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  };

  const handleReject = (notificationId) => {
    console.log('Rejecting request:', notificationId);
    
    
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-notifications">
        <i className="bi bi-bell-fill"></i> <Badge bg="danger">{notifications.length}</Badge>
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ width: '300px', backgroundColor: '#343a40' }}>
        {notifications.map((notification, index) => (
          <ViewRequest
            key={index}
            username={notification.requester} // Assuming you want to display the requester's address
            onAccept={() => handleAccept(notification.id)}
            onReject={() => handleReject(notification.id)}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ViewNotifications;
