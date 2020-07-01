import React, {
  useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/lib/Button';
import Container from 'react-bootstrap/lib/Container';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';


function Signup() {
  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);
  const {
    loggedInAs: {
      id: loggedInAsId
    }
  } = useContext(LoggedInAsContext);
  const {
    push,
    goBack
  } = useHistory();
  const initFormData = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password1: '',
    password2: '',
  };
  const { values, handleChange } = useForm(initFormData);
  const {
    username,
    firstName,
    lastName,
    email,
    password1,
    password2,
  } = values;
  const initBtnMessage = 'Select avatar image (optional)';
  const { imageFile, btnMessage, handleFileChange } = useGetFileName(initBtnMessage);

  useEffect(() => {
    if (loggedInAsId.length > 0) {
      push('/campgroundsHome');
    }
  }, [loggedInAsId, push]);

  async function submitForm(event) {
    event.preventDefault();
    if (password1 === password2) {
      const lNameNoPeriod = lastName.replace(/\.$/, "");
      const fd = new FormData();
      fd.append('username', username);
      fd.append('password', password1);
      fd.append('firstName', firstName);
      fd.append('lastName', lNameNoPeriod);
      fd.append('email', email);
      if (imageFile) {
        fd.append('image', imageFile);
      }

      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      try {
        setLoadingTrue();
        const {
          status,
          data: {
            message
          }
        } = await axios.post('/api/users', fd, config);
        if (status === 201) {
          toast.success(message);
          push('/login');
        } else {
          const error = new Error();
          error.response = {
            status: 400,
            data: 'Unsuccessful request'
          };
          throw error;
        }
      } catch (err) {
        const { response: { status, data: message } } = err;
        toast.error(`${message} (${status})`);
      } finally {
        setLoadingFalse();
      }
    } else {
      toast.error('Passwords do not match');
    }
  }

  return (
    <div className="margin-top-50 marginBtm">
      <Container>
        <h1 className="text-center color-dark-blue">Create your account</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <input
              className="form-control shadow-none"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control shadow-none"
              type="password"
              name="password1"
              placeholder="Password"
              value={password1}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control shadow-none"
              type="password"
              name="password2"
              placeholder="Verify Password"
              value={password2}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control shadow-none"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control shadow-none"
              type="text"
              name="lastName"
              placeholder="Last Name (or initial)"
              value={lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control shadow-none"
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="file-upload"
              className="btn btn-outline-info btn-block"
            >
              <input
                id="file-upload"
                type="file"
                name="image"
                data-multiple-caption={btnMessage}
                onChange={handleFileChange}
              />
              <span>{btnMessage}</span>
            </label>
          </div>
          <br />
          <div className="form-group">
            <LoadingButton
              isLoading={loading}
              className="btn-block loading-button btn-square btn-orange shadow-none"
              variant="primary"
              type="submit"
            >
              Submit
            </LoadingButton>
          </div>
          <Button 
            onClick={goBack} 
            className="float-left go-back-btn" 
            size="sm" 
            variant="link"
          >
            Go Back
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default Signup;
