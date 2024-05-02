import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PostCard from './PostCard';
import { fetchPostsAndLikes } from '../services/PostServices'; // Assuming this service is correctly set up
import { Link } from 'react-router-dom';
import '../styles/PostsDisplay.css';
function PostsDisplay({ currentAccount }) {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [likeCounts, setLikeCounts] = useState([]);
    const [hasNoFriends, setHasNoFriends] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            const data = await fetchPostsAndLikes(currentAccount);
            if (data) {
                setPosts(data.posts);
                setLikeCounts(data.likeCounts);
                setHasNoFriends(data.hasNoFriends);
            }
        };
        loadData();
    }, [currentAccount]);

    const handleShowModal = (imageHash) => {
        setSelectedImage(`https://gateway.pinata.cloud/ipfs/${imageHash}`);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    if (hasNoFriends) {
        return (
            <div className="text-center">
                <p className='has-no-friends'>You currently have no friends to show posts from.</p>
                <Button as={Link} to="/communities" variant="link">Explore Community</Button>
            </div>
        );
    }

    return (
        <div className='post-container'>
            {posts.map((post, index) => (
                <PostCard
                    key={index}
                    post={post}
                    handleShowModal={() => handleShowModal(post.imageHash)}
                    likeCounts={likeCounts[index] || 0}
                />
            ))}
            <Modal variant="dark" show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title >Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={selectedImage} alt="Full Post" style={{ width: '100%' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
}



export default PostsDisplay;
