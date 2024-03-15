import React from 'react';
import { Button } from 'react-bootstrap';

function ConnectWalletButton({ onConnect }) {
  return <Button onClick={onConnect}>Connect Wallet</Button>;
}

export default ConnectWalletButton;
