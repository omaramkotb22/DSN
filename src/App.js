import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import ConnectWalletButton from './components/ConnectWallet';
import AddPostForm from './components/AddPostForm';
import PostsDisplay from './components/PostsDisplay';
import Sidebar from './components/Sidebar';
import ABI from './ABI';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
const ethers = require('ethers');

function App() {
  
  const PostcontractAddress = "0xaaFF4d419393597c356CdCdfFa54EB6b0A9d81DE";
  const [currentAccount, setCurrentAccount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  
  useEffect(() => { 
    const { ethereum } = window;
    if (!ethereum) { // Check if MetaMask is available
      console.log("Make sure you have MetaMask installed!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }, []);

  // Request access to the user's MetaMask account
  const requestAccount = async () => {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(account);
  };

  const fetchPosts = async () => {   // Fetch posts from the blockchain

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(PostcontractAddress, ABI, provider);
      try {
        const data = await contract.getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error: ", err);
      }
    }    
  };

  const writePost = async () => {   // Call this function when the user clicks the "Write Post" button

    if (!newPost.title || !newPost.content) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(PostcontractAddress, ABI, signer);
      const transaction = await contract.writePost(newPost.title, newPost.content);
      console.log(transaction.hash);
      await transaction.wait();
      setNewPost({ title: '', content: '' }); // Reset form after submission
      fetchPosts(); // Fetch all posts again to update UI
    }
  };
    // Functions for handling sidebar actions
    const handleAddPost = () => {
      // Logic for adding a post
      console.log('Add Post Clicked');
    };
  
    const handleFeed = () => {
      // Logic for showing the feed
      console.log('Feed Clicked');
    };
  
    const handleProfile = () => {
      // Logic for showing the profile
      console.log('Profile Clicked');
    };
  
    const handleDisconnect = () => {

      }

  useEffect(() => {
    if (currentAccount) {
      setIsConnected(true);
      fetchPosts();
    }
  }, [currentAccount]);
      
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar show={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div style={{ flex: 1, transition: 'margin-left .5s', marginLeft: sidebarOpen ? '250px' : '0px' }}>
          <button onClick={toggleSidebar} style={{ fontSize: '30px', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', position: 'absolute', top: '20px', left: sidebarOpen ? '250px' : '20px', zIndex: '2' }}>
            ☰
          </button>
          <Container>
            <h1>A Decentralized Social Network</h1>
            <Routes>
              <Route path="/connect" element={!isConnected ? <ConnectWalletButton onConnect={requestAccount} /> : <Navigate to="/posts" />} />
              <Route path="/add-post" element={isConnected ? <AddPostForm newPost={newPost} setNewPost={setNewPost} onWritePost={writePost} /> : <Navigate to="/connect" />} />
              <Route path="/posts" element={isConnected ? <PostsDisplay posts={posts} fetchPosts={fetchPosts}/> : <Navigate to="/connect" />} />
              <Route path="/" element={isConnected ? <Navigate to="/posts" /> : <Navigate to="/connect" />} />
            </Routes>
          </Container>
        </div>
      </div>
    </Router>
  );

};
export default App;
