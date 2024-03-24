import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

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

            <Nav className='flex-column'>
                <NavLink to="/add-post" onClick={onAddPost}>Add Post</NavLink>
                <NavLink to="/posts" onClick={onFeed}>Feed</NavLink>
                <NavLink to="/profile" onClick={onProfile}>Profile</NavLink>
                <NavLink to="/connect" onClick={onDisconnect}>Disconnect Wallet</NavLink>
            </Nav>

        
        </div>
    );
}

export default Sidebar;