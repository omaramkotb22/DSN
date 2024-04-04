import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Sidebar({ show }) {
    const circleSize = 200; // The size of the circular menu
    return (
        <div style={{
            transform: show ? 'scale(1)' : 'scale(0)',
            transformOrigin: 'top left',
            transition: 'transform 0.3s ease',
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            position: 'fixed',
            zIndex: '1',
            top: '0',
            left: '0',
            backgroundColor: 'transparent',
            overflow: 'hidden',
            borderRadius: '50%', // Making it circular
            clipPath: 'circle(50%)', // Clipping to a quarter circle
        }}>
            <Nav className='flex-column' style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${circleSize}px`,
                height: `${circleSize}px`,
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
                </NavLink> {/* Assuming you have a route for communities */}
            </Nav>
        </div>
    );
}

export default Sidebar;
