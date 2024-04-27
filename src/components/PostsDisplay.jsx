import {React, useEffect, useState} from 'react';
import { Card, Button } from 'react-bootstrap';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import '../styles/PostsDisplay.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

import { ethers } from 'ethers';
import PostsABI from '../ABIs/PostsABI';


function PostsDisplay({ posts, fetchPosts }) {

    useEffect(() => {
        fetchPosts();
        const fetchLikes = async () => {
            const likeCounts = await posts.map((post, index) => getLikesForAPost(post.id.toString()));
            const likes = await Promise.all(likeCounts);
            setLikeCounts(likes);
        };

        if (posts.length > 0) {
            fetchLikes();
        }

    }, [posts.length]);
    const client = new ApolloClient({
        uri: 'http://localhost:5005/graphql', 
        cache: new InMemoryCache()
      });
    
    const getLikesForAPost = async (postID) => { 
    // Returns Length of the Likes array (Number of likes on a post)
        const query = gql`
        query GetPostLikes($input: String!){
            postSchema_6Index(
                filters: {
                where:{
                    PostID: {
                    equalTo: $input
                    }
                }
                }
                first:1){
                    edges {
                node {
                    PostID
                    PostLikesHash
                }
                }
            }
        }
        `;
        try {
            const result = await client.query({
                query,
                variables: {input: postID}
            });    
            if (result.data.postSchema_6Index.edges.length > 0 && result.data.postSchema_6Index.edges[0].node) {
                const likeCounts = result.data.postSchema_6Index.edges[0].node.PostLikesHash.length;
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

    
    const updateLikesForAPost = async (PostID, LikeHash) => {
        // First, We need to query the post's ID assigned automatically by the database
        // Since the update mutation requires the ID of the post
        const query = gql`
            query GetID($input: String!) {
            postSchema_6Index(
                filters: {
                where:{
                    PostID: {
                    equalTo: $input
                    }
                }
                }
                first:1){
                    edges {
                node {
                    id
                    PostLikesHash
                }
                }
            }
            }`;
        const result = await client.query({ 
            query,
            variables: {input: PostID}
            });
        
        const id = result.data.postSchema_Index.edges[0].node.id;
        const likes = result.data.postSchema_6Index.edges[0].node.PostLikesHash;
        const likesCopy = [...likes, LikeHash];
        // Now, we can update the likes array of the post
        const updateMutation = gql`
        mutation UpdatePostLikes($id: ID!, $PostID: String!, $PostLikesHash: [String!]!) {
            updatePostSchema_6(input: {
                id: $id
                content: {
                    PostID: $PostID,
                    PostLikesHash: $PostLikesHash
                }
                options: {
                    replace: true
                }
            }) {
                document {
                    id
                    PostID
                    PostLikesHash
                }
            }
        }`;
    try {
        await client.mutate({ 
            mutation: updateMutation,
            variables: { 
                id: id, 
                PostID: PostID, 
                PostLikesHash: likesCopy // Correctly using likesCopy here
            }
        });
    } catch (error) {
        console.error("Error updating post likes:", error);
    }
    }
            

    const [likeCounts, setLikeCounts] = useState(Array(posts.length).fill(0));
    const [liked, setLiked] = useState(false);


    const postContractAddress = '0x20Ca8dE1Aaf34E86e54603B982506813292C3272';
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

            
            // If the transaction is successful, update the UI accordingly
            const newLikeCounts = [...likeCounts];
            if (!liked) {
                newLikeCounts[index] += 1; // Increment the like count by 1
            } else {
                newLikeCounts[index] -= 1; // Decrement the like count by 1
            }
            updateLikesForAPost(posts[index].id.toString(), signature);
            console.log('Like Signature:', signature);
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
        <div className='post-container'>
            {posts.map((post, index) => (
                <Card 
                    key={index} 
                    className="post-card"

                >
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.content}</Card.Text>
                        <Button 
                            variant='outline-light'
                            className='like-button'
                            onClick={() => handleLike(index)}
                        >
                            <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i> {likeCounts[index]}
                        </Button>
                        <Card.Footer style={{ marginTop: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}> 
                            <small className="text-muted-dark" >Posted at {new Date(post.timestamp * 1000).toLocaleString()}</small>
                            <Button variant="link" style={{padding:'0px'}}>{post.author}</Button>
                            </div>

                        </Card.Footer>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );

            }

export default PostsDisplay;
