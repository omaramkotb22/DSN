import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const client = new ApolloClient({
    uri: 'http://localhost:5005/graphql',
    cache: new InMemoryCache()
  });

  const findUserByUsername = async (username) => {
    const query = gql`
      query SearchUser($term: String!) {
        userSchemaIndex(filters: { 
          where: {
            
                usename: {
                  equalTo: $term 
                }
          }

        }, last: 1) { 
          edges {
            node {
              userAddress
              usename
              bio
            }
          }
        }
      }`
      try {
      const result = await client.query({
        query: query,
        variables: { term: username }
      });
      if (result.data.userSchemaIndex.edges.length > 0) {
        const user = result.data.userSchemaIndex.edges[0].node; // Get the first user with the same username
        navigate(`/users/${user.userAddress}`, { state: { user } });
      } else {
        console.log("No user found.");
      }
    } catch (error) {
      console.error("Search error:", error);
    };

  }

  const handleSearch = () => {
    findUserByUsername(searchTerm);
    
  };

  
  const handleKeyDown = (event) => { // On Key Down event handler, that when user presses 'Enter' 
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <InputGroup className="mb-3 search-group">
      <FormControl
        placeholder="Search..."
        aria-label="Search posts"
        aria-describedby="button-addon2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown} // Updated from onKeyPress to onKeyDown
        className="search-input"
      />
      <Button variant="outline-light" id="button-addon2" onClick={handleSearch} className="search-button">
        <i className="bi bi-search"></i>
      </Button>
    </InputGroup>
  );
}

export default SearchBar;