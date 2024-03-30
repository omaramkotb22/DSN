import {React, useEffect, useState} from 'react';
import { Card, Button } from 'react-bootstrap';
import { ApolloClient, gql, InMemoryCache, useMutation } from '@apollo/client';
import { ComposeClient } from '@composedb/client';
import models from "../models/runtime-PostSchema_3-composite.json"

import { ethers } from 'ethers';
import PostsABI from '../ABIs/PostsABI';


function PostsDisplay({ posts, fetchPosts }) {

    useEffect(() => {
        fetchPosts();
        setLikeCounts(Array(posts.length).fill(0));
        console.log('Posts:', posts[0]);
    }, [posts.length]);
    const client = new ApolloClient({
        uri: 'http://localhost:5005/graphql', 
        cache: new InMemoryCache()
      });

    
    const composeClient = new ComposeClient({
        ceramic: 'http://localhost:7007',
        definition: models
    });

    
    const getLikes = async (hash) => { // Returns Length of the Likes array (Number of likes on a post)
        const query = gql`
        query GetPostLikes($hash: String!){
            postStorageIndex(
                filters: {
                where:{
                    PostHash: {
                    equalTo: $hash
                    }
                }
                }
                first:1){
                    edges {
                node {
                    PostHash
                    PostLikesHash
                }
                }
            }
        }
        `;
        try {
            const result = await client.query({
                query,
                variables: {hash}
            });
    
            // Check if there are edges and a node present
            if (result.data.postStorageIndex.edges.length > 0 && result.data.postStorageIndex.edges[0].node) {
                const likeCounts = result.data.postStorageIndex.edges[0].node.PostLikesHash.length;
                return likeCounts;
            } else {
                // Return 0 if there are no edges or the node is not present
                return 0;
            }
        } catch (error) {
            console.error("Error fetching post likes:", error);
            // Return 0 in case of any errors during the query execution
            return 0;
        }
    };

    // useEffect(() => {
    //     handleLikeIncOnDatabase("0x49d45077b3c2ef2ede10458a1a4aa950c500f17866344600b5aab3c6c19508e2");
    // }
    // );


    const [likeCounts, setLikeCounts] = useState(Array(posts.length).fill(0));
    const [liked, setLiked] = useState(false);


    const postContractAddress = '0xA8bD1a6BD52a06183a8AE01d95b7f10D76B9A7b4';
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = web3Provider.getSigner();
    const postContract = new ethers.Contract(postContractAddress, PostsABI, signer);
    const handleLike = async (index) => {
        const message = ethers.utils.solidityKeccak256(['uint256', 'address', 'bool'], [index, window.ethereum.selectedAddress, !liked]);
        const messageBytes = ethers.utils.arrayify(message);
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [ethers.utils.hexlify(messageBytes), window.ethereum.selectedAddress]
        });
        try {
            const tx = await postContract.likePost(index, !liked, signature);
            await tx.wait();  // Wait for the Signature to be confirmed
            console.log('Transaction successful:', tx.hash);
            console.log('Transaction:', tx);
            
            
            // If the transaction is successful, update the UI accordingly
            const newLikeCounts = [...likeCounts];
            if (!liked) {
                newLikeCounts[index] += 1; // Increment the like count by 1
            } else {
                newLikeCounts[index] -= 1; // Decrement the like count by 1
            }
            setLikeCounts(newLikeCounts); 
            setLiked(!liked); // Toggle the liked state
        } catch (error) {
            console.error('Error submitting like:', error);
        }
        if (!liked){ // check if liked then increment the like count
            const newLikeCounts = [...likeCounts]; 
            newLikeCounts[index] += 1; 
            setLikeCounts(newLikeCounts); 
            setLiked(true);

        }
        else { // if not liked onClick do the opposite 
            const newLikeCounts = [...likeCounts];
            newLikeCounts[index] -= 1; 
            setLikeCounts(newLikeCounts); 
            setLiked(false);
        }
    };

    return (
        <div>
            {posts.map((post, index) => (
                <Card key={index} style={{ marginTop: '15px' }}>
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.content}</Card.Text>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={() => handleLike(index)}
                        >
                            Like {likeCounts[index]}
                        </button>
                        <Card.Footer style={{ marginTop: '15px' }}>
                            <small className="text-muted">Posted at {new Date(post.timestamp * 1000).toLocaleString()}</small>
                            {/* <Button variant="link" onClick={() => console.log('Author:', post.author)}>Author</Button> */}
                            <small className='text-muted'>Hash: {post.postHash}</small>
                        </Card.Footer>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );

            }

export default PostsDisplay;
