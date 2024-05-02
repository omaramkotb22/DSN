// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FriendRequestContract {
    event FriendRequestSent(uint256 requestId, address indexed requester, address indexed requestee, string proof);
    event FriendshipConfirmed(address indexed requester, address indexed requestee);

    mapping(address => address[]) public friendRequests; // Track pending friend requests
    mapping(address => address[]) public friends; // Track confirmed friendships
    mapping(uint256 => string) public proofs; // Track proofs for friend requests
    uint256 public requestIdCounter = 0; // Counter for requestId

    function sendFriendRequest(address requestee) public returns (uint256) { // Returns requestId
        requestIdCounter++;
        bytes32 proofHash = keccak256(abi.encodePacked(block.timestamp, msg.sender, requestee, requestIdCounter));
        string memory proof = toHexString(proofHash);
        
        friendRequests[requestee].push(msg.sender);
        proofs[requestIdCounter] = proof;

        emit FriendRequestSent(requestIdCounter, msg.sender, requestee, proof);
        return requestIdCounter;
    }

    function confirmFriendship(address requester) public {
        friends[requester].push(msg.sender);
        friends[msg.sender].push(requester);
        emit FriendshipConfirmed(requester, msg.sender);
    }

    function getFriendRequests(address user) public view returns (address[] memory) {
        return friendRequests[user];
    }

    function getFriends(address user) public view returns (address[] memory) {
        return friends[user];
    }

    function toHexString(bytes32 _data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            str[i*2] = alphabet[uint8(_data[i] >> 4)];
            str[1+i*2] = alphabet[uint8(_data[i] & 0x0f)];
        }
        return string(str);
    }
}
