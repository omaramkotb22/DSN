import React from 'react';
import { Nav } from 'react-bootstrap';

function Sidebar({ show, onAddPost, onFeed, onProfile, onDisconnect }) {
    return (
        <div style={{
            transform: show ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            width: '250px',
            height: '100vh',
            position: 'fixed',
            zIndex: '1',
            top: '0',
            left: '0',
            backgroundColor: '#f8f9fa',
            overflowX: 'hidden',
            paddingTop: '20px',
            boxShadow: '2px 0 5px 0 rgba(0,0,0,0.5)'
        }}>
            <Nav className="flex-column">
                <Nav.Link onClick={onAddPost}>Add Post</Nav.Link>
                <Nav.Link onClick={onFeed}>Feed</Nav.Link>
                <Nav.Link onClick={onProfile}>Profile</Nav.Link>
                <Nav.Link onClick={onDisconnect}>Disconnect Wallet</Nav.Link>
            </Nav>
        </div>
    );
}

export default Sidebar;