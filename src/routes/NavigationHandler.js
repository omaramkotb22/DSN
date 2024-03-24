import { useNavigate } from 'react-router-dom';
import React from 'react';

function NavigationHandler({ setSidebarAction }) {
    const navigate = useNavigate();
    

    
    const handleAddPost = () => {
        navigate('/add-post');
    };



    
    React.useEffect(() => {
        setSidebarAction({
            onAddPost: handleAddPost,
            
        });
    }, [setSidebarAction]);

    return null; 
}

export default NavigationHandler;
