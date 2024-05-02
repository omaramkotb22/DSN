import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { fetchAllPosts } from '../services/PostServices'; // Assuming this service is correctly set up
import { Modal } from 'react-bootstrap';

function Communities() {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [likeCounts, setLikeCounts] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchAllPosts();
            if (data) {
                setPosts(data.posts);
                setLikeCounts(data.likeCounts);
            }
        };
        loadData();
    }, []);

    const handleShowModal = (imageHash) => {
        setSelectedImage(`https://gateway.pinata.cloud/ipfs/${imageHash}`);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className='post-container'>
            {posts.map((post, index) => (
                <PostCard
                    key={index}
                    post={post}
                    handleShowModal={() => handleShowModal(post.imageHash)}
                    likeCounts={likeCounts[index]}
                    handleLike={() => console.log("handleLike(index)")}
                />
            ))}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={selectedImage} alt="Full Post" style={{ width: '100%' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Communities;