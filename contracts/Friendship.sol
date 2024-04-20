// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Friendship {
    struct FriendProof {
        address friendAddress;
        bytes32 proof;
        bool isFriend;
    }
    
    mapping(address => FriendProof[]) public friendProofs;

    function requestFriendship(address user1, address user2, bytes32 proof) external {
        
        require(user1 != user2, "Cannot send friend request to oneself."); // Ensure a user cannot send a friend request to themselves

        // Store the friend request with a default 'false' for isFriend
        friendProofs[user1].push(FriendProof(user2, proof, false));
    }

    function acceptFriendship(address userA, address userB, bytes32 proof) external {
        // Called by User B to confirm a friendship
        bool requestFound = false;
        // Iterate through the pending requests of userA to find the matching request
        for(uint i = 0; i < friendProofs[userA].length; i++) {
            if(friendProofs[userA][i].friendAddress == userB && friendProofs[userA][i].proof == proof && !friendProofs[userA][i].isFriend) {
                friendProofs[userA][i].isFriend = true;
                requestFound = true;
                // Reciprocally add the friendship to userB's list as well
                friendProofs[userB].push(FriendProof(userA, proof, true));
                break;
            }
        }
        require(requestFound, "Friend request not found.");
    }

    function verifyFriendship(address userA, address userB, bytes32 proof) external view returns (bool) {
        // Iterate over the friends list of userA to verify the friendship
        for(uint i = 0; i < friendProofs[userA].length; i++) {
            // Check both the address and proof match and friendship is confirmed
            if(friendProofs[userA][i].friendAddress == userB && friendProofs[userA][i].proof == proof && friendProofs[userA][i].isFriend) {
                return true;
            }
        }
        return false;
    }

}