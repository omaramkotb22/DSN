import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

function SearchComponent({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  // Use onKeyDown to detect when the Enter key is pressed
  const handleKeyDown = (event) => {
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

export default SearchComponent;