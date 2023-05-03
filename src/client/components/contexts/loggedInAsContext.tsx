import React, { useState, useEffect, useRef, useContext, ReactNode } from 'react';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { IUserCamelCase, ILoggedInAsContext } from '../../interfaces';


const loggedInAsInit: IUserCamelCase = {
  id: '',
  password: '',
  email: '',
  createdAt: '',
  admin: false,
  image: '',
  imageId: '',
  firstName: '',
  lastName: '',
  username: ''
};

interface Props {
  children?: ReactNode;
}

const LoggedInAsContext = React.createContext<ILoggedInAsContext | null>(null);

function LoggedInAsContextProvider({ children }: Props) {
  
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
          const updatedLoggedInAs: IUserCamelCase = {
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

  const cancelTokenRef = useRef<CancelTokenSource>();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function logoutUser(path: string, push: (route: string) => void) {
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
    } catch (error) {
      const err = error as AxiosError
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      } else {
        if (err.response && err.response.data) {
          const { response: { data: message } } = err;
          toast.error(`${message}`);
        }
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

const useLoggedInAsContext = () => {
  return useContext(LoggedInAsContext);
};

export { LoggedInAsContextProvider, LoggedInAsContext, useLoggedInAsContext };
