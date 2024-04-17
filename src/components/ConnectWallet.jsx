import React from 'react';
import { Button } from 'react-bootstrap';
import metamask from '../assets/icons/metamask.svg';
import '../styles/ConnectWallet.css'; 

function ConnectWallet({ onConnect }) {
  return (
    <div className="connect-wallet-container">
      <Button onClick={onConnect} className="connect-wallet-button" variant='light'>
        <img src={metamask} alt="MetaMask" />
        Login with MetaMask
      </Button>
    </div>
  );
}

export default ConnectWallet;
