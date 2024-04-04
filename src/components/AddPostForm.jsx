import React from 'react';
import { Form, Button } from 'react-bootstrap';

function AddPostForm({ newPost, setNewPost, onWritePost}) { // onWritePost is in App.js

  
  
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter post title"
          value={newPost.title}
          onChange={e => setNewPost({ ...newPost, title: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formContent">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write your post content here"
          value={newPost.content}
          onChange={e => setNewPost({ ...newPost, content: e.target.value })}
        />
      </Form.Group>
      <Button variant="primary" onClick={onWritePost}>
        Write Post
      </Button>
    </Form>
  );
}

export default AddPostForm;
