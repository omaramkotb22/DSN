// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FriendRequestContract {
    event FriendRequestSent(uint256 requestId, address indexed requester, address indexed requestee);
    // Mapping to keep track of friend requests
    mapping(address => address[]) public friendRequests;
    // Request ID counter to ensure each request is unique
    uint256 public requestIdCounter = 0;
    // Function to send a friend request
    function sendFriendRequest(address requestee) public {
        // Increment the request ID counter
        requestIdCounter++;
        
        // Store the friend request
        friendRequests[requestee].push(msg.sender);

        // Emit an event for the frontend to listen to
        emit FriendRequestSent(requestIdCounter, msg.sender, requestee);
    }

    // Function to get friend requests for a user
    function getFriendRequests(address user) public view returns (address[] memory) {
        return friendRequests[user];
    }
}
