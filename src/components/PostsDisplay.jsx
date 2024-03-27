import {React, useEffect, useState} from 'react';
import { Card, Button } from 'react-bootstrap';
import { ApolloClient, gql, InMemoryCache, useMutation } from '@apollo/client';
import { ComposeClient } from '@composedb/client';
import models from "../models/posts-schema-1-1-runtime-composite.json"

import { ethers } from 'ethers';
import PostsABI from '../ABIs/PostsABI';


function PostsDisplay({ posts, fetchPosts }) {

    useEffect(() => {
        fetchPosts();
        setLikeCounts(Array(posts.length).fill(0));
    }, [posts.length]);
    const client = new ApolloClient({
        uri: 'http://localhost:5005/graphql', 
        cache: new InMemoryCache()
      });

    
    const composeClient = new ComposeClient({
        ceramic: 'http://localhost:7007',
        definition: models
    });
    // const handleLikeIncOnDatabase = async (address) => {
    //     const queryResult = composeClient.executeQuery(`
    //     query TheWholeThing{
    //         postsIndex(first: 100) {
    //         edges {
    //           node {
    //             PostLikes
    //             PostReference
    //           }
    //         }
    //       }
    //     }`
    //       );
        


    // }
    
    const getLikes = async () => {
        // TODO: Add index to the main idea
        const query = gql`
        query GetPostLikes{
            postStorageIndex(
                filters:
                {
                where:{
                    PostHash: {
                    equalTo: "SamplePostHash"
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
        const result = await client.query({
            query});
        console.log(result.data);
    }


    
    


    // useEffect(() => {
    //     handleLikeIncOnDatabase("0x49d45077b3c2ef2ede10458a1a4aa950c500f17866344600b5aab3c6c19508e2");
    // }
    // );


    const [likeCounts, setLikeCounts] = useState(Array(posts.length).fill(0));
    const [liked, setLiked] = useState(false);


    const postContractAddress = '0x85af4F5a72f5c78E1B5E233e35f49d51EBcbFC31';
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
                        </Card.Footer>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );

            }

export default PostsDisplay;
