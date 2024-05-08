import React, { useState } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import axios from 'axios';

function CreateProfile({ onCreateProfile, account }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      setIsUploading(true);

      try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNWUzNWI0ZC0wM2NhLTQxZDEtODY4MS0xMGQwOGJiZjAyZjQiLCJlbWFpbCI6Im9tYXJhbWtvdGIyMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjg3NGQyZTljN2MyMzRlZGQ4MDUiLCJzY29wZWRLZXlTZWNyZXQiOiJhMWQyMjg1OTc4MWNiMTI2OTU0MGZiZjNiZWJjNDViOTg4NjQxYThjZDg5YjMwMzJiZTU1Yjg1NWEwMjAwOTA2IiwiaWF0IjoxNzE1MDkwNzM0fQ.wQ_sas27PXBLOsshnA1bU14ATVv2VKnYtGvNUNjOuTQ`
          }
        });
        setProfilePic(response.data.IpfsHash);
        setIsUploading(false);
        console.log('File uploaded to IPFS. Hash:', response);
      } catch (error) {
        console.error('Error uploading file to IPFS:', error);
      }
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

          <Button variant="primary" type="submit" disabled={!profilePic || isUploading}>
            {isUploading ? 'Uploading...' : 'Create Profile'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}


export default CreateProfile;