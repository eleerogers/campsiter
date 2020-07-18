import React, { useState, useEffect, useRef } from 'react';
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
    let useEffectSource = axios.CancelToken.source();
    if (localStorage.userId) {
      axios.get(`/api/users/${localStorage.userId}`, { cancelToken: useEffectSource.token })
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
          if (axios.isCancel(err)) {
            console.log(`axios call was cancelled`);
          } else {
            const { response: { data: message } } = err;
            toast.error(`${message}`);
          }
        });
    }
    return () => { useEffectSource.cancel() };
  }, []);

  const cancelTokenRef = useRef();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function logoutUser(path, push) {
    cancelTokenRef.current = axios.CancelToken.source();
    const cancelToken = cancelTokenRef.current.token;
    try {
      const pathArr = path.split('/');
      const pathLast = pathArr.pop();
      await axios.get('/api/users/logout', { cancelToken });
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
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      } else {
        const { response: { data: message } } = err;
        toast.error(`${message}`);
      }
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
