import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';
import { ILoggedInAsContext } from '../interfaces';


function Forgot() {
  const [email, setEmail] = useState('');
  const { push } = useHistory();
  const {
    loggedInAs: {
      id: loggedInAsId
    }
  } = useContext(LoggedInAsContext) as ILoggedInAsContext;

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  useEffect(() => {
    if (loggedInAsId.length > 0) {
      push('/campgroundsHome');
    }
  }, [loggedInAsId, push]);

  function onEmailFormChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  const cancelTokenRef = useRef<CancelTokenSource>();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function submitEmailReset(event: React.FormEvent) {
    event.preventDefault();
    setLoadingTrue();
    cancelTokenRef.current = axios.CancelToken.source();
    const cancelToken = cancelTokenRef.current.token;
    try {
      const { data, status } = await axios.post('api/users/forgot', { email }, { cancelToken });
      if (status === 200) {
        toast.success(data);
        push('/campgroundsHome');
      }
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      } else {
        if (err.response && err.response.statusText) {
          const { response: { statusText } } = err;
          toast.error(`${statusText}`);
        }
      }
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="margin-top-50 marginBtm">
      <Container>
        <h1 className="text-center">Forgot Password</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={(e) => submitEmailReset(e)}
        >
          <div className="form-group">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={onEmailFormChange}
            />
          </div>
          <br />
          <div className="form-group">
            <LoadingButton
              isLoading={loading}
              className="btn-block loading-button"
              variant="primary"
              type="submit"
            >
              Reset Password
            </LoadingButton>
          </div>
          <Link to="/login">
            <Button
              size="sm"
              variant="link"
              className="float-left go-back-btn"
            >
              Go Back
            </Button>
          </Link>
        </form>
      </Container>
    </div>
  );
}

export default Forgot;
