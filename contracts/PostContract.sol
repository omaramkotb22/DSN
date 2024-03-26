// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PostContract {
    struct Post {
        address author;
        string title;
        string content;
        uint256 timestamp;
    }

    // Mapping from post index to a mapping of liker's addresses to boolean
    mapping(uint256 => mapping(address => bool)) public likes;

    Post[] public posts;

    event PostLiked(uint256 indexed postId, address indexed liker);

    function writePost(string memory _title, string memory _content) public {
        posts.push(Post(msg.sender, _title, _content, block.timestamp));
    }

    function getPosts() public view returns (Post[] memory) {
        return posts;
    }

    event LikeAction(uint256 indexed postId, address indexed liker, bool liked);

    function likePost(uint256 _postId, bool _like, bytes memory _signature) public {
        require(_signature.length == 65, "Invalid signature length");

        // Split the signature into r, s and v variables
        bytes32 r;
        bytes32 s;
        uint8 v;

        // ecrecover takes the signature parameters in the order: v, r, s
        // Ethereum signatures are {r,s,v} format
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }

        // Recreate the signed message
        bytes32 message = keccak256(abi.encodePacked(_postId, msg.sender, _like));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));

        // Recover the signer from the signature
        address recoveredAddress = ecrecover(ethSignedMessage, v, r, s);
        require(recoveredAddress == msg.sender, "Invalid signature");

        // Record the like or unlike action, for example:
        likes[_postId][msg.sender] = _like;

        emit LikeAction(_postId, msg.sender, _like);
}

}
