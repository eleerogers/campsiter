import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { toast } from 'react-toastify';
import useForm from '../hooks/useForm';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';


function Reset() {
  const [rPEmail, setRPEmail] = useState();
  const { push } = useHistory();
  const { reset_password_token: resetPasswordToken } = useParams();
  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  useEffect(() => {
    if (localStorage.userId) {
      push('/campgroundsHome');
    }
  }, [push]);

  useEffect(() => {
    let source = axios.CancelToken.source;
    axios.get(`/api/users/token/${resetPasswordToken}`, { cancelToken: source.token })
      .then(({ data: { user: { email } } }) => {
        setRPEmail(email);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('axios call was cancelled');
        } else {
          console.error(err);
        }
      });
  }, [resetPasswordToken]);

  const { values, handleChange } = useForm({ password1: '', password2: '' });
  const { password1, password2 } = values;

  const cancelTokenRef = useRef();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function submitEmailReset(event) {
    event.preventDefault();
    setLoadingTrue();
    cancelTokenRef.current = axios.CancelToken.source();
    const cancelToken = cancelTokenRef.current.token;
    try {
      if (password1 !== '') {
        if (password1 === password2) {
          const pwData = {
            password: password1,
            reset_password_token: resetPasswordToken
          };
          const { data, status } = await axios.post('/api/users/reset', pwData, { cancelToken });
          if (status === 201) {
            toast.success(data);
            push('/login');
          } else {
            console.log(`${data} (${status})`);
          }
        } else {
          toast.error('Password fields do not match');
        }
      } else {
        toast.error('Password cannot be blank');
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      } else {
        const { response: { data: message } } = err;
        toast.error(`${message}`);
      }
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="margin-top-50">
      <Container>
        <h2 className="text-center">
          Reset Password:
        </h2>
        <h4 className="text-center">{ rPEmail }</h4>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitEmailReset}
        >
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              name="password1"
              placeholder="New Password"
              value={password1}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={password2}
              onChange={handleChange}
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
        </form>
      </Container>
    </div>
  );
}

export default Reset;
