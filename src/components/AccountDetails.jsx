import React, { useState } from 'react';
import { Card, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';

const AccountDetails = ({ username, ethBalance, usdBalance }) => {
  const [showDropdown, setShowDropdown] = useState(true);

  const handleToggle = () => setShowDropdown(showDropdown);

  return (
    <Card style={{
      position: 'absolute', 
      top: 20, 
      right: 20, 
      background: 'rgba(255, 255, 255, 0.5)', 
      borderRadius: '15px', 
      width: '300px', // Adjust the width as needed
      padding: '10px',
      textAlign: 'center' // Center align text
    }}>
      <Card.Body>
        <div onClick={handleToggle} style={{ cursor: 'pointer' }}>
          <div><strong>{ethBalance} ETH</strong></div>
          <div><strong>{usdBalance}</strong></div>
          <div><strong>username</strong></div> {/* Replace with the actual username once implemented */}
        </div>
        
        {showDropdown && (
          <DropdownButton
            as={ButtonGroup}
            id="dropdown-item-button"
            title=""
            show={showDropdown}
            onMouseLeave={() => setShowDropdown(false)} // Hide when not hovered
          >
            <Dropdown.ItemText>Wallet balance</Dropdown.ItemText>
            <Dropdown.Item as="button">{usdBalance}</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.ItemText>Tokens</Dropdown.ItemText>
            <Dropdown.Item as="button">{ethBalance} ETH</Dropdown.Item>
          </DropdownButton>
        )}
      </Card.Body>
    </Card>
  );
};

export default AccountDetails;
