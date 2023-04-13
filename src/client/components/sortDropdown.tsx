import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types';

interface Props {
  value: "recent" | "alpha" | "rating";
  setValue: (newString: string) => void;
}

function SortDropdown({value, setValue}: Props) {
  const handleSelect = (e: string | null) => {
    const newString = e + '';
    setValue(newString);
  }
  const keyObj = {
    "recent": "Recent",
    "alpha": "Name",
    "rating": "Rating"
  }

  return (
    <div className="App container">
      
      <DropdownButton
        title={keyObj[value]}
        onSelect={handleSelect}
        size="sm"
        className="btn-square sort-dropdown"
      >
        <Dropdown.Item eventKey="recent">Recent</Dropdown.Item>
        <Dropdown.Item eventKey="alpha">Name</Dropdown.Item>
        <Dropdown.Item eventKey="rating">Rating</Dropdown.Item>
      </DropdownButton>
    </div>
  );
}

SortDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired
};

export default SortDropdown;
