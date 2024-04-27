import React, { useState, useEffect } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import '../styles/Profile.css';

function Profile({ currentUser }) {
    const [friendCount, setFriendCount] = useState(0);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [username, setUsername] = useState('');
    const [posts, setPosts] = useState([
        { id: 1, content: 'Post 1 content here...' },
        { id: 2, content: 'Post 2 content here...' },
        { id: 3, content: 'Post 3 content here...' }
    ]);

    const client = new ApolloClient({
        uri: 'http://localhost:5005/graphql',
        cache: new InMemoryCache()
    });

    const fetchUsername = async () => {
        const query = gql`
          query FindUser($input: String!) {
            userSchema_3Index(
              filters: {
                where: {
                  userAddress: {
                    equalTo: $input 
                  }
                }
              }
              first: 1) {
              edges {
                node {
                  id
                  username
                  userAddress
                  profilepic
                }
              }
            }
          }
        `;
        const result = await client.query({
          query,
          variables: {
            input: currentUser
          }
        });
        if (result.data.userSchema_3Index.edges.length > 0) {
            const userNode = result.data.userSchema_3Index.edges[0].node;
            setUsername(userNode.username);
            setProfileImageUrl(userNode.profilepic);
        }
    };

    useEffect(() => { 
        fetchUsername();
    }, [currentUser]);

    return (
        <Card className="profile-card">
            <img src={profileImageUrl} alt="Profile" className="profile-img" />
            <div className="profile-details">
                <div className="profile-title">{username}</div>
                <div className="profile-subtitle">Friends: {friendCount}</div>
                <ListGroup className="list-group-flush">
                    {posts.map(post => (
                        <ListGroupItem key={post.id}>{post.content}</ListGroupItem>
                    ))}
                </ListGroup>
            </div>
        </Card>
    );
}

export default Profile;
