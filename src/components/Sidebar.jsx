import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Sidebar({ show }) {
    return (
        <div style={{
            width: '250px', // Width of the sidebar
            position: 'fixed',
            zIndex: '1000',
            top: '0',
            left: show ? '0' : '-250px', // Adjust left property based on show
            bottom: '0',
            backgroundColor: '#343a40', // Background color of the sidebar
            transition: 'left 0.5s ease', // Smooth transition for sliding effect
            overflowX: 'hidden', // Prevent horizontal scroll
        }}>
            <Nav className='flex-column' style={{
                height: '100%', // Full height
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <NavLink to="/profile" style={{margin: '10px'}}>
                    <img src="https://img.icons8.com/material-rounded/96/228BE6/user-male.png" alt="Profile" style={{width: '50px', height: '50px'}} />
                </NavLink>
                <NavLink to="/posts" style={{margin: '10px'}}>
                    <img src="https://img.icons8.com/material-rounded/96/228BE6/news.png" alt="Feed" style={{width: '50px', height: '50px'}} />
                </NavLink>
                <NavLink to="/add-post" style={{margin: '10px'}}>
                    <img src="https://img.icons8.com/material-rounded/96/228BE6/plus--v1.png" alt="Add Post" style={{width: '50px', height: '50px'}} />
                </NavLink>
                <NavLink to="/communities" style={{margin: '10px'}} >
                    <img src="https://img.icons8.com/material-rounded/96/228BE6/share-2.png" alt="Communities" style={{width: '50px', height: '50px'}} />
                </NavLink>
            </Nav>
        </div>
    );
}

export default Sidebar;
