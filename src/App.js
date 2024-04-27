import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import ConnectWalletButton from './components/ConnectWallet';
import AddPostForm from './components/AddPostForm';
import PostsDisplay from './components/PostsDisplay';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import SearchBar from './components/SearchBar';
import CreateProfile from './components/CreateProfile';
import AccountDetails from './components/AccountDetails';
import {useNavigate, BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import ViewUserProfile from './components/ViewUserProfile';
import PostsABI from './ABIs/PostsABI';
import ViewNotifications from './components/ViewNotifications';

const ethers = require('ethers');

function App() {
  const PostcontractAddress = "0x20Ca8dE1Aaf34E86e54603B982506813292C3272";
  const [currentAccount, setCurrentAccount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); // Adjusted for initial state

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };
  
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
        createPostSchema_6(input: {
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
          userSchema_3Index(
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
                username
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
      if((await userAddressResults).data.userSchema_3Index.edges.length === 0){
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

  useEffect(() => {
    if (currentAccount) { // Since on start up, currentAccount is null
      CheckIfUserExists();
    }
  }, [currentAccount]); 

  return (

    <Router styles={styles.appContainer}>
      {(isConnected && !isNewUser) &&  
      <div style={styles.headerContainer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Sidebar show={sidebarOpen} toggleSidebar={toggleSidebar} />
          <button onClick={toggleSidebar} style={styles.toggleButton}>
            {sidebarOpen ? <p>✖️</p> : <p style={{color:"#0D6EFD"}}>☰</p>}
          </button>
          <h1 style={styles.header}>
            DSN
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SearchBar style={{position: 'absolute;', bottom:'0'}}/>
          <div style={{ marginLeft: '10px' }} />
          <AccountDetails Address={currentAccount} />
          <div style={{ marginLeft: '50px' }} /> 
          <ViewNotifications account={currentAccount} />
        </div>
      </div>
    }
    

      <div>
        <Container style={{ ...styles.mainContainer, marginLeft: sidebarOpen ? '250px' : '0px' }}>
            <Routes>
              <Route path="/" element={isConnected ? (isNewUser ? <Navigate to="/create-profile" /> : <Navigate to="/posts" />) : <Navigate to="/connect" />} />
              <Route path="/connect" element={!isConnected ? <ConnectWalletButton onConnect={requestAccount} account={currentAccount} isNewUser={isNewUser}/> : (isNewUser ? <Navigate to="/create-profile" /> : <Navigate to="/posts" />)} />
              <Route path="/create-profile" element={isConnected && isNewUser ? <CreateProfile onCreateProfile={() => {setIsConnected(true); setIsNewUser(false)} } account={currentAccount}/> : <Navigate to="/posts" />} />
              <Route path="/add-post" element={isConnected ? <AddPostForm newPost={newPost} setNewPost={setNewPost} onWritePost={writePost}/> : <Navigate to="/connect" />} />
              <Route path="/posts" element={isConnected ? <PostsDisplay posts={posts} fetchPosts={fetchPosts}/> : <Navigate to="/connect" />} />
              <Route path="/communities" element={isConnected ? <div>Communities</div> : <Navigate to="/connect" />} />
              <Route path="/profile" element={isConnected ? <Profile currentUser={currentAccount}/> : <Navigate to="/posts" />} />
              <Route path="/users/:userAddress" element={<ViewUserProfile currentUser={currentAccount}/>} />
            </Routes>
        </Container>
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
    top: '10px',
    left: '10px',
    zIndex: '2000',
    color: '#0D6EFD',
    width: '50px', 
    height: '50px', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    color: '#EFEFEF', 
    backgroundColor: '#162447', 
    border: '1px solid #1F4068',
    borderRadius: '5px', 
    display: 'inline-block',
    padding: '10px 20px',
    fontFamily: 'Arial, sans-serif', 
    fontWeight: 'bold',
    textShadow: '2px 2px 4px #1F4068', 
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', 
    transition: 'all 0.3s ease-in-out', 
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px', 
  }
};

export default App;
