import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LoggedInAsContext = React.createContext();

function LoggedInAsContextProvider(props) {
  const loggedInAsInit = {
    id: '',
    password: '',
    email: '',
    created_at: '',
    admin: false,
    image: '',
    imageId: '',
    firstName: '',
    lastName: '',
    username: ''
  };
  const [loggedInAs, setLoggedInAs] = useState(loggedInAsInit);
  const { children } = props;

  function logoutUser() {
    setLoggedInAs(loggedInAsInit);
  }

  return (
    <LoggedInAsContext.Provider
      value={{ loggedInAs, setLoggedInAs, logoutUser }}
    >
      {children}
    </LoggedInAsContext.Provider>
  );
}

LoggedInAsContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { LoggedInAsContextProvider, LoggedInAsContext };
