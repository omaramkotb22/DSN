import React, { useState, useEffect } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';

function Profile() {
    // Sample state data for friends count and posts
    const [friendCount, setFriendCount] = useState(0); // Example friend count
    const [posts, setPosts] = useState([
        { id: 1, content: 'Post 1 content here...' },
        { id: 2, content: 'Post 2 content here...' },
        { id: 3, content: 'Post 3 content here...' }
    ]); // Example posts array

    // Image URL
    const profileImageUrl = "https://i.imgur.com/your-image.jpg"; // Replace with actual URL from a secured source

    return (
        <Card style={{ width: '18rem', marginTop: '20px' }}>
            <Card.Img variant="top" src={profileImageUrl} style={{ width: '100%', borderRadius: '50%' }} />
            <Card.Body>
                <Card.Title>Friends: {friendCount}</Card.Title>
                <ListGroup className="list-group-flush">
                    {posts.map(post => (
                        <ListGroupItem key={post.id}>{post.content}</ListGroupItem>
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default Profile;