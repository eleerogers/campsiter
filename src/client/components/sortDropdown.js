import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types';


function SortDropdown({value, setValue}) {
  const handleSelect = (e, event) => {
    console.log(event)
    console.log(event.target)
    console.log(event.target.value)
    const newString = e + '';
    console.log(newString);
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
        // alignRight
        title={keyObj[value]}
        // id="dropdown-menu-align-right"
        onSelect={handleSelect}
        size="sm"
        className="btn-square mt-5"
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
