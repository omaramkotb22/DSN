import React from 'react';
import { Card, Button } from 'react-bootstrap';

function PostsDisplay({ posts, fetchPosts }) {
    fetchPosts();
    return (
        <div>
            {posts.map((post, index) => (
                <Card key={index} style={{ marginTop: '15px' }}>
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.content}</Card.Text>
                        <Button variant="link" onClick={() => console.log('Author:', post.author)}>Author</Button>
                <Card.Footer>
                    <small className="text-muted">Posted at {new Date(post.timestamp * 1000).toLocaleString()}</small>
                </Card.Footer>
                    </Card.Body>
                </Card> 
      ))}
    </div>
  );
}

export default PostsDisplay;
