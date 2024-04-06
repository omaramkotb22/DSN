import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you would typically handle the form submission,
    // like sending the data to your backend or smart contract.
    console.log({ username, bio });
    
    // After creating the profile, redirect to '/posts'
    navigate('/posts');
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
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
    </Container>
  );
};

export default CreateProfile;
