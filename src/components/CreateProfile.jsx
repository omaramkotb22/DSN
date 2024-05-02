import React, { useState } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { addImagetoIPFS } from '../services/IPFSImagesService';

function CreateProfile({ onCreateProfile, account }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const ipfsHash = await addImagetoIPFS(file);
      setProfilePic(ipfsHash);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const client = new ApolloClient({
      uri: 'http://localhost:5005/graphql',
      cache: new InMemoryCache()
    });
    const createProfileMutation = gql`
      mutation AddNewUser($username: String!, $profilepic: String!, $bio: String!, $userAddress: String!) {
        createUserSchema_4(
          input: {
            content: {
              bio: $bio
              username: $username
              userAddress: $userAddress
              profilepic: $profilepic
            }
          }
        ) {
          document {
            id
            bio
            username
            userAddress
            profilepic
          }
        }
      }
    `;

    try {
      await client.mutate({
        mutation: createProfileMutation,
        variables: {
          bio,
          username,
          userAddress: account,
          profilepic: profilePic // Use the already uploaded IPFS hash
        }
      });
      navigate('/posts');
      onCreateProfile();
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Card bg='dark' style={{ marginTop: '15px'}} text='white' padding='20px'>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bio">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Tell us about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Profile Picture</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Profile
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default CreateProfile;