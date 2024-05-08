import React, { useEffect } from 'react';
import { Form, Button, Container, Card  } from 'react-bootstrap';
import '../styles/AddPost.css';

function AddPostForm({ newPost, setNewPost, onWritePost, onFileChange}) { 
  useEffect(() => {
    console.log('New post:', newPost);
  }); 
  return (
    <Container className="mt-4" variant='secondry'>
      <Card className="add-post-card">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                className="add-post-form-control"
                type="text"
                placeholder="Enter post title"
                value={newPost.title}
                onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                className="add-post-form-control"
                as="textarea"
                rows={3}
                placeholder="Write your post content here"
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFile">
              <Form.Label>Image</Form.Label>
              <Form.Control
                className="add-post-form-control"
                type="file"
                onChange={onFileChange}
              />
            </Form.Group>
            <Button 
              className="add-post-btn"
              variant="primary" 
              onClick={onWritePost}>
              Write Post
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddPostForm;