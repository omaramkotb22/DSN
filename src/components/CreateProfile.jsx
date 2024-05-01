import React, { useState } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

function CreateProfile({onCreateProfile, account}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const client = new ApolloClient({
      uri: 'http://localhost:5005/graphql',
      cache: new InMemoryCache()
    });
    // Add Profile to Database
    const createProfileMutation = gql`
        mutation AddNewUser($username:String!,$profilepic: String! , $bio: String!, $userAddress: String!) {
            createUserSchema_4(
              input: {
              content: {
                bio: $bio
                username: $username
                userAddress: $userAddress
                profilepic: $profilepic
              }
            }) {
              
              document {
                  id
                  bio
                  username
                  userAddress
                }
              
                }
        }
    `;
    try {
      await client.mutate({
        mutation: createProfileMutation,
        variables: {
          bio: bio,
          username: username, 
          userAddress: account,
          profilepic: 'https://wallpapers.com/images/featured/picture-en3dnh2zi84sgt3t.jpg'
        }
      });
      navigate('/posts');
      onCreateProfile();
    } catch (error) {
      console.error("Error creating profile:", error);
    }
    onCreateProfile(); // A function that sets the user to both connected and old (To enable the routes)

  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Card
        bg='dark'
        style={{ marginTop: '15px'}}
        text='white'
        padding='20px'
      >
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username" padding="20px">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="bio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Tell us about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Profile
        </Button>
      </Form>
      </Card>
    </Container>
  );
};

export default CreateProfile;
