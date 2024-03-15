// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PostContract {
    struct Post {
        address author;
        string title;
        string content;
        uint256 timestamp;
    }

    Post[] public posts;

    function writePost(string memory _title, string memory _content) public {
        posts.push(Post(msg.sender, _title, _content, block.timestamp));
    }

    function getPosts() public view returns (Post[] memory) {
        Post[] memory temporary = new Post[](posts.length);
        uint counter = 0;
        for(uint i=0; i<posts.length; i++) {
                temporary[counter] = posts[i];
                counter++;
        }

        Post[] memory result = new Post[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        
        return result;
        
    }

    
}
