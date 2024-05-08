
import { Card, Button } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css'; 

import '../styles/PostCard.css';
function PostCard({ post, index, handleLike, handleShowModal, liked, likeCounts, disabled }) {
    return (
        <Card key={index} className="post-card">
            <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.content}</Card.Text>
                {post.imageHash && (
                    <div className='card-image'>
                        <img
                            src={`https://gateway.pinata.cloud/ipfs/${post.imageHash}`}
                            alt="Post"
                            style={{ cursor: 'pointer', maxWidth: '100px', borderRadius: "25px" }} // Thumbnail size
                            onClick={() => handleShowModal(post.imageHash)}
                        />
                    </div>
                )}
                <Button
                variant={disabled ? 'secondary' : 'primary'}
                onClick={handleLike}
                disabled={disabled}
                className={`like-button ${disabled ? 'liked' : ''}`}
                >
                <i className={`bi ${disabled ? 'bi-heart-fill' : 'bi-heart'}`}></i>{likeCounts}
                </Button>
            </Card.Body>
            <Card.Footer style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <small className="text-muted-dark">Posted at {new Date(post.timestamp * 1000).toLocaleString()}</small>
                    <Button variant="link" style={{ padding: '0px' }}>{post.author}</Button>
                </div>
            </Card.Footer>
        </Card>
    );
}

export default PostCard;