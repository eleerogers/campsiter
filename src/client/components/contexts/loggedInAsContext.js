import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const LoggedInAsContext = React.createContext();

function LoggedInAsContextProvider({ children }) {
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

  useEffect(() => {
    if (localStorage.userId) {
      axios.get(`/api/users/${localStorage.userId}`)
        .then(({
          data: {
            user: {
              admin,
              created_at: createdAt,
              email,
              first_name: firstName,
              last_name: lastName,
              id,
              image,
              image_id: imageId,
              password,
              username
            }
          }
        }) => {
          const updatedLoggedInAs = {
            admin,
            createdAt,
            email,
            firstName,
            lastName,
            id,
            image,
            imageId,
            password,
            username
          };
          setLoggedInAs(updatedLoggedInAs);
        })
        .catch((err) => {
          const { response: { status, data: message } } = err;
          toast.error(`${message} (${status})`);
        });
    }
  }, []);

  async function logoutUser(path, push) {
    try {
      const pathArr = path.split('/');
      const pathLast = pathArr.pop();
      await axios.get('/api/users/logout');
      localStorage.removeItem('userId');
      setLoggedInAs(loggedInAsInit);
      if (
        pathLast === 'new'
        || pathLast === 'edit'
        || pathLast === 'newCampground'
        || pathLast === 'editCampground'
      ) {
        push('/campgroundsHome');
      }
    } catch (err) {
      const { response: { status, data: message } } = err;
      toast.error(`${message} (${status})`);
    }
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
