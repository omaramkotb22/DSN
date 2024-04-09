import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectToProfileOrConnect(isConnected, isNewUser) {
    const navigate = useNavigate();
    useEffect(() => {
        if (isConnected) {
          if (isNewUser) {
            navigate('/create-profile');
          } else {
            navigate('/posts');
          }
        } else {
          navigate('/connect');
        }
      }, [isNewUser, isConnected, navigate]);
    
      return null; // This component does not render anything

}
export default RedirectToProfileOrConnect;
