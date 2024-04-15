import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import ConnectWalletButton from './components/ConnectWallet';
import AddPostForm from './components/AddPostForm';
import PostsDisplay from './components/PostsDisplay';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import CreateProfile from './components/CreateProfile';
import AccountDetails from './components/AccountDetails';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import PostsABI from './ABIs/PostsABI';

const ethers = require('ethers');

function App() {
  const PostcontractAddress = "0x1F36291C52eFd8BB88C127377cbE994FDFF69082";
  const [currentAccount, setCurrentAccount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); // Adjusted for initial state

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Removed navigation logic from here

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
      if (ethereum) {
        console.log("We have the ethereum object", ethereum);
        try {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  const requestAccount = async () => {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(account);
    console.log("Connected", account);
  };


  const fetchPosts = async () => {   // Fetch posts from the blockchain

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(PostcontractAddress, PostsABI, provider);
      try {
        const data = await contract.getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error: ", err);
      }
    }    
  };
  const writePost = async () => {   // Call this function when the user clicks the "Add Post" button
    if (!newPost.title || !newPost.content) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(PostcontractAddress, PostsABI, signer);
      const transaction = await contract.writePost(newPost.title, newPost.content);
      await transaction.wait();
      const postId = await contract.getLastPostId();
      
      handleDatabaseOnWritePost(postId.toString());
      setNewPost({ title: '', content: '' }); // Reset form after submission
      fetchPosts(); // Fetch all posts again to update UI
    }
  };
  const handleDatabaseOnWritePost = async (id) => {
    const client = new ApolloClient({
      uri: 'http://localhost:5005/graphql', 
      cache: new InMemoryCache()
    });
    const postMutation = gql`
      mutation CreatePost($postID: String!, $postLikesHash: [String]!) {
        createPostSchema_4(input: {
        content: {
          PostID: $postID,
          PostLikesHash: $postLikesHash
        },
          
        }) {
          document
         {
          PostID
          PostLikesHash
          }
        }
      }
  `;
    client.mutate({ 
      mutation: postMutation, 
      variables: { 
        postID: id.toString(),
        postLikesHash: [] // A new post would obviously have no likes so an empty array
      }
    }).then((data) => console.log(data)).catch((error) => console.error(error));
    
  }

  const CheckIfUserExists = async () => {
    const client = new ApolloClient({
      uri: 'http://localhost:5005/graphql',
      cache: new InMemoryCache()
    });
    const checkUserQuery = gql`
      query FindIfUserExists($userAddress: String!) { 
          userSchemaIndex(
            filters: {
              where: {
                userAddress: {
                  equalTo: $userAddress
                }
              }
            }
            first: 1) {
            edges {
              node {
                id
                usename
                userAddress
              }
                }
                  } 
      }`;
    try {    
      const userAddressResults = await client.query({
          query: checkUserQuery,             
          variables: {userAddress: currentAccount.toString()},
      })
      console.log(userAddressResults);
      // Checks if Query returns an empty array, if yes then the user is new
      if((await userAddressResults).data.userSchemaIndex.edges.length === 0){
        setIsNewUser(true);
      }
      else {
        setIsNewUser(false);
      }
      }  catch (error)
      { 
        console.log(error);
      }
  }
  

  useEffect(() => {
    if (currentAccount) {
      setIsConnected(true);
      fetchPosts();
    }
    
  }, [currentAccount]);

  useEffect(() => { // This function shouldnt be called on use effect, instead on Connect wallet
    if (currentAccount) {
      CheckIfUserExists();
    }
  }, [currentAccount]); 

  return (

    <Router styles={styles.appContainer}>
      <div style={{ display: 'flex', height: '100vh'}}>
      {(isConnected && !isNewUser) &&
        (     
          <div>
          <Sidebar show={sidebarOpen} toggleSidebar={toggleSidebar} />
            <button onClick={toggleSidebar} style={styles.toggleButton}>
              {sidebarOpen ? <p style={{color: 'red'}}>✖️</p> : <p style={{color:"#0D6EFD"}}>☰</p>}
            </button>
          </div>
        )}
    
        <Container style={{ ...styles.mainContainer, marginLeft: sidebarOpen ? '250px' : '0px' }}>
          
          <h1 style={styles.header}>
            A Decentralized Social Network
          </h1>
          <Routes>
            <Route path="/" element={isConnected ? (isNewUser ? <Navigate to="/create-profile" /> : <Navigate to="/posts" />) : <Navigate to="/connect" />} />
            <Route path="/connect" element={!isConnected ? <ConnectWalletButton onConnect={requestAccount} account={currentAccount} isNewUser={isNewUser}/> : (isNewUser ? <Navigate to="/create-profile" /> : <Navigate to="/posts" />)} />
            <Route path="/create-profile" element={isConnected && isNewUser ? <CreateProfile onCreateProfile={() => {setIsConnected(true); setIsNewUser(false)} } account={currentAccount}/> : <Navigate to="/posts" />} />
            <Route path="/add-post" element={isConnected ? <AddPostForm newPost={newPost} setNewPost={setNewPost} onWritePost={writePost}/> : <Navigate to="/connect" />} />
            <Route path="/posts" element={isConnected ? <PostsDisplay posts={posts} fetchPosts={fetchPosts}/> : <Navigate to="/connect" />} />
            <Route path="/communities" element={isConnected ? <div>Communities</div> : <Navigate to="/connect" />} />
            <Route path="/profile" element={isConnected ? <Profile /> : <Navigate to="/posts" />} />
        </Routes>
        </Container>
        {(isConnected && !isNewUser) && <AccountDetails Address={currentAccount} />}
      </div>
    </Router>
  );
}
const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh'
  },
  mainContainer: {
    flex: 1,
    transition: 'margin-left .5s'
  },
  toggleButton: {
    fontSize: '30px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    position: 'absolute',
    top: '0px',
    left: '0px',
    color: '#0D6EFD'
  },
  header: {
    color: '#0D6EFD',
    border: '2px solid #0D6EFD',
    borderRadius: '10px',
    display: 'inline-block',
    padding: '10px 40px',
    fontFamily: 'Helvetica',
    fontWeight: 'bold'
  }
};

export default App;
