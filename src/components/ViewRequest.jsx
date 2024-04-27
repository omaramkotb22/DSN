import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

function ViewRequest({ username, onAccept, onReject }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#343a40', color: 'white', marginBottom: '5px', borderRadius: '5px' }}>
      <span>{username}</span>
      <ButtonGroup>
        <Button variant="success" size="sm" onClick={onAccept}>
          <i className="bi bi-check-lg"></i>
        </Button>
        <Button variant="danger" size="sm" onClick={onReject}>
          <i className="bi bi-x-lg"></i>
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default ViewRequest;