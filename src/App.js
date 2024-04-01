import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import ConnectWalletButton from './components/ConnectWallet';
import AddPostForm from './components/AddPostForm';
import PostsDisplay from './components/PostsDisplay';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import { ComposeClient } from '@composedb/client';
import models from "./models/runtime-PostSchema_3-composite.json"
import PostsABI from './ABIs/PostsABI';
import { BrowserRouter as Router, Route, Navigate, Routes, useNavigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { DIDsessions } from 'did-session';
const ethers = require('ethers');


function App() {
  
  const PostcontractAddress = "0x1f982BB004E706381e5BB4DBd412ec7363D4b02A";
  const [currentAccount, setCurrentAccount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [hashList, setHashList] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    const fetchData = async () => {
      const composedb = new ComposeClient({
        ceramic: 'http://localhost:7007',
        definition: models
      });
    };
    fetchData();
  }
)
  

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask installed!");
        return;
      } else {
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

  const handleDatabaseOnWritePost = async (id) => {
    const client = new ApolloClient({
      uri: 'http://localhost:5005/graphql', 
      cache: new InMemoryCache()
    });
    const postMutation = gql`
      mutation CreatePost($postID: String!, $postLikesHash: [String]!) {
        createPostSchema_3(input: {
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
        postLikesHash: []
      }
    }).then((data) => console.log(data)).catch((error) => console.error(error));
    
  }
  
  const writePost = async () => {   // Call this function when the user clicks the "Write Post" button
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



  useEffect(() => {
    if (currentAccount) {
      setIsConnected(true);
      fetchPosts();
    }
  }, [currentAccount]);


  const handleAddPost = () => {
    console.log('Add Post Clicked');
  }

  const handleDisconnect = () => {
    console.log('Disconnect Clicked');
  }

  const handleFeed = () => {
    console.log('Feed Clicked');
  }
  const handleProfile = () => {
    console.log('Profile Clicked');
  }
  const handleCommunities = () => {
    console.log('Communities Clicked');
  }






  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh'}}>
        {isConnected && 
        ( 
        
          <div>
          <Sidebar show={sidebarOpen} toggleSidebar={toggleSidebar} onAddPost={handleAddPost} onDisconnect={handleDisconnect} onFeed={handleFeed} onProfile={handleProfile}/>
            <button onClick={toggleSidebar} style={{ 
              fontSize: '30px', 
              cursor: 'pointer', 
              backgroundColor: 'transparent', 
              border: 'none', 
              position: 'absolute', 
              top: '0px', 
              left: '0px',
              }}>
              {sidebarOpen ? '✖️' : '☰'}
            </button>
          </div>
        )
        }
       
        <div style={{ flex: 1, transition: 'margin-left .5s', marginLeft: sidebarOpen ? '250px' : '0px'}}>
          <Container>
            <h1 style={{color: '#0D6EFD', 
            border: '2px solid #0D6EFD', 
            borderRadius: '10px', 
            display: 'inline-block',
            paddingLeft: '10px',
            paddingRight: '40px',
            fontFamily: 'Helvetica',
            fontWeight: 'bolder',
            }}>
              A Decentralized Social Network
              </h1>
            <Routes>
              <Route path="/" element={isConnected ? <Navigate to="/posts" /> : <Navigate to="/connect" />} />
              <Route path="/connect" element={!isConnected ? <ConnectWalletButton onConnect={requestAccount} /> : <Navigate to="/posts" />} />
              <Route path="/add-post" element={isConnected ? <AddPostForm newPost={newPost} setNewPost={setNewPost} onWritePost={writePost} AddPostForm={writePost}/> : <Navigate to="/connect" />} />
              <Route path="/posts" element={isConnected ? <PostsDisplay posts={posts} fetchPosts={fetchPosts}/> : <Navigate to="/connect" />} />
              <Route path="/communities" element={isConnected ? <div>Communities</div> : <Navigate to="/connect" />} />
              <Route path="/profile" element={isConnected ? <Profile /> : <Navigate to="/posts" />} />
              
            </Routes>



          </Container>
        </div>
      </div>
    </Router>
  );


}
export default App;