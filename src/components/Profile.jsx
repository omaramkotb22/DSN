import React, { useState, useEffect } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import '../styles/Profile.css';

function Profile({ currentUser }) {
    const [friendCount, setFriendCount] = useState(0);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [userAddress, setuserAddress] = useState('');
    const client = new ApolloClient({
        uri: 'http://localhost:5005/graphql',
        cache: new InMemoryCache()
    });

    const fetchUsername = async () => {
        const query = gql`
          query FindUser($input: String!) {
            userSchema_4Index(
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
                  bio
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
        if (result.data.userSchema_4Index.edges.length > 0) {
            const userNode = result.data.userSchema_4Index.edges[0].node;
            setUsername(userNode.username);
            setProfileImageUrl(userNode.profilepic);
            setBio(userNode.bio);
            setuserAddress(userNode.userAddress);
        }
    };

    useEffect(() => { 
        fetchUsername();
    }, [currentUser]);

    return (
        <Card className="profile-card">
            <img src={`https://gateway.pinata.cloud/ipfs/${profileImageUrl}`} alt="Profile" className="profile-img" />
            <div className="profile-details">
                <div className="profile-title">{username}</div>
                <div className="profile-subtitle">{bio}</div>
                <div className="profile-subtitle">{userAddress}</div>
                <div className="profile-subtitle"></div>
            </div>
        </Card>
    );
}

export default Profile;
