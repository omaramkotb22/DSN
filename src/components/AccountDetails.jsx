import React, { useState, useEffect } from 'react';
import { Card, Dropdown, DropdownButton, ButtonGroup, ListGroup, Button, Toast } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import '../styles/AccountDetails.css';
const ethers = require('ethers');
const Web3 = require('web3');

function AccountDetails({ Address }){
  
  const [username, setUsername] = useState("");
  const [copied, setCopied] = useState(false);
  const client = new ApolloClient({
    uri: 'http://localhost:5005/graphql',
    cache: new InMemoryCache()
  });
  // Get the username from the database
  const fetchUsername = async () => {
    const queryUsername = gql`
      query Find($input: String!) {
        userSchemaIndex(
          filters: {
            where: {
              
              userAddress: {
                equalTo: $input 
              }
            }
          }
          first:1) {
          edges {
            node {
              id
              usename
              userAddress
            }
          }
        }
      }
          
    `
    const result = await client.query({
      query: queryUsername,
      variables: {
        input: Address
      }
    });
    setUsername(result.data.userSchemaIndex.edges[0].node.usename);

  }
  useEffect(() => { 
    fetchUsername();
  });
  
  // shortAddress is the first 6 characters and 
  // the last 4 characters of the Address
  // To be displayed in the UI
  const [ethBalance, setEthBalance] = useState(0.000);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const fetchEthBalance = async () => {
    const balance = await provider.getBalance(Address);
    setEthBalance(Web3.utils.fromWei(balance, 'ether'));
  }
  useEffect( () => { // Fetch the ETH balance of the user
    fetchEthBalance();
  });
  const shortAddress = `${Address.slice(0, 6)}...${Address.slice(-4)}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(Address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Display the tick for 2 seconds
    
  }

  return (
    <DropdownButton title={username || 'Account Details'} variant="secondary" className="account-dropdown">
      <div className='dropdown-content'> 
        <div className="dropdown-content">
          <div className="dropdown-detail">
            <p className="dropdown-title">{username}</p>
            <p className="dropdown-subtitle">{`${Address.slice(0, 6)}...${Address.slice(-4)}`}</p>
            <p className="dropdown-subtitle">{`${ethBalance} ETH`}</p>
          </div>
          <Button variant="outline-light" className="copy-button" onClick={copyToClipboard}>
            <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`}></i>
          </Button>
        </div>
      </div>

    </DropdownButton>
  );
};

export default AccountDetails;
