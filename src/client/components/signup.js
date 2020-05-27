import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import '../app.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';


function Signup() {
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
    adminCode: '',
  };
  const { values, handleChange } = useForm(initFormData);
  const {
    username,
    firstName,
    lastName,
    email,
    password1,
    password2,
    adminCode,
  } = values;
  const initBtnMessage = 'Select avatar image (optional)';
  const { imageFile, btnMessage, handleFileChange } = useGetFileName(initBtnMessage);

  useEffect(() => {
    if (loggedInAsId.length > 0) {
      push('/campgrounds');
    }
  }, [loggedInAsId, push]);

  async function submitForm(event) {
    event.preventDefault();

    if (password1 === password2) {
      const fd = new FormData();
      fd.append('username', username);
      fd.append('password', password1);
      fd.append('firstName', firstName);
      fd.append('lastName', lastName);
      fd.append('email', email);
      fd.append('adminCode', adminCode);
      if (imageFile) {
        fd.append('image', imageFile);
      }

      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      try {
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
      }
    } else {
      toast.error('Passwords do not match');
    }
  }

  return (
    <div className="margin-top-50">
      <Container>
        <h1 className="text-center">Create your account</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              name="password1"
              placeholder="Password"
              value={password1}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              name="password2"
              placeholder="Verify Password"
              value={password2}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
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
              className="btn btn-outline-primary btn-block"
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
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="adminCode"
              placeholder="Admin Code (if applicable)"
              value={adminCode}
              onChange={handleChange}
            />
          </div>
          <br />
          <div className="form-group">
            <Button
              className="btn-block"
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </div>
          <Button onClick={goBack} className="float-left" size="sm" variant="link">Go Back</Button>
        </form>
      </Container>
    </div>
  );
}

export default Signup;
