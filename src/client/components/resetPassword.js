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
  const isMounted = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    if (localStorage.userId) {
      push('/campgroundsHome');
    }
  }, [push]);

  useEffect(() => {
    axios.get(`/api/users/token/${resetPasswordToken}`)
      .then(({ data: { user: { email } } }) => {
        if (isMounted.current) {
          setRPEmail(email);
        }
      });
  }, [resetPasswordToken]);

  const { values, handleChange } = useForm({ password1: '', password2: '' });
  const { password1, password2 } = values;

  async function submitEmailReset(event) {
    event.preventDefault();
    setLoadingTrue();
    try {
      if (password1 !== '') {
        if (password1 === password2) {
          const pwData = {
            password: password1,
            reset_password_token: resetPasswordToken
          };
          const { data, status } = await axios.post('/api/users/reset', pwData);
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
      const { response: { data } } = err;
      toast.error(`${data}`);
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
