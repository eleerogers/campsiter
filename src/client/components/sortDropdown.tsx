import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types';


interface Props {
  value: string;
  setValue: (newString: string) => void;
}

function SortDropdown({value, setValue}: Props) {
  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setValue(eventKey);
    }
  }
 
  return (
    <div className="App container">
      
      <DropdownButton
        title={value}
        onSelect={handleSelect}
        size="sm"
        className="btn-square sort-dropdown"
      >
        <Dropdown.Item eventKey="Recent">Recent</Dropdown.Item>
        <Dropdown.Item eventKey="Name">Name</Dropdown.Item>
        <Dropdown.Item eventKey="Rating">Rating</Dropdown.Item>
      </DropdownButton>
    </div>
  );
}

SortDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired
};

export default SortDropdown;
