import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ConnectWalletButton from './ConnectWallet';
import AddPostForm from './AddPostForm';
import PostsDisplay from './PostsDisplay';
import Profile from './Profile';
import CreateProfile from './CreateProfile';

function RoutesComponent(isConnected, isNewUser, requestAccount, currentAccount, newPost, setNewPost, writePost, fetchPosts, posts, setIsNewUserAndConnected) {
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} timeout={300} classNames="fade">
        <Routes location={location}>
        <Route path="/" element={isConnected ? (isNewUser ? <Navigate to="/create-profile" /> : <Navigate to="/posts" />) : <Navigate to="/connect" />} />
            <Route path="/connect" element={!isConnected ? <ConnectWalletButton onConnect={requestAccount} account={currentAccount} isNewUser={isNewUser}/> : (isNewUser ? <Navigate to="/create-profile" /> : <Navigate to="/posts" />)} />
            <Route path="/create-profile" element={isConnected && isNewUser ? <CreateProfile onCreateProfile={setIsNewUserAndConnected} account={currentAccount}/> : <Navigate to="/posts" />} />
            <Route path="/add-post" element={isConnected ? <AddPostForm newPost={newPost} setNewPost={setNewPost} onWritePost={writePost}/> : <Navigate to="/connect" />} />
            <Route path="/posts" element={isConnected ? <PostsDisplay posts={posts} fetchPosts={fetchPosts}/> : <Navigate to="/connect" />} />
            <Route path="/communities" element={isConnected ? <div>Communities</div> : <Navigate to="/connect" />} />
            <Route path="/profile" element={isConnected ? <Profile /> : <Navigate to="/posts" />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default RoutesComponent;
