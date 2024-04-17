import React from 'react';
import { useLocation } from 'react-router-dom';

function ViewUserProfile() {
  const { state } = useLocation();
  const { user } = state;

  return (
    <div>
      <h2>{user.usename}</h2>
      <p>{user.bio}</p>
      <p>{user.userAddress}</p>
      <button onClick={() => console.log("Request sent to", user.usename)}>Request</button>
    </div>
  );
}

export default ViewUserProfile;
