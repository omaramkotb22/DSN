import React, {useState, useEffect} from 'react';
import { Button, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import models from '../models/runtime-merged-composite.json';

function ConnectWalletButton({ onConnect, currentWalletAddress }) {
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState(false);
  return (

  <div>
    <Button onClick={onConnect} variant='primary'>Login</Button>
  </div>
  
  );
}

export default ConnectWalletButton;
