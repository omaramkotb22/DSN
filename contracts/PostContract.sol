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

}
