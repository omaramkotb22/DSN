import {React, useEffect, useState} from 'react';
import { Card, Button } from 'react-bootstrap';

function PostsDisplay({ posts, fetchPosts }) {
    useEffect(() => {
        fetchPosts();
        setLikeCounts(Array(posts.length).fill(0));
    }, [posts.length]);

    useEffect(() => { // This effect will print the address of all posts in the console
        console.log(posts);
    }, [posts]);
    const [likeCounts, setLikeCounts] = useState(Array(posts.length).fill(0));
    const [liked, setLiked] = useState(false);
    const handleLike = index => {
        if (!liked){
            const newLikeCounts = [...likeCounts]; // Array that contains the likes 
            newLikeCounts[index] += 1; // Increment the like count by 1
            setLikeCounts(newLikeCounts); // Update the like count
            setLiked(true);
        }
        else{
            const newLikeCounts = [...likeCounts]; // Array that contains the likes 
            newLikeCounts[index] -= 1; // Decrement the like count by 1
            setLikeCounts(newLikeCounts); // Update the like count
            setLiked(false);
        }
    };

    return (
        <div>
            {posts.map((post, index) => (
                <Card key={index} style={{ marginTop: '15px' }}>
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.content}</Card.Text>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={() => handleLike(index)}
                        >
                            Like {likeCounts[index]}
                        </button>
                        <Card.Footer style={{ marginTop: '15px' }}>
                            <small className="text-muted">Posted at {new Date(post.timestamp * 1000).toLocaleString()}</small>
                            <Button variant="link" onClick={() => console.log('Author:', post.author)}>Author</Button>
                        </Card.Footer>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}

export default PostsDisplay;
