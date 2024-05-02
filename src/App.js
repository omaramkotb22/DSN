import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import {create} from 'ipfs-http-client';
import axios from 'axios';
import FormData from 'form-data';

// Components 
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
import Communities from './components/Communities';

// Hooks 
import { useEthereum } from './hooks/useEthereum';


const ethers = require('ethers');

function App() {
  const { currentAccount, isConnected, setIsConnected,requestAccount } = useEthereum();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); // Adjusted for initial state
  const PostcontractAddress = process.env.REACT_APP_POSTS_CONTRACT_ADDRESS;

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  const handleFileUpload = async (file) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
        name: file.name,
        keyvalues: { exampleKey: 'exampleValue' }
    });
    formData.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0
    });
    formData.append('pinataOptions', pinataOptions);

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNWUzNWI0ZC0wM2NhLTQxZDEtODY4MS0xMGQwOGJiZjAyZjQiLCJlbWFpbCI6Im9tYXJhbWtvdGIyMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDEwMDZlMzY4NDA0MTYxNjI2OTIiLCJzY29wZWRLZXlTZWNyZXQiOiJmZjczMjY3NTVhYmNlYjdhMDdjZWY0MWU1ZDljYTYxYjFkYzZhYTAyNGM3MjcxYzIyOWI3ZWZlYmY1YjI3Y2Y2IiwiaWF0IjoxNzE0NTIwNzQzfQ.RKDHFjyvDHy6ww0HqpuKNItyNIKNso_SXTHegeRec8w`
            }
        });
        console.log('IPFS response:', response.data);
        return response.data.IpfsHash; // Return the IPFS hash of the uploaded file
    } catch (error) {
        console.error('Error uploading file to IPFS:', error.response ? error.response.data : error);
        return null;
    }
};

// Include this function in the part where you handle post creation
const onFileChange = async (event) => {
      const file = event.target.files[0];
      const imageHash = await handleFileUpload(file);
      console.log('Image hash:', imageHash);
      if (imageHash) {
          const title = newPost.title;
          const content = newPost.content;
          await createPostWithImage(title, content, imageHash); // Assume createPostWithImage is a function that handles posting
      } else {
          console.error('Failed to upload image to IPFS');
      }
};

  const createPostWithImage = async (title, content, imageHash) => {
    if (!title || !content || !imageHash) return;

    if (typeof window.ethereum !== 'undefined') {
        await requestAccount(); // Ensure this function correctly prompts the user to connect their wallet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(PostcontractAddress, PostsABI, signer);
        
        try {
            const transaction = await contract.writePostWithImage(title, content, imageHash);
            await transaction.wait();
            const postId = await contract.getLastPostId();
            handleDatabaseOnWritePost(postId.toString()); // Ensure this handles database logic correctly
            setNewPost({ title: '', content: '' }); // Reset form state
            console.log('Post created with ID:', postId.toString());
        } catch (error) {
            console.error('Failed to create post with image:', error);
        }
    } else {
        console.error('Ethereum object not found');
    }
};
  
  // useEffect(() => {
  //   const checkIfWalletIsConnected = async () => {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       console.log("We have the ethereum object", ethereum);
  //       try {
  //         const accounts = await ethereum.request({ method: 'eth_accounts' });
  //         if (accounts.length > 0) {
  //           setCurrentAccount(accounts[0]);
  //           setIsConnected(true);
  //         }
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   };
  //   checkIfWalletIsConnected();
  // }, []);

  const fetchPosts = async () => {   // Fetch posts from the blockchain

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(PostcontractAddress, PostsABI, provider);
      try {
        const data = await contract.getPosts();
        console.log("Posts: ", data);
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
        createPostSchema_7(input: {
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
          userSchema_4Index(
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
      if((await userAddressResults).data.userSchema_4Index.edges.length === 0){
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
      dsnLogo: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#0D6EFD',
      position: 'absolute',
      top: '10px',
      left: '70px',
      zIndex: '100',
      transition: 'transform 0.5s ease', 
      transform: sidebarOpen ? 'translateX(250px)' : 'translateX(0px)'
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


  return (

    <Router styles={styles.appContainer}>
      {(isConnected && !isNewUser) &&  
      <div style={styles.headerContainer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Sidebar show={sidebarOpen} toggleSidebar={toggleSidebar} />
          <button onClick={toggleSidebar} style={styles.toggleButton}>
            {sidebarOpen ? <p>✖️</p> : <p style={{color:"#0D6EFD"}}>☰</p>}
          </button>
          <h1 style={styles.dsnLogo}>
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
              <Route path="/add-post" element={isConnected ? <AddPostForm newPost={newPost} setNewPost={setNewPost} onWritePost={createPostWithImage} onFileChange={onFileChange} currentAccount={currentAccount}/> : <Navigate to="/connect" />} />
              <Route path="/posts" element={isConnected ? <PostsDisplay/> : <Navigate to="/connect" />} />
              <Route path="/communities" element={isConnected ? <Communities /> : <Navigate to="/connect" />} />
              <Route path="/profile" element={isConnected ? <Profile currentUser={currentAccount}/> : <Navigate to="/posts" />} />
              <Route path="/users/:userAddress" element={<ViewUserProfile currentUser={currentAccount}/>} />
            </Routes>
        </Container>
      </div>
    </Router>
  );
}



export default App;