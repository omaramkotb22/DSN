import { ethers } from 'ethers';
import PostsABI from '../ABIs/PostsABI';
import FriendRequestABI from '../ABIs/FriendRequestABI';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';



const client = new ApolloClient({
    uri: 'http://localhost:5005/graphql',
    cache: new InMemoryCache()
});

export async function fetchPostsAndLikes(currentAccount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const postContract = new ethers.Contract(process.env.REACT_APP_POSTS_CONTRACT_ADDRESS, PostsABI, provider);
    const friendContract = new ethers.Contract(process.env.REACT_APP_FRIENDSHIP_CONTRACT_ADDRESS, FriendRequestABI, provider);
    
    try {
        const friends = await friendContract.getFriends(currentAccount);
        const postsData = await postContract.getPosts();

        if (friends.length === 0) {
            return { posts: [], likeCounts: [], hasNoFriends: true };
        }

        const friendAddresses = friends.map(friend => friend.toLowerCase());
        const filteredPosts = postsData.filter(post => friendAddresses.includes(post.author.toLowerCase()));

        const likeCounts = await Promise.all(filteredPosts.map(async post => {
            const likeCount = await getLikesForAPost(post.id.toString(), provider); // Assuming getLikesForAPost function exists
            return likeCount.length;
        }));

        return { posts: filteredPosts, likeCounts, hasNoFriends: false };
    } catch (error) {
        console.error("Error fetching posts or friends:", error);
        return { posts: [], likeCounts: [], hasNoFriends: true, error: error.message };
    }
}



export async function fetchAllPosts() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const postContract = new ethers.Contract(process.env.REACT_APP_POSTS_CONTRACT_ADDRESS, PostsABI, provider);

    try {
        const postsData = await postContract.getPosts();
        const likeCounts = await Promise.all(postsData.map(async post => {
            const likeCount = await getLikesForAPost(post.id.toString(), provider); // Assuming getLikesForAPost function exists
            return likeCount;
        }));

        return { posts: postsData, likeCounts };
    } catch (error) {
        console.error("Error fetching all posts:", error);
        return null;
    }
}

const getLikesForAPost = async (postID) => { 
    // Returns Length of the Likes array (Number of likes on a post)
        const query = gql`
        query GetPostLikes($input: String!){
            postSchema_7Index(
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
            if (result.data.postSchema_7Index.edges.length > 0 && result.data.postSchema_7Index.edges[0].node) {
                const likeCounts = result.data.postSchema_7Index.edges[0].node.PostLikesHash.length;
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
