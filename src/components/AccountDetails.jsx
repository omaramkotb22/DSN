import React, { useState, useEffect } from 'react';
import { Card, Dropdown, DropdownButton, ButtonGroup, ListGroup, Button } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
const ethers = require('ethers');
const Web3 = require('web3');

function AccountDetails({ Address }){
  
  const [username, setUsername] = useState("");
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
  }

  return (
    <DropdownButton title={username} >
      <Card>
      <Card.Header>
        <Card.Title> {username} </Card.Title>
        <Card.Subtitle> {shortAddress} </Card.Subtitle>
        <ButtonGroup>
          <Button onClick={copyToClipboard}>Copy Address</Button>
        </ButtonGroup>
      </Card.Header>
      <ListGroup variant='flush'>
        
        <ListGroup.Item>ETH Balance: {ethBalance} </ListGroup.Item>
        <ListGroup.Item> $ 1250.00</ListGroup.Item>  
      </ListGroup>
      </Card>
    </DropdownButton>
  );
};

export default AccountDetails;
